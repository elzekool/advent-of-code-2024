const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n')

let matrix = input[0].split('\n').map((row) => row.split('').map((s) => {
    if (s === 'O') {
        return '[]';
    }
    if (s === '@') {
        return '@.';
    }
    return s + s;
}).join('').split(''));

const movements = input[1].replaceAll('\n', '').split('');

const width = matrix[0].length;
const height = matrix.length;
const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getAtCoord = (x, y) => matrix[y][x];
const setAtCoord = (x, y, s) => matrix[y][x] = s;

let robotPos;
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (getAtCoord(x, y) === '@') {
            robotPos = [ x, y ];
        }
    }
}

const debugMatrix = () => {
    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {            
            s += getAtCoord(x,y);
        }
        console.log(s);
    }
    console.log('');
}

const directions = {
    'v' : [  0,  1 ],
    '^' : [  0, -1 ],
    '>' : [  1,  0 ],
    '<' : [ -1,  0 ],
};

const moveRobot = (direction) => {
    const [ dirX, dirY ] = directions[direction];
    let [ posX, posY ] = robotPos;

    let line = '';
    posX += dirX;
    posY += dirY;

    // Quick check, are we moving into an empty slot?
    if (getAtCoord(posX, posY) === '.') {
        setAtCoord(robotPos[0], robotPos[1], '.');
        setAtCoord(posX, posY, '@');
        robotPos = [ posX, posY ];
        return;
    }

    // Quick check, are we moving into a wall?
    if (getAtCoord(posX, posY) === '#') {
        return;
    }

    // In the X dir we can re-use what we have done
    if (dirY === 0) {    
        while(inBound(posX, posY)) {
            line += getAtCoord(posX, posY);
            posX += dirX;
            posY += dirY;    
        }
        
        // Reduce the line to the first wall
        if (line.includes('#')) {
            line = line.substring(0, line.indexOf('#'));
        }

        // Move not possible
        if (!line.includes('.')) {
            return;
        }
        
        const freeSlotOffset = line.indexOf('.') + 1;
        line = '.' + line.substring(0, freeSlotOffset-1) + line.substring(freeSlotOffset);
        [ posX, posY ] = robotPos;
        for (x = 0; x < freeSlotOffset; x++) {
            posX += dirX;
            posY += dirY;
            setAtCoord(posX, posY, line.charAt(x));
        }
        setAtCoord(robotPos[0], robotPos[1], '.');
        robotPos = [ robotPos[0] + dirX,  robotPos[1] + dirY ];
        setAtCoord(robotPos[0], robotPos[1], '@');
        return;
    }

    // Find the position of our first box
    let boxL = getAtCoord(posX, posY) === ']' ? (robotPos[0] - 1) : robotPos[0];
    let boxR = getAtCoord(posX, posY) === '[' ? (robotPos[0] + 1) : robotPos[0];    
    const lines = [
        [ posY, [ [ boxL, boxR ] ] ]
    ];

    // Move through lines until we go out of bounds
    while(inBound(0, posY + dirY)) {
        posY += dirY;

        // Get the boxes from the previous line
        const [, prevBoxes ] = lines[lines.length-1];
        
        const newBoxes = [];
        prevBoxes.forEach(([prevBoxL, prevBoxR]) => {
            // If on the left we find the left of another box add it
            if (getAtCoord(prevBoxL, posY) === '[') {                
                newBoxes.push(([ prevBoxL, prevBoxR ]));
                // We do not have to check right as we know it is the same box
                return;
            }
            // If on the left we find the right of another box add it shifted one to the left
            if (getAtCoord(prevBoxL, posY) === ']') {
                newBoxes.push(([ prevBoxL-1, prevBoxL ]));
            }
            // If on the right we find the left of another box add it shifted one to the right
            if (getAtCoord(prevBoxR, posY) === '[') {
                newBoxes.push(([ prevBoxR, prevBoxR+1 ]));
            }
        });              
        
        // If there are no boxes found to move break out
        if (newBoxes.length === 0) {
            break;
        }
        lines.push([ posY, newBoxes ]);
    }

    // Check if it is possible to move boxes where we start from the last line
    let possible = true;
    lines.reverse();

    lines.forEach(([posY, boxes]) => {
        // Exit early if we already know it is not possible
        if (!possible) {
            return;
        }
        boxes.forEach(([boxL, boxR]) => {
            if (
                getAtCoord(boxL, posY + dirY) === '#' || 
                getAtCoord(boxR, posY + dirY) === '#'
            ) {
                possible = false;
            }
        })
    });

    if (!possible) {
        return;
    }

    // Move boxes
    lines.forEach(([posY, boxes]) => {
        boxes.forEach(([boxL, boxR]) => {
            setAtCoord(boxL, posY + dirY, '[');
            setAtCoord(boxR, posY + dirY, ']');
            setAtCoord(boxL, posY, '.');
            setAtCoord(boxR, posY, '.');
        });
    });

    // Move robot
    setAtCoord(robotPos[0], robotPos[1], '.');
    robotPos[1] += dirY;
    setAtCoord(robotPos[0], robotPos[1], '@');
}

movements.forEach(move => {
    moveRobot(move)
});
debugMatrix();


sum = 0;
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (getAtCoord(x, y) === '[') {
            sum += (y*100) + x;
        }
    }
}
console.log(sum);