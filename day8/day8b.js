const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const matrix = input.split('\n').map((row) => row.split(''));

const width = matrix[0].length;
const height = matrix.length;

const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getAtCoord = (x, y) => matrix[y][x];

// Test if two lines with a given step size and starting point visits a given test point
const isInLine = ( testX, testY, lineX, lineY, stepX, stepY ) => {
    let step = 0;
    while (true) {
        const curX = lineX + (stepX*step);
        const curY = lineY + (stepY*step);        
        if (curX === testX && curY === testY) {
            return true;
        }

        const curXInv = lineX - (stepX*step);
        const curYInv = lineY - (stepY*step);
        if (curXInv === testX && curYInv === testY) {
            return true;
        }

        if (!inBound(curX, curY) && !inBound(curXInv, curYInv)) {
            return false;
        }
        step++;
    }
}

const antennas = []; // x, y, type
const antinodes = []; // x, y

// We need a mental picture :D
const printMatrix = () => {
    matrix.forEach((line, y) => {
        console.log(line.map((i, x) => {
            if (antinodes.filter((a) => a[0] === x && a[1] === y).length > 0) {
                return `\x1b[31m${i}\x1b[0m`;
            } if (antennas.filter((a) => a[0] === x && a[1] === y).length > 0) {
                return `\x1b[32m${i}\x1b[0m`;
            } else {
                return i;
            }
        }).join(' '))
    })
}

// Find our antenna's
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        const val = getAtCoord(x,y);
        if (/[a-zA-Z0-9]/.test(val)) {
            antennas.push([ x, y, val ]);
        }
    }
}

const antennaLines = []; // x, y, stepX, stepY

// Go through all antenna's on the grid
antennas.forEach(([ x, y, letter ]) => {

    // Find other antenna's
    const others = antennas.filter(([ _x, _y, _letter ]) => _letter === letter && !(_x === x && _y === y))
    others.forEach(([ _x, _y, _letter ]) => {

        // Calculate step size in both directions
        const stepX = x - _x;
        const stepY = y - _y;
        const invStepX = _x - x;
        const invStepY = _y - y;

        // Check if we already found the line with the given antenna and direction
        // - first check if letter matches (cheapest)
        // - secondly check if step size matches (both reg. and inv.)
        // - last check if lines match up with other found lines
        if (antennaLines.filter(([ groupX, groupY, groupLetter, groupStepX, groupStepY ]) => {
            return (
                _letter === groupLetter && 
                (
                    (groupStepX === stepX && groupStepY === stepY) ||
                    (groupStepX === invStepX && groupStepY === invStepY)
                ) &&
                isInLine(_x, _y, groupX, groupY, groupStepX, groupStepY)                
            );
        }).length === 0) {
            // We have a new line
            antennaLines.push([ x, y, letter, stepX, stepY ]);
        }        
    })
})

// Go through found antenna lines and place the antinode
antennaLines.forEach(([ groupX, groupY, groupLetter, groupDirX, groupDirY ]) => {
    let step = 0;

    // Keep stepping until we either placed both start & end or we reached the limits of our map
    while(true) {
        // Calc position in regular direction
        const curX = groupX + (groupDirX*step);
        const curY = groupY + (groupDirY*step);        

        // Check that
        // - We are still in our map
        // - Not already placed the antinode
        //
        // ## Yes really I just removed the additional checks 
        //    in place for the first solution,¯\_(ツ)_/¯
        //
        // If so, place antinode
        if (
            inBound(curX, curY) && 
            antinodes.filter(([ aX, aY ]) => aX === curX && aY === curY).length === 0
        ) {
            antinodes.push([ curX, curY ]);
        }

        // Check that
        // - We are still in our map
        // - Not already placed the antinode
        //
        // ## Yes really I just removed the additional checks 
        //    in place for the first solution,¯\_(ツ)_/¯
        //
        // If so, place antinode
        const curXInv = groupX - (groupDirX*step);
        const curYInv = groupY - (groupDirY*step);
        if (
            inBound(curXInv, curYInv) &&
            antinodes.filter(([ aX, aY ]) => aX === curXInv && aY === curYInv).length === 0
        ) {
            antinodes.push([ curXInv, curYInv ]);
        }

        if (!inBound(curX, curY) && !inBound(curXInv, curYInv)) {
            return;
        }
        step++;
    }
})

printMatrix();
console.log(antinodes.length);