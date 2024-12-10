const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const matrix = input.split('\n').map((row) => row.split('').map(
    (val => val !== '.' ? Number.parseInt(val, 10) : -1))
);

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getAtCoord = (x, y) => matrix[y][x];
const coordEq = (a, b) => a[0] === b[0] && a[1] === b[1];

const directions = [
    [  0,  1 ],
    [  0, -1 ],
    [  1,  0 ],
    [ -1,  0 ]
];

const findTrailEndsCount = (from) => {      
    let queue = [ [ from, [ from ], 1 ] ];
    const ends = [];

    while (queue.length) {
        const [ check, prev, height ] = queue.pop();

        const possibleDirections = directions
            // Get coordinate
            .map((d) => [ d[0] + check[0], d[1] + check[1] ])
            // Check if we are still in the map
            .filter(d => inBound(d[0], d[1]))
            // Check if heigh checks out
            .filter(d => getAtCoord(d[0], d[1]) === height)
            // And we are not backtracking
            .filter(d => prev.filter(p => coordEq(p, d)).length === 0);

        
        if (possibleDirections.length === 0) {
            // Check if we reached the end of a trail
            if (height === (9+1)) {
                // Add endpoint if we did not see it before
                const endpoint = prev[prev.length-1];
                if (ends.filter(c => coordEq(c, endpoint)).length === 0) {
                    ends.push(endpoint);
                } 
            }
            continue;
        }

        possibleDirections.forEach((nextCheck) => {
            queue.push([ nextCheck, [ ...prev, nextCheck ], height + 1 ]);
        });
    }

    return ends.length;
}

const trailStarts = [];

for(let x = 0; x < width; x++) {
    for(let y = 0; y < height; y++) {
        if (getAtCoord(x,y) === 0) {
            trailStarts.push([x,y]);
        }
    }    
}

let sum = trailStarts.reduce((acc, val) => acc + findTrailEndsCount(val), 0);
console.log(sum);