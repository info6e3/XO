const containerSize = 600;
const cellsCount = 10;
const victoryLength = 5;

const container = document.querySelector('.container');
container.style.width = containerSize + 'px';
container.style.height = containerSize + 'px';

const cells = [];
let turn = true;

for (let i = 0; i < cellsCount; i++) {
    const row = [];
    for (let j = 0; j < cellsCount; j++) {
        const element = document.createElement("div");
        element.setAttribute('value', JSON.stringify({
            status: 'empty',
            row: i,
            col: j}));

        element.style.width = containerSize/cellsCount + 'px';
        element.style.height = containerSize/cellsCount + 'px';

        element.classList.add('empty');
        element.classList.add('cell');

        row.push(element);

        element.addEventListener('click', (e) => {
            const element = e.target;
            const value = JSON.parse(element.getAttribute('value'));
            if(value.status === 'empty')
                Draw(element).then(() => {
                    CheckWin(element);
                })
        });

        container.appendChild(element);
    }
    cells.push(row);
}

function Draw(element) {
    return new Promise((resolve, reject) => {
        const value = JSON.parse(element.getAttribute('value'));
        const color = turn ? 'blue' : 'red'
        if (value.status === 'empty') {
            element.setAttribute('value', JSON.stringify({...value,
                status: color
            }))
            element.classList.add(color);
            turn = !turn;
            resolve();
        } else
            reject();
    });
}

function CheckWin(element) {
    const value = JSON.parse(element.getAttribute('value'));
    const cell = cells[value.row][value.col];

    const lenX = GoTo(cell, 'up') + GoTo(cell, 'down') + 1;
    const lenY = GoTo(cell, 'left') + GoTo(cell, 'right') + 1;
    const lenUL = GoTo(cell, 'up-left') + GoTo(cell, 'down-right') + 1;
    const lenYUR = GoTo(cell, 'up-right') + GoTo(cell, 'down-left') + 1;

    console.log(Math.max(lenY, lenX, lenUL, lenYUR))
    function GoTo(cell, direction, status = null) {
        const value = JSON.parse(cell.getAttribute('value'));

        let count = 0;

        if(status) {
            if(value.status === status)
                count++;
            else
                return count;
        } else {
            status = value.status;
        }

        switch (direction) {
            case 'up':
                if(value.row > 0)
                    count += GoTo(cells[value.row-1][value.col], 'up', status);
                return count;
            case 'down':
                if(value.row < cellsCount - 1)
                    count += GoTo(cells[value.row+1][value.col], 'down', status);
                return count;
            case 'left':
                if(value.col > 0)
                    count += GoTo(cells[value.row][value.col-1], 'left', status);
                return count;
            case 'right':
                if(value.col < cellsCount - 1)
                    count += GoTo(cells[value.row][value.col+1], 'right', status);
                return count;

            case 'up-left':
                if(value.row > 0 && value.col > 0)
                    count += GoTo(cells[value.row - 1][value.col-1], 'up-left', status);
                return count;
            case 'up-right':
                if(value.row > 0 && value.col < cellsCount - 1)
                    count += GoTo(cells[value.row - 1][value.col+1], 'up-right', status);
                return count;
            case 'down-left':
                if(value.row < cellsCount - 1 && value.col > 0)
                    count += GoTo(cells[value.row + 1][value.col-1], 'down-left', status);
                return count;
            case 'down-right':
                if(value.row < cellsCount - 1 && value.col < cellsCount - 1)
                    count += GoTo(cells[value.row + 1][value.col+1], 'down-right', status);
                return count;
        }
    }
}