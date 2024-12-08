const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const matrix = input.split('\n').map((row) => row.split(''));

const searches = [];
const centerChar = 'A';

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const charAt = (x, y) => inBound(x, y) ? matrix[x][y] : '.';

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (matrix[x][y] === centerChar) {
            searches.push([x, y]);
        }
    }
}

let found = 0;

searches.forEach((search) => {
    let [ x, y ] = search;
    
    // ugly check, I did not bother creating a check array
    if (
        (
            (charAt(x - 1, y - 1) === 'M' && charAt(x + 1, y + 1) === 'S') ||
            (charAt(x + 1, y + 1) === 'M' && charAt(x - 1, y - 1) === 'S')
        ) &&     
        (
            (charAt(x - 1, y + 1) === 'S' && charAt(x + 1, y - 1) === 'M') ||
            (charAt(x + 1, y - 1) === 'S' && charAt(x - 1, y + 1) === 'M')
        )
    ) {
        found++;
    }    
})

console.log(found);