const zero = 1;
const cross = 2;

function User(name, side) {
	this.name = name;
	this.wins = 0;
	this.defeats = 0;
	this.draws = 0;
	this.side = side;

	this.toString = function () {
		return name;
	};
}

let user1 = new User("Kit", zero);
let user2 = new User("Nekit", cross);

let gameField = [
	[0, 0, 0],
	[0, 0, 0],
	[0, 0, 0]
];

let currentUser = user1;
let turn = 0;

function checkWinner(gameField) {
	let horizontal0 = [gameField[0][0], gameField[0][1], gameField[0][2]];
	let horizontal1 = [gameField[1][0], gameField[1][1], gameField[1][2]];
	let horizontal2 = [gameField[2][0], gameField[2][1], gameField[2][2]];

	let vertical0 = [gameField[0][0], gameField[1][0], gameField[2][0]];
	let vertical1 = [gameField[0][1], gameField[1][1], gameField[2][1]];
	let vertical2 = [gameField[0][2], gameField[1][2], gameField[2][2]];

	let diagonalLeft = [gameField[0][0], gameField[1][1], gameField[2][2]];
	let diagonalRight = [gameField[0][2], gameField[1][1], gameField[2][0]];

	let combs = [
		horizontal0,
		horizontal1,
		horizontal2,
		vertical0,
		vertical1,
		vertical2,
		diagonalLeft,
		diagonalRight
	];

	for (let currentCombination of combs) {
		if (currentCombination[0] === 0) {
			continue;
		} else if (
			currentCombination[0] === currentCombination[1] &&
			currentCombination[0] === currentCombination[2]
		) {
			return currentCombination[0];
		}
	}
	return 0;
}

/**
 * заполняет игровое поле gameField,  (пустая, крестик или нолик)
 * @param gameField {Array}- массив содержащий игровое поле, тип
 */
function fillGameField(gameField) {
	for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
		for (let colIndex = 0; colIndex < 3; colIndex++) {
			let id = rowIndex + "" + colIndex;
			// eslint-disable-next-line unicorn/prefer-query-selector
			let cell = document.getElementById(id);

			if (gameField[rowIndex][colIndex] === 2) {
				cell.classList.add("style-zero");
			} else if (gameField[rowIndex][colIndex] === 1) {
				cell.classList.add("style-cross");
			} else {
				cell.classList.remove("style-cross", "style-zero");
			}
		}
	}
}

function addOnClickEvent(gameField) {
	for (let index = 0; index < gameField.length; index++) {
		for (let index_ = 0; index_ < gameField.length; index_++) {
			let id = index + "" + index_;
			// eslint-disable-next-line unicorn/prefer-query-selector
			let cell = document.getElementById(id);
			// eslint-disable-next-line unicorn/prefer-add-event-listener
			cell.onclick = function () {
				gameField[index][index_] = currentUser.side;
				// eslint-disable-next-line unicorn/prefer-add-event-listener
				cell.onclick = undefined;
				endOfTurn();
			};
		}
	}
}

startNewGame();

function clickDisabled() {
	for (let index = 0; index < gameField.length; index++) {
		for (let index_ = 0; index_ < gameField.length; index_++) {
			let id = index + "" + index_;
			// eslint-disable-next-line unicorn/prefer-query-selector
			let cell = document.getElementById(id);
			// eslint-disable-next-line unicorn/prefer-add-event-listener
			cell.onclick = undefined;
		}
	}
}

function endOfTurn() {
	fillGameField(gameField);
	turn++;
	if (checkWinner(gameField) === currentUser.side) {
		clickDisabled();
		setTimeout(() => {
			alert(`Winner: ${currentUser}`);
			startNewGame();
		}, 500);
	} else if (turn === 9) {
		draw();
	} else {
		currentUser = currentUser === user1 ? user2 : user1;
	}
}

function startNewGame() {
	gameField = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];
	// gameField = [
	// 	[1, 2, 1],
	// 	[1, 2, 2],
	// 	[2, 0, 1]
	// ];
	fillGameField(gameField);
	addOnClickEvent(gameField);
	currentUser = user1;
	turn = 0;
}

function draw() {
	if (checkWinner(gameField) === 0) {
		clickDisabled();
		setTimeout(() => {
			alert(`Draw`);
			startNewGame();
		}, 500);
	}
}
