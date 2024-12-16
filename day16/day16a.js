const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim()

const matrix = input.split('\n').map((row) => row.split(''));
const costMatrix = input.split('\n').map((row) => row.split('').map(() => Number.MAX_SAFE_INTEGER));

const directions = [
    (x, y) => ([  x,  y,    1 ]),  // Forward
    (x, y) => ([ -y,  x, 1001 ]),  // Left + Forward 
    (x, y) => ([  y, -x, 1001 ]),  // Right + Forward
]

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

const getAtCoord = (x, y) => matrix[y][x];
const getCostAtCoord = (x, y) => costMatrix[y][x];
const setCostAtCoord = (x, y, c) => costMatrix[y][x] = c;

const debugMatrix = () => {
    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {    
            const c = getAtCoord(x,y);
            let reset = false;

            if (c === 'S' || c === 'E') {
                s += '\x1b[1;31m';
                reset = true;
            }
            if (c === '.' && getCostAtCoord(x, y) !== Number.MAX_SAFE_INTEGER) {
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

let minCost = Number.MAX_SAFE_INTEGER;
let queue = [];

for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
        if (getAtCoord(x, y) === 'S') {
            setCostAtCoord(x, y, 0);
            directions.forEach((directionFn) => {
                const [ testDirX, testDirY, directionCost ] = directionFn(1, 0);
                const newX = x + testDirX;
                const newY = y + testDirY;
        
                if (!inBound(newX, newY)) {
                    return;
                }
        
                const c = getAtCoord(newX, newY);
                if (c === '#') {
                    return;
                }
        
                queue.unshift([newX, newY, testDirX, testDirY, directionCost, c ]);
            });
        }
    }
}

while (queue.length > 0) {
    const [ x, y, dirX, dirY, cost, char ] = queue.pop();
    
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
    if (char === 'E') {
        if (cost < minCost) {
            minCost = cost;
        }
        continue;
    }

    directions.forEach((directionFn) => {
        const [ testDirX, testDirY, directionCost ] = directionFn(dirX, dirY);
        const newX = x + testDirX;
        const newY = y + testDirY;

        if (!inBound(newX, newY)) {
            return;
        }

        const c = getAtCoord(newX, newY);
        if (c === '#') {
            return;
        }

        queue.unshift([newX, newY, testDirX, testDirY, cost + directionCost, c ]);
    });

}

console.log(minCost);
//debugMatrix();