/*
let image = document.createElement("div");

image.style.backgroundImage = "url('link.png')";
image.style.width = "32px";
image.style.height = "30px";

document.body.append(image);
 */

class DisplayObject {
	/**
	 * @type HTMLElement
	 * Визуальный компонент, хтмл элемент который будет добавлятся в боди
	 */
	view;
	_x = 0;
	_y = 0;
	_width = 0;
	_height = 0;
	_rotation = 0;

	constructor() {
		this.initialize();
	}

	get width() {
		return this.view.clientWidth;
	}

	get height() {
		return this.view.clientHeight;
	}

	set x(value) {
		this.view.style.left = `${value}px`;
		this._x = value;
	}

	get x() {
		return this._x;
	}

	set y(value) {
		this.view.style.top = `${value}px`;
		this._y = value;
	}

	get y() {
		return this._y;
	}

	set rotation(value) {
		this.view.style.transform = `rotate(${value}deg)`;
		this._rotation = value;
	}

	get rotation() {
		return this._rotation;
	}

	initialize() {
		this.createView();
		this.applyStyles();
	}

	createView() {
		this.view = document.createElement("div");
	}

	applyStyles() {
		//выставляем позише абсюлют т.к спрайты у нас ходят по экрану по координатам X, Y
		this.view.style.position = "absolute";
	}

	update() {}
}

class Image extends DisplayObject {
	constructor(x, y, width, height, source) {
		super();

		this._sourceX = x;
		this._sourceY = y;
		this.sourceWidth = width;
		this.sourceHeight = height;
		this.source = source;

		this.applySpriteSheetStyles();
	}

	set sourceX(value) {
		this._sourceX = value;
		//this.setSourcePosition();
	}

	get sourceX() {
		return this._sourceX;
	}

	set sourceY(value) {
		this._sourceY = value;
		//this.setSourcePosition();
	}

	get sourceY() {
		return this._sourceY;
	}

	createView() {
		this.view = document.createElement("div");
	}

	applySpriteSheetStyles() {
		this.view.style.backgroundImage = `url('${this.source}')`;
		this.applySourcePosition();
		this.applySourceSize();
	}

	applySourceSize() {
		this.view.style.width = `${this.sourceWidth}px`;
		this.view.style.height = `${this.sourceHeight}px`;
	}

	applySourcePosition() {
		this.view.style.backgroundPosition = `${-this._sourceX}px ${-this._sourceY}px`;
	}
}

class Container extends DisplayObject {
	childsList = [];

	constructor() {
		super();
	}

	applyStyles() {
		this.view.style.position = "absolute";
	}

	addChild(child) {
		this.childsList.push(child);
		this.view.append(child.view);
	}
}

class Tower extends Container {
	/**
	 * tower platform part
	 * @type Image;
	 */
	platform;

	/**
	 * tower turret part
	 * @type Image
	 */
	tower;

	constructor(platformImg, towerImg) {
		super();

		this.platform = new Image(0, 0, 256, 256, platformImg);
		this.tower = new Image(0, 0, 256, 256, towerImg);

		this.platform.x -= 256 / 2;
		this.platform.y -= 256 / 2;
		this.tower.x -= 256 / 2;
		this.tower.y -= 256 / 2;

		this.addChild(this.platform);
		this.addChild(this.tower);
	}

	swapPlatform(img) {
		this.platform.view.source = img;
		this.platform.view.style.backgroundImage = `url('${img}')`;
	}

	swapTower(img) {
		this.tower.view.source = img;
		this.tower.view.style.backgroundImage = `url('${img}')`;
	}

	set towerRotation(value) {
		this.tower.rotation = value;
	}

	get towerRotation() {
		return this.tower.rotation;
	}
}

class Laser extends DisplayObject {
	/**
	 * @type CanvasRenderingContext2D
	 */
	context;

	blurSize = 1;
	scale = 0.2;
	blurValue = 1;
	constructor(size) {
		super();

		this.view.width = 4;
		this.view.height = size;
		this.view.style.transformOrigin = "top";

		this.view.style.transform = `scale(${this.scale}) rotate(${this._rotation}deg)`;

		this.context = this.view.getContext('2d');
		this.context.lineWidth = 8;
		this.context.strokeStyle = "#FF0000";
		this.context.beginPath();
		this.context.moveTo(0, 0);
		this.context.lineTo(0, size);
		this.context.stroke();
	}

	set rotation(value) {
		this._rotation = value;
	}

	createView() {
		this.view = document.createElement("canvas");
		this.view.style.display = "block";
	}

	update() {
		this.blurSize += 4;

		if (this.scale < 1) {
			this.scale += 0.2;
			this.blurValue += 0.01;
		} else {
			this.blurValue += 0.5;
		}

		this.view.style.filter = `blur(${Math.sin(this.blurSize) * 4 + this.blurValue}px)`;
		this.view.style.transform = `scale(${this.scale}) rotate(${this._rotation}deg)`;

		if (this.blurValue >= 100) {
			this.view.remove();
		}
	}
}

class Stage {
	displayList = [];

	constructor() {
		setInterval(this.update.bind(this), 1000 / 60);
		document.addEventListener("mousemove", this.onMouseMove.bind(this));
	}

	onMouseMove(event) {
		this.mouseX = event.pageX;
		this.mouseY = event.pageY;
	}

	addChild(displayObject) {
		this.displayList.push(displayObject);
		gameView.append(displayObject.view);
	}

	removeChild(displayObject) {
		let index = this.displayList.find((element) => displayObject(element));

		if (index === -1) return;

		this.displayList.splice(index, 1);
		gameView.remove(displayObject.view);
	}

	update() {
		for (let displayObject of this.displayList) {
			displayObject.update();
		}
	}
}

class Game extends Stage {
	platformView = 0;
	towerView = 0;
	maxTowerView = 22;
	maxPlatformView = 19;

	constructor() {
		super();

		this.tower = new Tower("images/towers/0.png", "images/turrets/0.png");

		this.tower.x = (window.screen.width - 256) / 2;
		this.tower.y = (window.screen.height - 256) / 2;
		this.addChild(this.tower);

		document.addEventListener("keydown", this.onKeyDown.bind(this));
	}

	onKeyDown(event) {
		if (event.keyCode === 65 || event.keyCode === 37) {
			this.platformView++;

			if (this.platformView > this.maxPlatformView) {
				this.platformView = 0;
			}
		}

		if (event.keyCode === 68 || event.keyCode === 39) {
			this.platformView--;

			if (this.platformView < 0) {
				this.platformView = this.maxPlatformView;
			}
		}

		if (event.keyCode === 87 || event.keyCode === 38) {
			this.towerView++;

			if (this.towerView > this.maxTowerView) {
				this.towerView = 0;
			}
		}

		if (event.keyCode === 83 || event.keyCode === 40) {
			this.towerView--;

			if (this.towerView < 0) {
				this.towerView = this.maxTowerView;
			}
		}

		if (event.keyCode === 32) {
			let dx = this.mouseX - this.tower.x;
			let dy = this.mouseY - this.tower.y;
			let size = Math.sqrt(dx * dx + dy * dy);

			let laser = new Laser(size - 83);
			laser.x = this.tower.x + dx / size * 83;
			laser.y = this.tower.y + dy / size * 83;

			let angle = (Math.atan2(dx, dy) + Math.PI) * (-180 / Math.PI);

			laser.rotation = this.tower.towerRotation - 180;

			this.addChild(laser);
		}

		this.tower.swapPlatform(`images/towers/${this.platformView}.png`);
		this.tower.swapTower(`images/turrets/${this.towerView}.png`);
	}

	update() {
		super.update();
		graphics.clearRect(0, 0, debug.width, debug.height);

		let dx = this.mouseX - this.tower.x;
		let dy = this.mouseY - this.tower.y;
		let angle = (Math.atan2(dx, dy) + Math.PI) * (-180 / Math.PI);
		this.tower.towerRotation = angle;
		//this.tower.x+=1;
		//this.tower.y = 300 + Math.sin(this.tower.x/10) * 100;

		graphics.lineWidth = 2;
		graphics.strokeStyle = "#FF0000";

		let bounds = this.tower.view.getBoundingClientRect();

		graphics.strokeRect(this.tower.x - 8, this.tower.y - 8, 16, 16);
	}
}

document.body.style.backgroundColor = "#000000";

let game = new Game();

const graphics = debug.getContext('2d');
window.addEventListener('resize', resizeCanvas, false);



function resizeCanvas() {
	debug.width = window.innerWidth;
	debug.height = window.innerHeight;

	gameView.style.width = window.innerWidth + 'px';
	gameView.style.height = window.innerHeight + 'px';
}
resizeCanvas();
