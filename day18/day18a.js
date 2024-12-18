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
const costMatrix = [];
for (let y = 0; y < height; y++) {
    const row = [];
    const costRow = [];
    for (let x = 0; x < width; x++) {
           row.push(false);
           costRow.push(Number.MAX_SAFE_INTEGER);
    }
    matrix.push(row);
    costMatrix.push(costRow);
}

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getAtCoord = (x, y) => matrix[y][x];
const setAtCoord = (x, y, v) => matrix[y][x] = v;
const getCostAtCoord = (x, y) => costMatrix[y][x];
const setCostAtCoord = (x, y, c) => costMatrix[y][x] = c;

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

for (let x = 0; x < bytesToFall; x++) {
    const byte = bytes.shift();
    setAtCoord(byte[0], byte[1], true);
}

let minCost = Number.MAX_SAFE_INTEGER;
let queue = [ [0, 0, 0] ];

while (queue.length > 0) {
    const [ x, y, cost ] = queue.pop();
    
    // If there is already a cheaper route, stop this path
    if (cost > minCost) {
        continue;
    }

    // If we got here "cheaper", stop this path
    const costAtCoord = getCostAtCoord(x, y);
    if (cost >= costAtCoord) {
        continue;
    } else {
        setCostAtCoord(x, y, cost);
    }
    
    // If this is an exit tile stop route
    if (x === goalX && y === goalY) {
        if (cost < minCost) {
            minCost = cost;
        }
        continue;
    }

    directions.forEach(([ testDirX, testDirY ]) => {
        const newX = x + testDirX;
        const newY = y + testDirY;

        if (!inBound(newX, newY)) {
            return;
        }

        if (getAtCoord(newX, newY)) {
            return;
        }

        queue.unshift([newX, newY, cost + 1 ]);
    });

}

console.log(minCost);
// debugMatrix();