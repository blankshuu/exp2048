var board = new Array();
var score = 0;

$(document).ready(function () {
	newgame();
});

function newgame() {
	init();
}

function init() {
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));

		}
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		for (var j = 0; j < 4; j++)
			board[i][j] = 0;
	}
	updateBoardView();
	generateOneNumber();
	generateOneNumber();

	score = 0;
	$('#score').text(score);
}

function updateBoardView() {
	$(".number-cell").remove();
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++) {
			$("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var theNumberCell = $("#number-cell-" + i + "-" + j);

			if (board[i][j] == 0) {
				theNumberCell.css('width', '0px');
				theNumberCell.css('height', '0px');
				theNumberCell.css('top', getPosTop(i, j) + 50);
				theNumberCell.css('left', getPosLeft(i, j) + 50);
			}
			else {
				theNumberCell.css('width', '100px');
				theNumberCell.css('height', '100px');
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getNumberBackgroudColor(board[i][j]));
				theNumberCell.css('color', getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}

		}
}

function generateOneNumber() {
	if (nospace(board))
		return false;
	var rendx = parseInt(Math.floor(Math.random() * 4));
	var rendy = parseInt(Math.floor(Math.random() * 4));
	while (true) {
		if (board[rendx][rendy] == 0)
			break;
		rendx = parseInt(Math.floor(Math.random() * 4));
		rendy = parseInt(Math.floor(Math.random() * 4));
	}
	var rendNumber = Math.random() < 0.5 ? 2 : 4;
	board[rendx][rendy] = rendNumber;
	showNumberWithAnimation(rendx, rendy, rendNumber);
	return true;
}

function nospace(board) {
	for (var i = 0; i < 4; i++)
		for (var j = 0; j < 4; j++)
			if (board[i][j] == 0)
				return false;
	return true;
}

$(document).keydown(function (event) {
	switch (event.keyCode) {
		case 37://left
			if (moveLeft()) {
				generateOneNumber();
				isgameover();
			}
			break;
		case 38://up
			if (moveUp()) {
				generateOneNumber();
				isgameover();
			}
			break;
		case 39://right
			if (moveRight()) {
				generateOneNumber();
				isgameover();
			}
			break;
		case 40://down
			if (moveDown()) {
				generateOneNumber();
				isgameover();
			}
			break;
		default:
			break;
	}
});

function isgameover() {
	if (nospace(board) && nomove(board))
		setTimeout("gameover()", 300);
}

function gameover() {
	alert('gameover');
}



function moveLeft() {
	if (!canMoveLeft(board))
		return false;

	for (var i = 0; i < 4; i++)
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {	//左边为空且无障碍物（可移动到该位置
						//move
						showMoveAnimation(i, j, i, k);//从ij移动到ik
						board[i][k] = board[i][j];
						board[i][j] = 0;
						//continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {	//左边为和ij位置相同的数字且无障碍物
						//move
						showMoveAnimation(i, j, i, k);//从ij移动到ik
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
						updateScore(score);
						//continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveRight() {
	if (!canMoveRight(board))
		return false;

	for (var i = 0; i < 4; i++)
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > j; k--) {	//！！！！！注意k必须大于j！！！！！！！！！
					if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {	//左边为空且无障碍物（可移动到该位置
						//move
						showMoveAnimation(i, j, i, k);//从ij移动到ik
						board[i][k] = board[i][j];
						board[i][j] = 0;
						//continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)) {	//左边为和ij位置相同的数字且无障碍物
						//move
						showMoveAnimation(i, j, i, k);//从ij移动到ik
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;

						score += board[i][k];
						updateScore(score);
						//continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveDown() {
	if (!canMoveDown(board))
		return false;

	for (var j = 0; j < 4; j++)
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > i; k--) {
					if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {	//左边为空且无障碍物（可移动到该位置
						//move
						showMoveAnimation(i, j, k, j);//从ij移动到kj
						board[k][j] = board[i][j];
						board[i][j] = 0;
						//continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {	//左边为和ij位置相同的数字且无障碍物
						//move
						showMoveAnimation(i, j, k, j);//从ij移动到ik
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;

						score += board[k][j];
						updateScore(score);
						//continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()", 200);
	return true;
}

function moveUp() {
	if (!canMoveUp(board))
		return false;

	for (var j = 0; j < 4; j++)
		for (var i = 1; i < 4; i++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < i; k++) {
					if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {	//左边为空且无障碍物（可移动到该位置
						//move
						showMoveAnimation(i, j, k, j);//从ij移动到kj
						board[k][j] = board[i][j];
						board[i][j] = 0;
						//continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {	//左边为和ij位置相同的数字且无障碍物
						//move
						showMoveAnimation(i, j, k, j);//从ij移动到ik
						//add
						board[k][j] += board[i][j];
						board[i][j] = 0;

						score += board[k][j];
						updateScore(score);
						//continue;
					}
				}
			}
		}
	setTimeout("updateBoardView()", 200);
	return true;
}




