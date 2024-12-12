const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const matrix = input.split('\n').map((row) => row.split(''));
const visitMatrix = input.split('\n').map((row) => row.split('').map(() => 0));
const gardenMatrix = input.split('\n').map((row) => row.split('').map(() => 0));

const width = matrix[0].length;
const height = matrix.length;

const directions = [
    [  0,  1 ],
    [  0, -1 ],
    [  1,  0 ],
    [ -1,  0 ],
];

let searchId = 0;
const inBound = (x, y) => x >= 0 && y >= 0 && x < width && y < height;
const getAtCoord = (x, y) => matrix[y][x];

const sides = (x, y, searchId) => {
    let s = [];
    directions.forEach(([dirX, dirY, side]) => {
        const posX = x + dirX;
        const posY = y + dirY;
        if (
            !inBound(posX, posY) ||
            gardenMatrix[posY][posX] !== searchId
        ) {
            s.push([ posX, posY, dirX, dirY ]);
        }
    });
    return s;
}

const calcGardenCost = (minX, minY, maxX, maxY, searchId) => {
    let allSides = [];
    for(let x = minX; x <= maxX; x++) {
        for(let y = minY; y <= maxY; y++) {
            if (gardenMatrix[y][x] !== searchId) {
                continue;
            }
            allSides = [ ...allSides, ...sides(x, y, searchId) ];   
        }
    }

    return allSides.filter(([sideX, sideY, dirX, dirY]) => {
        const nX = sideX + dirY;
        const nY = sideY + dirX;
        return (0 === allSides.filter(([ _sideX, _sideY, _dirX, _dirY] ) => {
            return (
                _sideX === nX &&
                _sideY === nY &&
                dirX === _dirX &&
                dirY === _dirY
            )
        }).length);
    }).length;
}

const findConnected = (x, y) => {
    const type = getAtCoord(x, y);
    const queue = [ [x, y] ];
    const positions = [];

    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0; 

    searchId++;
    visitMatrix[y][x] = searchId;

    while(queue.length > 0) {
        const [ posX, posY ] = queue.pop();
        positions.push([ posX, posY ]);
        gardenMatrix[posY][posX] = searchId;

        if (posX < minX) { minX = posX; }
        if (posY < minY) { minY = posY; }
        if (posX > maxX) { maxX = posX; }
        if (posY > maxY) { maxY = posY; }

        directions.forEach(([ dirX, dirY]) => {
            const nX = posX + dirX;
            const nY = posY + dirY;
            if (
                inBound(nX, nY) &&
                visitMatrix[nY][nX] !== searchId &&
                getAtCoord(nX, nY) === type
            ) {
                visitMatrix[nY][nX] = searchId;
                queue.push([ nX, nY ]);
            }
        })
    }

    return positions.length * calcGardenCost(minX, minY, maxX, maxY, searchId);
}

let gardenCosts = 0;

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        if (gardenMatrix[y][x] !== 0) {
            continue;
        }
        gardenCosts += findConnected(x, y);
    }
}

console.log(gardenCosts);