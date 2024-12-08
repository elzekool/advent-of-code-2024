const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').replace('\r', '').trim();

const matrix = input.split('\n').map((row) => row.split(''));

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

let initialPosition = [ 0, 0 ];
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (matrix[x][y] === '^') {
            matrix[x][y] = 0;
            initialPosition = [ x, y ];
        }
    }
}

// First fill the field with positions the player visits
(() => {
    let found = false;
    let direction = [ -1, 0 ];
    let position = initialPosition;
    while(found === false) {
        while(true) {
            const newX = position[0] + direction[0];
            const newY = position[1] + direction[1];
            if (!inBound(newX, newY)) {
                found = true;
                break
            }    
            if (matrix[newX][newY] === '#') {
                break;
            }
            matrix[newX][newY] = 'X';
            position = [newX, newY];        
        }
        direction = [ direction[1], 0-direction[0] ];
    }
})();

let blocks = 0;
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        // Check if the player ever visits that position
        if (matrix[x][y] !== 'X') {
            continue;
        }

        let found = false;

        let directionId = 0;
        let direction = [ -1, 0 ];
        let position = initialPosition;
        const testMatrix = matrix.map(line => [ ...line ]);

        testMatrix[x][y] = '#';

        while(found === false) {
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
                if (val === directionId) {
                    blocks++;
                    found = true;
                    break;
                }
        
                if (val === '#') {
                    break;
                }
        
                testMatrix[newX][newY] = directionId;
        
                position = [newX, newY];        
            }
        
            direction = [ direction[1], 0-direction[0] ];
            directionId = (directionId + 1) % 4;
        }
    }
}

console.log(blocks);
