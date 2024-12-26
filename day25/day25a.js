const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n');

const locks = [];
const keys = [];

input.forEach((keyOrLock) => {
    const lines = keyOrLock.split('\n');
    const isLock = lines[0][0] === '#';

    let pins = [];
    for (let x = 1; x < lines.length-1; x++) {
        for (let y = 0; y < lines[x].length; y++) {
            if (typeof pins[y] === "undefined") {
                pins.push(0);
            }
            if (lines[x][y] === '#') {
                pins[y]++;
            }
        }
    }

    if (isLock) {
        locks.push(pins);
    } else {
        keys.push(pins);
    }
});

console.log(keys.reduce((acc, key) => acc + locks.filter((lock) => !lock.some((pin, pinIdx) => key[pinIdx] + pin > 5)).length, 0));