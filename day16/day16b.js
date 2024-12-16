const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim()

let matrix = input.split('\n').map((row) => row.split(''));
let costMatrix = input.split('\n').map((row) => row.split('').map(() => Number.MAX_SAFE_INTEGER));
let visitMatrix = input.split('\n').map((row) => row.split('').map(() => false));

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
const getIsCoordMarked = (x, y) => visitMatrix[y][x];
const markCoord = (x, y, c) => visitMatrix[y][x] = true;

const debugMatrix = () => {
    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {    
            const c = getAtCoord(x,y);
            let reset = false;
            if (getIsCoordMarked(x, y)) {
                s += '\x1b[1;32m';
                reset = true;
            } else if (c === 'S' || c === 'E') {
                s += '\x1b[1;31m';
                reset = true;
            } else if (c !== '#' && getCostAtCoord(x, y) !== Number.MAX_SAFE_INTEGER) {
                s += '\x1b[1;33m';
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
let initialQueue = [];

for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
        if (getAtCoord(x, y) === 'S') {
            setCostAtCoord(x, y, 0);
            markCoord(x, y);
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
        
                initialQueue.unshift([newX, newY, testDirX, testDirY, directionCost, c, [ [ newX, newY ] ] ]);
            });
        }
    }
}

const paths = [];
const searchMatrix = (queue, allPaths) => {
    while (queue.length > 0) {
        const [ x, y, dirX, dirY, cost, char, path ] = queue.pop();
        
        // If there is already a cheaper route, stop this path
        if (cost > minCost) {
            continue;
        }
    
        // If we got here "cheaper", stop this path
        const costAtCoord = getCostAtCoord(x, y);
        if (allPaths) {
            // Check cost but allow pennalty of rotation
            if (cost >= costAtCoord + 1001) {
                continue;
            }
        } else {
            if (cost >= costAtCoord) {
                continue;
            } else {
                setCostAtCoord(x, y, cost);
            }
        }
        
        // If this is an exit tile stop route
        if (char === 'E') {
            if (allPaths) {
                paths.push(path);
            } else if (cost < minCost) {
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
    
            queue.unshift([newX, newY, testDirX, testDirY, cost + directionCost, c, [ ...path, [ newX, newY ]] ]);
        });
    }
}

// Search the matrix once in optimal flow to find the shortest path
searchMatrix([ ...initialQueue ], false);

// Run it a second time but also allow equal path lenghts to continue
searchMatrix([ ...initialQueue ], true);

// Mark and count visited spots
let idealPlaces = 0;
paths.forEach(path => path.forEach(([x, y]) => markCoord(x, y)));
for (let x = 0; x < width; x++) {
    for (let y = 0; y < width; y++) {
        if (getIsCoordMarked(x, y)) {
            idealPlaces++;
        }
    }
}

console.log(idealPlaces);
// debugMatrix();