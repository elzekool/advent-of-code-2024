const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const robots = 25;

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

// Get the number of turns
const calcTurns = (keys) => {
    let last = '';
    let turns = 0;
    for(let x = 0; x < keys.length; x++) {
        const next = keys[x];
        if (next !== last) {
            turns++;
        }
        last = next;
    }
    return turns;
}

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

    const minTurns = paths.reduce((acc, val) => {
        const turns = calcTurns(val);
        return (acc > turns) ? turns: acc;
    }, Number.MAX_SAFE_INTEGER);

    return paths.filter((path) => calcTurns(path) === minTurns).map((path => path + 'A'));
}

// Calculate all paths possible between matrix points
const calculateAllPaths = (matrix) => {
    const result = {};
    for (let x = 0; x < matrix[0].length; x++) {
        for (let y = 0; y < matrix.length; y++) {
            for (let i = 0; i < matrix[0].length; i++) {
                for (let j = 0; j < matrix.length; j++) {
                    if (matrix[y][x] === 'X' || matrix[j][i] === 'X') {
                        continue;
                    }
                    if (x === i && y === j) {
                        result[matrix[y][x] + matrix[j][i]] = [ 'A' ];
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

// Keep track of of the last pressed button in the chain
// We do this for all the robots + one human
const lastPressedButton = [];
for(let x = 0; x < robots+1; x++) {
    lastPressedButton.push('A');
}

const memo = {};
const calculateCostRecursive = (button, level = 0) => {
    // Get cache key
    const key = `${level}|${lastPressedButton[level]}${button}`;
    if (typeof memo[key] !== "undefined") {
        lastPressedButton[level] = button;
        return memo[key];
    }

    // If we are a human we can just press the button
    if (level === robots+1) {
        return button.length;
    }
    
    // Determine keypad to use, we start from the end of the chain 
    // as that is our input so start with the numeric keypad
    const keypad = (level === 0) ? numpadPaths : dirpadPaths;

    // Get key combinations that we could press
    const combinations = keypad[lastPressedButton[level] + button];

    // Go through each combination and see which has the minimal cost
    let minCost = Number.MAX_SAFE_INTEGER;
    combinations.forEach((path) => {
        let cost = 0;
        // No press buttons, we need to expand until we got to the human-
        path.split('').forEach((pathButton) => {
            cost += calculateCostRecursive(pathButton, level+1);
        });
        // This path is cheapest
        if (cost < minCost) {
            minCost = cost;
        }
    });

    lastPressedButton[level] = button;
    return memo[key] = minCost;
}

const calculateKeyPad = (keypadNum) => {
    const minCost = keypadNum.split('').reduce((acc, val) => acc + calculateCostRecursive(val), 0);
    return Number.parseInt(keypadNum.replaceAll(/[^0-9]+/g, ''), 10) * minCost;
}

console.log(input.split('\n').reduce((acc, val) => acc + calculateKeyPad(val), 0));