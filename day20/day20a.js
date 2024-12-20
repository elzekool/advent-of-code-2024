const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim()

const matrix = input.split('\n').map((row) => row.split(''));
const costMatrix = input.split('\n').map((row) => row.split('').map(() => ({ 0 : Number.MAX_SAFE_INTEGER })));

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
const getCostAtCoord = (x, y, cheat) => costMatrix[y][x][cheat] ?? Number.MAX_SAFE_INTEGER;
const setCostAtCoord = (x, y, cheat, cost) => costMatrix[y][x][cheat] = cost;
const sortCheat = (a, b) => {
    if (a[0] < b[0]) {
        return [ a, b ];
    }
    if (a[0] > b[0]) {
        return [ b, a ];
    }
    if (a[1] < b[1]) {
        return [ a, b ];
    }
    return [ b, a ];
}


const debugMatrix = (route) => {
    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {    
            const c = getAtCoord(x,y);
            let reset = false;

            if (c === 'S' || c === 'E') {
                s += '\x1b[1;31m';
                reset = true;
            } else if (x === cheats[route][0] && y === cheats[route][1]) {
                s += '\x1b[1;33m';
                reset = true;
            } else if (x === cheats[route][2] && y === cheats[route][3]) {
                s += '\x1b[1;34m';
                reset = true;
            } else if (getCostAtCoord(x, y, route) !== Number.MAX_SAFE_INTEGER) {
                s += '\x1b[1;32m';
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

let minCost = {
    0 : Number.MAX_SAFE_INTEGER
};

let queue = [];
let NO_CHEAT_IDX = 0;
let cheats = [
    [ 0, 0, 0, 0 ]
];

const hasCheat = ([a, b]) => cheats.some(
    (cheat) => cheat[0] === a[0] && cheat[1] === a[1] && cheat[2] === b[0] && cheat[3] === b[1])

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

const performRun = (allowCheat, minSave) => {
    queue = [ [ startX, startY, 'S', 0, 0 ]];
    while (queue.length > 0) {
        const [ x, y, char, cheatIdx, cost ] = queue.pop();
        
        // If there is already a cheaper route, stop this path
        if (
            (cost > minCost[cheatIdx] ?? Number.MAX_SAFE_INTEGER) ||
            cost > (minCost[NO_CHEAT_IDX] - minSave)
        ) {
            continue;
        }
    
        // If we got here "cheaper", stop this path
        const costAtCoord = getCostAtCoord(x, y, cheatIdx);
        if (cost > costAtCoord) {
            continue;
        } else {
            setCostAtCoord(x, y, cheatIdx, cost);
        }

        // If this is an exit tile stop route
        if (char === 'E') {
            if (cost < (minCost[cheatIdx] ?? Number.MAX_SAFE_INTEGER)) {
                minCost[cheatIdx] = cost;
            }
            continue;
        }
    
        const targetDirX = Math.max(-1, Math.min(1, goalX - x));
        const targetDirY = Math.max(-1, Math.min(1, goalY - y));
    
        directions.forEach(([ testDirX, testDirY ]) => {
            const newX = x + testDirX;
            const newY = y + testDirY;
            let newCheatIdx = cheatIdx;

            if (!inBound(newX, newY)) {
                return;
            }
    
            const c = getAtCoord(newX, newY);
            if (c === '#') {
                // If we do not allow cheating it is just a wall
                if (!allowCheat) {
                    return;
                }

                // No need checking the outside walls
                if (newX === 0 || newY === 0 || newX === (width-1) || newY === (height-1)) {
                    return;
                }
                
                // If we are already cheating, check if we are in one of the cheated positions
                if (cheatIdx !== NO_CHEAT_IDX) {                    
                    const [cheatXa, cheatYa, cheatXb, cheatYb ] = cheats[cheatIdx];
                    if (
                        !(newX === cheatXa && newY === cheatYa) &&
                        !(newX === cheatXb && newY === cheatYb)
                    ) {
                        // Nope
                        return;
                    }
                } else {
                    // Nope, now look if we can cheat ;-)
                    const cheat = sortCheat([ x, y ], [ newX, newY ]);
                    if (hasCheat(cheat)) {
                        return;
                    }

                    // Record the cheat
                    cheats.push([ cheat[0][0], cheat[0][1], cheat[1][0], cheat[1][1] ]);
                    newCheatIdx = cheats.length-1;
                }
            }
    
            if (testDirX === targetDirX && testDirY === targetDirY) {
                queue.unshift([ newX, newY, c, newCheatIdx, cost+1 ]);
            } else {
                queue.push([ newX, newY, c, newCheatIdx, cost+1 ]);
            }      
        });
    }
}

// First do a run to measure baseline
performRun(false);
performRun(true, 100);

let sum = 0;

const maxSave = Math.max.apply(null, Object.values(minCost).map((m) => minCost[0] - m));
for(let x = 1; x <= maxSave; x++) {
    const saves = Object.values(minCost).map((m) => minCost[0] - m).filter(m => m === x).length;
    if (saves > 0) {
        console.log(x, saves);
    }    
    sum += saves;
}
console.log(sum);
