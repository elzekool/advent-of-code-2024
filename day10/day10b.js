const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const matrix = input.split('\n').map((row) => row.split('').map(
    (val => val !== '.' ? Number.parseInt(val, 10) : -1))
);

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getAtCoord = (x, y) => matrix[y][x];

const directions = [
    [  0,  1 ],
    [  0, -1 ],
    [  1,  0 ],
    [ -1,  0 ]
];

const findTrailsCount = (from) => {      
    let queue = [ [ from, 1 ] ];
    let trailCounts = 0;

    while (queue.length) {
        const [ check, height ] = queue.pop();

        if (height === (9+1)) {
            trailCounts++;
            continue;
        }

        const possibleDirections = directions
            // Get coordinate
            .map((d) => [ d[0] + check[0], d[1] + check[1] ])
            // Check if we are still in the map
            .filter(d => inBound(d[0], d[1]))
            // Check if heigh checks out
            .filter(d => getAtCoord(d[0], d[1]) === height);

        if (possibleDirections.length === 0) {      
            continue;
        }

        possibleDirections.forEach((nextCheck) => {
            queue.push([ nextCheck, height + 1 ]);
        });
    }

    return trailCounts;
}

const trailStarts = [];

for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        if (getAtCoord(x,y) === 0) {
            trailStarts.push([x,y]);
        }
    }    
}

let sum = trailStarts.reduce((acc, val) => acc + findTrailsCount(val), 0);
console.log(sum);