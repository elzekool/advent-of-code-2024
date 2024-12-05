const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n');

const orders = {};
const pages = [];

let readingPages = false;
input.forEach((line) => {
    const trLine = line.trim();
    if (readingPages) {
        pages.push(trLine.split(','));
        return;
    }

    if (trLine === '') {
        readingPages = true;
        return;
    }

    const [a,b] = trLine.split('|');
    orders[`${a},${b}`] = -1;
    orders[`${b},${a}`] = 1;
});

let sum = 0;
pages.forEach((line) => {
    const before = line.join(',');
    line.sort((a, b) => orders[`${a},${b}`] ?? 0);
    const after = line.join(',');

    if (before !== after) {
        return;
    }

    sum += Number.parseInt(line[Math.floor(line.length/2)], 10);
});

console.log(sum);