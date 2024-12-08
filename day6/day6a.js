const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').replace('\r', '').trim();

const matrix = input.split('\n').map((row) => row.split(''));

let direction = [ -1, 0 ];

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

let position = [ 0, 0 ];
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (matrix[x][y] === '^') {
            matrix[x][y] = 'X';
            position = [ x, y ];
        }
    }
}

let visited = 1;
let found = false;

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

        if (matrix[newX][newY] !== 'X') {
            matrix[newX][newY] = 'X';
            visited++;
        }

        position = [newX, newY];        
    }

    direction = [ direction[1], 0-direction[0] ];
}

console.log(visited);
