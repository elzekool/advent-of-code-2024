const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim()

const matrix = input.split('\n').map((row) => row.split(''));
const costMatrix = input.split('\n').map((row) => row.split('').map(() => (Number.MAX_SAFE_INTEGER)));

const directions = [
    [  0,  1 ],
    [  0, -1 ],
    [  1,  0 ],
    [ -1,  0 ]
];

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

const getAtCoord = (x, y) => matrix[y][x];
const getCostAtCoord = (x, y) => costMatrix[y][x];
const setCostAtCoord = (x, y, cost) => costMatrix[y][x] = cost;

const debugMatrix = () => {
    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {    
            const c = getAtCoord(x,y);
            let reset = false;

            if (c === 'S' || c === 'E') {
                s += '\x1b[1;32m';
                reset = true;
            } else if (getCostAtCoord(x, y) !== Number.MAX_SAFE_INTEGER) {
                s += '\x1b[1;31m';
                reset = true;
            }
            s += c;
            if (reset) {
                s += '\x1b[0m';
            }
        }
        console.log(s);
    }    
}

let minCost = Number.MAX_SAFE_INTEGER;
let minimalPath = [];

let startX;
let startY;
let goalX;
let goalY;

for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
        if (getAtCoord(x, y) === 'S') {
            startX = x;
            startY = y;            
        }
        if (getAtCoord(x, y) === 'E') {
            goalX = x;
            goalY = y;
        }
    }
}

// First find path
const queue = [ [ startX, startY, 0, [ [startX, startY] ] ]];
while (queue.length > 0) {
    const [ x, y, cost, path ] = queue.pop();
    
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
            minimalPath = path;
        }
        continue;
    }

    const targetDirX = Math.max(-1, Math.min(1, goalX - x));
    const targetDirY = Math.max(-1, Math.min(1, goalY - y));

    directions.forEach(([ testDirX, testDirY ]) => {
        const newX = x + testDirX;
        const newY = y + testDirY;

        if (!inBound(newX, newY)) {
            return;
        }

        if (getAtCoord(newX, newY) === '#') {
            return;
        }

        if (testDirX === targetDirX && testDirY === targetDirY) {
            queue.unshift([ newX, newY, cost+1, [ ...path, [ newX, newY ] ] ]);
        } else {
            queue.push([ newX, newY, cost+1, [ ...path, [ newX, newY ] ] ]);
        }      
    });
}

let sum = 0;
const savedPerDistance = {};
const minimalSaveToTest = 100;
for (let i = 0; i < minimalPath.length; i++) {
    for (let j = i + minimalSaveToTest; j < minimalPath.length; j++) {
        const distance = Math.abs(minimalPath[i][0] - minimalPath[j][0]) + Math.abs(minimalPath[i][1] - minimalPath[j][1]);
        if (distance > 20) {
            continue;
        }

        const distanceSaved = j - i - distance;
        if (distanceSaved >= minimalSaveToTest) {
            savedPerDistance[distanceSaved] = (savedPerDistance[distanceSaved] ?? 0) + 1;
            sum++;
        }
    }
}

// debugMatrix();
// console.log(savedPerDistance);
console.log(sum);
