window.onload  = function () {
    var gameFieldElem = document.querySelector("#gameField");
    var sizeInput = document.querySelector("#sizeInput");
    var startGameElem = document.querySelector("#startGameControls");
    var restartGameElem = document.querySelector("#restartGameControls");
    var startGameBtn = document.querySelector("#gameStart");
    var restartGameBtn = document.querySelector("#gameReStart");
    var messageElem = document.querySelector("#messageSuccess");
    var messageErrorElem = document.querySelector("#messageError");
    var messageInfoElem = document.querySelector("#messageInfo");

    var field = [];
    var fieldSize = 3;
    // 1 - cross, -1 - zero
    var currentPlayer = 1;
    var userSign = 1;
    var robotSign = -1;
    var isRobotFirstStep = true;
    var isGameStarted = false;
    var winner = null;

    var cellClass = "cell";
    var cellZeroClass = "cell--zero";
    var cellCrossClass = "cell--cross";
    var errorCellClass = "cell--error";
    var cellSize = 7;
    var cellSizeUnit = "rem";
    var hiddenClass = "hidden";

    var generateGameField = function () {
        field = [];
        for (var i=0; i<fieldSize; i++) {
            field.push([]);
            for (var j=0; j<fieldSize; j++) {
                field[i].push(0);
            }
        }

        console.log(field);
    };

    var getPrimaryDiagonalInfo = function () {
        var info = {
            userScores: 0,
            robotScores: 0,
            firstFreeX: null,
            firstFreeY: null,
            lastFreeX: null,
            lastFreeY: null,
            isTotallyFree: true
        };

        var isFirst = true;

        for (var i=0; i<fieldSize; i++) {

            if (field[i][i] == robotSign) {
                info.robotScores++;
            } else if (field[i][i] == userSign) {
                info.userScores++;
            }

            if (field[i][i] == 0) {
                info.lastFreeX = i;
                info.lastFreeY = i;

                if (isFirst) {
                    info.firstFreeX = i;
                    info.firstFreeY = i;
                    isFirst = false;
                }
            } else {
                info.isTotallyFree = false;
            }
        }

        return info;
    };

    var getSecondaryDiagonalInfo = function () {
        var info = {
            userScores: 0,
            robotScores: 0,
            firstFreeX: null,
            firstFreeY: null,
            lastFreeX: null,
            lastFreeY: null,
            isTotallyFree: true
        };

        var isFirst = true;

        for (var i=0; i<fieldSize; i++) {
            var j = fieldSize - i - 1;

            if (field[i][j] == robotSign) {
                info.robotScores++;
            } else if (field[i][j] == userSign) {
                info.userScores++;
            }

            if (field[i][j] == 0) {
                info.lastFreeX = i;
                info.lastFreeY = j;

                if (isFirst) {
                    info.firstFreeX = i;
                    info.firstFreeY = j;
                    isFirst = false;
                }
            } else {
                info.isTotallyFree = false;
            }
        }

        return info;
    };

    var getColumnsInfo = function () {
        var columnsInfo = [];

        for (var j=0; j<fieldSize; j++) {

            var info = {
                userScores: 0,
                robotScores: 0,
                firstFreeX: null,
                firstFreeY: null,
                lastFreeX: null,
                lastFreeY: null,
                isTotallyFree: true
            };

            var isFirst = true;

            for (var i=0; i<fieldSize; i++) {
                if (field[i][j] == robotSign) {
                    info.robotScores++;
                } else if (field[i][j] == userSign) {
                    info.userScores++;
                }

                if (field[i][j] == 0) {
                    info.lastFreeX = i;
                    info.lastFreeY = j;

                    if (isFirst) {
                        info.firstFreeX = i;
                        info.firstFreeY = j;
                        isFirst = false;
                    }
                } else {
                    info.isTotallyFree = false;
                }
            }

            columnsInfo.push(info);
        }

        return columnsInfo;
    };

    var getRowsInfo = function () {

        var rowsInfo = [];

        for (var i=0; i<fieldSize; i++) {
            var info = {
                userScores: 0,
                robotScores: 0,
                firstFreeX: null,
                firstFreeY: null,
                lastFreeX: null,
                lastFreeY: null,
                isTotallyFree: true
            };

            var isFirst = true;

            for (var j=0; j<fieldSize; j++) {
                if (field[i][j] == robotSign) {
                    info.robotScores++;
                } else if (field[i][j] == userSign) {
                    info.userScores++;
                }

                if (field[i][j] == 0) {
                    info.lastFreeX = i;
                    info.lastFreeY = j;

                    if (isFirst) {
                        info.firstFreeX = i;
                        info.firstFreeY = j;
                        isFirst = false;
                    }
                } else {
                    info.isTotallyFree = false;
                }
            }

            rowsInfo.push(info)
        }

        return rowsInfo;
    };

    var highlightCellAtCoords = function (x, y, sign) {
        var cells = document.getElementsByClassName(cellClass);
        var index = (fieldSize * x) + y;
        var className = cellCrossClass;

        if (sign == -1) {
            className = cellZeroClass;
        }

        cells[index].classList.add(className);
    };

    var showMessage = function (type, text) {
        var message = messageElem;

        if (type == "error") {
            message = messageErrorElem;
        } else if (type == "info") {
            message = messageInfoElem;
        }

        message.innerHTML = text;
        message.classList.remove(hiddenClass)
    };

    var hideMessage = function (type) {
        var message = messageElem;

        if (type == "error") {
            message = messageErrorElem;
        } else if (type == "info") {
            message = messageInfoElem;
        }

        message.innerHTML = "";
        message.classList.add(hiddenClass)
    };

    var getRandomFreeCellCoords = function () {
        var coords = {};

        coords.x = Math.floor(Math.random() * fieldSize);
        coords.y = Math.floor(Math.random() * fieldSize);

        while (field[coords.x][coords.y] != 0) {
            coords.x = Math.floor(Math.random() * fieldSize);
            coords.y = Math.floor(Math.random() * fieldSize);
        }

        return coords;
    };

    var getFieldInfo = function () {
        var pdInfo = getPrimaryDiagonalInfo();
        var sdInfo = getSecondaryDiagonalInfo();
        var columnsInfo = getColumnsInfo();
        var rowsInfo = getRowsInfo();

        var info = columnsInfo.concat(rowsInfo);
        info.push(pdInfo);
        info.push(sdInfo);

        return info;
    };

    var hasWinner = function () {
        var info = getFieldInfo();
        var userMaxScores = 0;
        var robotMaxScores = 0;
        var fieldHasAnyFreeLine = false;
        var fieldHasOnlyRobotFreeLine = false;

        for (var i=0; i<info.length; i++) {
            if (info[i].userScores > userMaxScores) {
                userMaxScores = info[i].userScores;
            }

            if (info[i].robotScores > robotMaxScores) {
                robotMaxScores = info[i].robotScores;
            }

            if (info[i].isTotallyFree) {
                fieldHasAnyFreeLine = true;
            }

            if (info[i].userScores == 0 && info[i].firstFreeX != null) {
                fieldHasOnlyRobotFreeLine = true;
            }
        }

        if (userMaxScores == fieldSize) {
            winner = userSign;
            return true;
        } else if (robotMaxScores == fieldSize) {
            winner = robotSign;
            return true;
        } else if (!fieldHasAnyFreeLine && !fieldHasOnlyRobotFreeLine) {
            winner = 0;
            return true;
        }

        return false;
    };

    var killTheHumans = function () {
        var x;
        var y;

        if (!isGameStarted) return;

        if (isRobotFirstStep) {
            var random = getRandomFreeCellCoords();
            x = random.x;
            y = random.y;
            isRobotFirstStep = false;
        } else {
            var info = getFieldInfo();


            var userMaxUsefulScores = 0;
            var userMaxIndex = null;
            var robotMaxUsefulScores = 0;
            var robotMaxIndex = null;
            var fieldHasEmptyCells = false;

            for (var i=0; i<info.length; i++) {
                if (info[i].userScores > userMaxUsefulScores && info[i].firstFreeX != null) {
                    userMaxUsefulScores = info[i].userScores;
                    userMaxIndex = i;
                    fieldHasEmptyCells = true;
                }

                if (info[i].robotScores > robotMaxUsefulScores && info[i].firstFreeX != null) {
                    robotMaxUsefulScores = info[i].robotScores;
                    robotMaxIndex = i;
                    fieldHasEmptyCells = true;
                }
            }

            if (userMaxUsefulScores > robotMaxUsefulScores) {
                if (info[userMaxIndex].firstFreeX != null) {
                    x = info[userMaxIndex].firstFreeX;
                    y = info[userMaxIndex].firstFreeY;
                } else if (info[robotMaxIndex].firstFreeX != null) {
                    x = info[robotMaxIndex].firstFreeX;
                    y = info[robotMaxIndex].firstFreeY;
                } else {
                    var random = getRandomFreeCellCoords();
                    x = random.x;
                    y = random.y;
                }
            } else  {
                if (info[robotMaxIndex].firstFreeX != null) {
                    x = info[robotMaxIndex].firstFreeX;
                    y = info[robotMaxIndex].firstFreeY;
                } else if (info[userMaxIndex].firstFreeX != null) {
                    x = info[userMaxIndex].firstFreeX;
                    y = info[userMaxIndex].firstFreeY;
                }   else {
                    var random = getRandomFreeCellCoords();
                    x = random.x;
                    y = random.y;
                }
            }
        }

        field[x][y] = currentPlayer;
        currentPlayer = userSign;
        highlightCellAtCoords(x, y, robotSign);

        if (hasWinner()) {
            finishGame();
        }
    };

    var startGame = function () {
        var rand = Math.floor(Math.random() * 2);
        isRobotFirstStep = true;
        isGameStarted = true;
        currentPlayer = 1;
        winner = null;

        if (rand == 0) {
            userSign = -1;
            robotSign = 1;

            setTimeout(function () {
                killTheHumans();
            }, 700);
        } else {
            userSign = 1;
            robotSign = -1;
        }
    };

    var finishGame = function () {
        currentPlayer = 0;
        isGameStarted = false;

        hideMessage("success");
        hideMessage("error");
        hideMessage("info");

        if (winner == userSign) {
            showMessage("success", "Ура! Вы победили!");
        } else if (winner == robotSign) {
            showMessage("error", "Компьютер победил!");
        } else if (winner == 0) {
            showMessage("error", "Ничья :(");
        }
    };

    var cellClickHandler = function () {

        if (currentPlayer != userSign || !isGameStarted) return;

        var x = this.getAttribute("data-x") * 1;
        var y = this.getAttribute("data-y") * 1;
        var isEmptyCell = field[x][y] == 0;

        if (isEmptyCell) {
            field[x][y] = userSign;
            highlightCellAtCoords(x,y, userSign);
            currentPlayer = robotSign;

            if (hasWinner()) {
                finishGame();
            } else {
                setTimeout(function () {
                    killTheHumans();
                }, 700);
            }
        } else {
            this.classList.add(errorCellClass);

            var that = this;
            setTimeout(function () {
                that.classList.remove(errorCellClass);
            }, 200);
        }
    };

    var drawGameField = function () {
        gameFieldElem.innerHTML = "";
        gameFieldElem.style.width = (cellSize * fieldSize) + cellSizeUnit;

        for (var i=0; i<fieldSize; i++) {
            for (var j=0; j<fieldSize; j++) {
                var cell = document.createElement("div");
                cell.classList.add(cellClass);
                cell.setAttribute("data-x", i);
                cell.setAttribute("data-y", j);
                cell.onclick = cellClickHandler;
                gameFieldElem.appendChild(cell);
            }
        }
    };

    startGameBtn.onclick = function () {
        var value = sizeInput.value * 1;

        hideMessage("error");

        if (value >= 3 && value <= 12) {
            fieldSize = value;
            generateGameField();
            drawGameField();
            startGame();
            startGameElem.classList.add(hiddenClass);
            restartGameElem.classList.remove(hiddenClass);

            var message = "Вы играете <b>ноликами</b>";

            if (userSign == 1) {
                message = "Вы играете <b>крестиками</b>";
            }

            showMessage("info", message);

        } else {
            showMessage("error", "Введите число от 3 до 12!");
        }
    };

    restartGameBtn.onclick = function () {
        finishGame();
        startGameElem.classList.remove(hiddenClass);
        restartGameElem.classList.add(hiddenClass);
        gameFieldElem.innerHTML = "";
    };


};