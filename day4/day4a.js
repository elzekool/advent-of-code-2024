const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

const matrix = input.split('\n').map((row) => row.split(''));

const directions = [
    [  0,  1 ],
    [  0, -1 ],
    [  1,  0 ],
    [  1,  1 ],
    [  1, -1 ],
    [ -1,  0 ],
    [ -1,  1 ],
    [ -1, -1 ]
];

const searches = [];
const text = 'XMAS';

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (matrix[x][y] === text[0]) {
            for(let i = 0; i < directions.length; i++) {
                searches.push( [ x, y, ...directions[i] ]);
            }
        }
    }
}

let found = 0;

searches.forEach((search) => {
    let [ x, y, dirX, dirY ] = search;
    
    for (let i = 0; i < text.length; i++) {
        let check_x = x + (dirX * i);
        let check_y = y + (dirY * i);
        if (
            !inBound(check_x, check_y) ||
            matrix[check_x][check_y] !== text[i]
        ) {
            return;
        }
    }

    found++;
})

console.log(found);