const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').replace('\r', '').trim();

const matrix = input.split('\n').map((row) => row.split(''));

let directionIdx = 0;
let directions = [ 
    [ -1,  0, ],
    [  0,  1, ],
    [  1,  0, ],
    [  0, -1, ],
];

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

let initialPosition = [ 0, 0 ];
let position = [ 0, 0 ];
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (matrix[x][y] === '^') {
            matrix[x][y] = directionIdx;
            position = [ x, y ];
            initialPosition = [ x, y ];
        }
    }
}

let blocks = 0;

// We are lazy, just try every position
// We could optimize this by first doing a run and then only
// check the places the guard normally visits
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (matrix[x][y] !== '.') {
            continue;
        }

        let found = false;

        directionIdx = 0;
        position = initialPosition;
        const testMatrix = [ ...matrix.map(line => [ ...line ])];

        testMatrix[x][y] = '#';

        while(found === false) {
            const direction = directions[directionIdx];
            
            while(true) {
                const newX = position[0] + direction[0];
                const newY = position[1] + direction[1];
        
                if (!inBound(newX, newY)) {
                    found = true;
                    break
                }
        
                const val = testMatrix[newX][newY];
            
                // If we are traveling in the same direction we are
                // in a loop
                if (val === directionIdx) {
                    blocks++;
                    found = true;
                    break;
                }
        
                if (val === '#') {
                    break;
                }
        
                testMatrix[newX][newY] = directionIdx;
        
                position = [newX, newY];        
            }
        
            directionIdx = (directionIdx + 1) % directions.length;
        }
    }
}

console.log(blocks);
