const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim()

const bytes  = input.split('\n').map((line) => line.split(',').map(n => Number.parseInt(n, 10)));

const width = 71;
const height = 71;
const bytesToFall = 1024;

const goalX = width - 1;
const goalY = height - 1;

const directions = [
    [  0,  1 ],
    [  0, -1 ],
    [  1,  0 ],
    [ -1,  0 ],
];

const matrix = [];
const visitedMatrix = [];
for (let y = 0; y < height; y++) {
    const row = [];
    const visitedRow = [];
    for (let x = 0; x < width; x++) {
           row.push(false);
           visitedRow.push(false);
    }
    matrix.push(row);
    visitedMatrix.push(visitedRow);
}

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getAtCoord = (x, y) => matrix[y][x];
const setAtCoord = (x, y, v) => matrix[y][x] = v;
const getVisitedCoord = (x, y) => visitedMatrix[y][x];
const markVisitedCoord = (x, y) => visitedMatrix[y][x] = true;
const clearVisited = () => { for (let y = 0; y < height; y++) { for (let x = 0; x < width; x++) { visitedMatrix[y][x] = false; } } }

const debugMatrix = () => {
    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {    
            const c = getAtCoord(x,y) ? '#' : '.';           
            s += c;            
        }
        console.log(s);
    }    
}

// We can still let our initial bytes fall
for (let x = 0; x < bytesToFall; x++) {
    const byte = bytes.shift();
    setAtCoord(byte[0], byte[1], true);
}

while (true) {
    // Pop next byte
    const byte = bytes.shift();
    setAtCoord(byte[0], byte[1], true);

    clearVisited();
    const queue = [ [0, 0, 0] ];
    let possible = false;

    while (queue.length > 0) {
        const [ x, y ] = queue.pop();        
        if (getVisitedCoord(x, y)) {
            continue;
        }
        markVisitedCoord(x, y, true);
        
        // If this is an exit tile stop route
        if (x === goalX && y === goalY) {
            possible = true;
            break;
        }

        const targetDirX = Math.max(-1, Math.min(1, goalX - x));
        const targetDirY = Math.max(-1, Math.min(1, goalY - y));    

        directions.forEach(([ testDirX, testDirY ]) => {
            const newX = x + testDirX;
            const newY = y + testDirY;
            if (!inBound(newX, newY)) {
                return;
            }    
            if (getAtCoord(newX, newY)) {
                return;
            }    

            if (testDirX === targetDirX && testDirY === targetDirY) {
                queue.unshift([newX, newY ]);
            } else {
                queue.push([newX, newY ]);
            }
            
        });
    }

    if (!possible) {
        console.log(byte.join(','));
        break;        
    }
}
// debugMatrix();