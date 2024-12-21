const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const numpad = [
    [ '7', '8', '9' ],
    [ '4', '5', '6' ],
    [ '1', '2', '3' ],
    [ 'X', '0', 'A' ]
];

const dirpad = [
    [ 'X', '^', 'A' ],
    [ '<', 'v', '>' ],
];

const directions = [
    [  0,  1, 'v' ],
    [  0, -1, '^' ],
    [  1,  0, '>' ],
    [ -1,  0, '<' ],
];

// Find shortest parts between two points in the matrix
// while skipping matrix positions marked with X
const findShortestPaths = (matrix, startX, startY, endX, endY) => {
    const queue = [ [ startX, startY, '' ] ];
    const distance = Math.abs(startX - endX) + Math.abs(startY - endY);
    const visited = matrix.map((row => row.map(cell => Number.MAX_SAFE_INTEGER)));
    const paths = [];
    while (queue.length > 0) {
        let [ posX, posY, path ] = queue.pop();
        if (path.length > distance) {
            continue;
        }
        if (path.length > visited[posY][posX]) {
            continue;
        } else {
            visited[posY][posX] = path.length;
        }
        visited.push([ posX, posY ]);
        if (posX === endX && posY === endY) {
            paths.push(path);
            continue;
        }
        const targetDirX = Math.max(-1, Math.min(1, endX - posX));
        const targetDirY = Math.max(-1, Math.min(1, endY - posY));
        directions.forEach(([dirX, dirY, dir]) => {
            const testX = posX + dirX;
            const testY = posY + dirY;
            if (testX < 0 || testX >= matrix[0].length || testY < 0 || testY >= matrix.length) {
                return;
            }
            if (matrix[testY][testX] === 'X') {
                return;
            }            
            if (dirX === targetDirX && dirY === targetDirY) {
                queue.push([ testX, testY, path + dir ]);
            } else {
                queue.unshift([ testX, testY, path + dir ]);
            }
        })
    }
    return paths;
}

// Calculate all paths possible between matrix points
const calculateAllPaths = (matrix) => {
    const result = {};
    for (let x = 0; x < matrix[0].length; x++) {
        for (let y = 0; y < matrix.length; y++) {
            for (let i = 0; i < matrix[0].length; i++) {
                for (let j = 0; j < matrix.length; j++) {
                    if (x === i && y === j) {
                        continue;
                    }
                    if (matrix[y][x] === 'X' || matrix[j][i] === 'X') {
                        continue;
                    }
                    result[matrix[y][x] + matrix[j][i]] = findShortestPaths(matrix, x, y, i, j);
                }
            }
        }    
    }
    return result;
}

// Get paths for the numeric keypad
const numpadPaths = calculateAllPaths(numpad);

// Get paths for the directional keypath
// and also the distance needed to travel 
const dirpadPaths = calculateAllPaths(dirpad);

// Get all keypress options for a set of keypressed on a given
// keypad. Has the ability to only return a single option
const findOptionsFor = (pad, keypresses, firstOnly = false) => {
    let remaining = keypresses;
    let last = 'A';
    let options = [
        ''
    ];
    while(remaining.length > 0) {
        const next = remaining.substring(0, 1);
        remaining = remaining.substring(1);
        if (last === next) {
            options = options.map((option) => option + 'A');
            continue;
        }    
        let paths = [ ...pad[last + next] ];
        if (firstOnly) {
            const shortestPath = paths[0];
            options[0] = options[0] + shortestPath + 'A';
        } else {
            for (let x = options.length-1; x >= 0; x--) {
                const newPath = paths.map((path) => options[x] + path + 'A');
                options.splice(x, 1, ...newPath);
            }
        }
        last = next;
    }
    return options;
}

const calculateKeyPad = (keypadNum) => {
    const numpadOptions = findOptionsFor(numpadPaths, keypadNum);
    let dirpad1Options = [];

    numpadOptions.forEach(numpadOption => {
        const options = findOptionsFor(dirpadPaths, numpadOption);
        options.forEach(option => {
            dirpad1Options.push(option);
        })
    });

    const minCost = dirpad1Options.reduce((acc, val) => {
        const cost = (findOptionsFor(dirpadPaths, val, true)[0]).length;
        return (acc > cost) ? cost : acc;
    }, Number.MAX_SAFE_INTEGER);
    return Number.parseInt(keypadNum.replaceAll(/[^0-9]+/g, ''), 10) * minCost;
}

console.log(input.split('\n').reduce((acc, val) => acc + calculateKeyPad(val), 0));
