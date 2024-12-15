const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n')

const matrix = input[0].split('\n').map((row) => row.split(''));
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

    // Move the first box we find into first free slot
    const freeSlotOffset = line.indexOf('.') + 1;
    const firstBoxOffset = line.indexOf('O') + 1;

    [ posX, posY ] = robotPos;
    setAtCoord(posX + (dirX*freeSlotOffset), posY + (dirY*freeSlotOffset), 'O');
    setAtCoord(posX + (dirX*firstBoxOffset), posY + (dirY*firstBoxOffset), '.');
    setAtCoord(posX, posY, '.');
    setAtCoord(posX + dirX, posY + dirY, '@');
    robotPos = [ posX + dirX,  posY + dirY ];
}

movements.forEach(move => moveRobot(move));
debugMatrix();

sum = 0;
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (getAtCoord(x, y) === 'O') {
            sum += (y*100) + x;
        }
    }
}
console.log(sum);