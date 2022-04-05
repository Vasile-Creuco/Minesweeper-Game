var table = [];
var rows = 10;
var columns = 10;
var mines_count = 10;
var GameOver = false;
var locationMines = [];
var clickedMines = 0;

window.onload = function () {
    startGame();
}

function restartGame() {
    window.location.reload();
}

//add mines in table
function addMines() {
    let mines = mines_count;
    while (mines > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!locationMines.includes(id)) {
            locationMines.push(id);
            --mines;
        }
    }
}

function startGame() {
    document.getElementById('mines-count').innerText = mines_count;
    addMines();

    for (let r = 0; r < rows; ++r) {
        let row = [];
        for (let c = 0; c < columns; ++c) {
            let tile = document.createElement('div');
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener('click', minesClicked);
            tile.addEventListener('contextmenu', flagClicked);
            document.getElementById("table").append(tile);
            row.push(tile);
        }
        table.push(row);
    }
}
//add flag in cell
function flagClicked() {
    let tile = this;
    if (tile.innerText == "") {
        tile.innerText = "🚩";
    }
    if (tile.innerText == "🚩") {
        return;
    }
}

function minesClicked() {
    if (GameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (tile.innerText == "🚩") {
        return;
    }
    if (locationMines.includes(tile.id)) {
        GameOver = true;
        revealMines();
        return;
    }
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMines(r, c);
}
//open all the mines
function revealMines() {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            let tile = table[r][c];
            if (locationMines.includes(tile.id)) {
                tile.innerText = "💣";
                tile.classList.add("tile-clicked");
                document.getElementById('mines-count').innerText = "Game Over";
            }
        }
    }
}

function checkMines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (table[r][c].classList.contains("tile-clicked")) {
        return;
    }
    table[r][c].classList.add("tile-clicked");
    clickedMines += 1;
    let minesFound = 0;

    minesFound += checkCell(r, c); //currently
    minesFound += checkCell(r, c + 1); //left
    minesFound += checkCell(r, c - 1); //right

    minesFound += checkCell(r - 1, c); //top
    minesFound += checkCell(r - 1, c + 1); //top right
    minesFound += checkCell(r - 1, c - 1); //top left

    minesFound += checkCell(r + 1, c); //bottom
    minesFound += checkCell(r + 1, c + 1); // bottom right
    minesFound += checkCell(r + 1, c - 1); //bottom left

    if (minesFound > 0) {
        table[r][c].innerText = minesFound;
        table[r][c].classList.add("number" + minesFound.toString());
    } else {
        checkMines(r, c); //currently
        checkMines(r, c + 1); //left
        checkMines(r, c - 1); //right

        checkMines(r - 1, c); //top
        checkMines(r - 1, c + 1); //top right
        checkMines(r - 1, c - 1); //top left

        checkMines(r + 1, c); //bottom
        checkMines(r + 1, c + 1); // bottom right
        checkMines(r + 1, c - 1); //bottom left
    }
    if (clickedMines == rows * columns - mines_count) {
        document.getElementById('mines-count').innerText = "Game Won";
        GameOver = true;
    }
}

function checkCell(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (locationMines.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
