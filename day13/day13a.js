const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n')

const extractRegex = /^[A-Za-z ]+: X(\+|=)([0-9]+), Y(\+|=)([0-9]+)$/

const machines = [];

input.forEach((block) => {
    const lines = block.split('\n').map(m => extractRegex.exec(m));
    machines.push({
        a: [ Number.parseInt(lines[0][2], 10),  Number.parseInt(lines[0][4], 10) ],
        b: [ Number.parseInt(lines[1][2], 10),  Number.parseInt(lines[1][4], 10) ],
        pos: [ Number.parseInt(lines[2][2], 10),  Number.parseInt(lines[2][4], 10) ],
    })
});

const findMinTokens = (a, b, target) => {
    const maxPresses = Math.ceil(target[0] / b[0]);
    for(let x = 0; x < maxPresses; x++) {
        const sum = b[0] * x;
        if ((target[0] - sum) % a[0] === 0) {
            const aPresses = (target[0] - sum) / a[0];
            const bPresses = x;
            
            if (
                (aPresses * a[1]) + (bPresses * b[1]) === target[1]
            ) {
                return [[
                    aPresses,
                    bPresses,
                    bPresses + (aPresses * 3)
                ]];
            }
        }
    }
    return [];
}

let sum = 0;
machines.forEach((machine) => {
    const minTokens = findMinTokens(machine.a, machine.b, machine.pos);
    if (minTokens.length > 0) {
        sum += minTokens[0][2];
    }
});

console.log(sum);