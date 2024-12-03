const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();

const regex = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/g;

let result = 0;

while ((match = regex.exec(input)) !== null) {
    result += Number.parseInt(match[1]) * Number.parseInt(match[2]);
}

console.log(result);