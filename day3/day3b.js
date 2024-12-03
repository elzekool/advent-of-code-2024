const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

const regex = /(don't\(\)|do\(\)|mul\(([0-9]{1,3}),([0-9]{1,3})\))/g;

let result = 0;
let state = true;

while ((match = regex.exec(input)) !== null) {
    if (match[1] === 'don\'t()') {
        state = false;
        continue;
    } else if (match[1] === 'do()') {
        state = true;
        continue;
    }

    if (!state) {
        continue;
    }

    result += Number.parseInt(match[2]) * Number.parseInt(match[3]);
}

console.log(result);