const fs = require('node:fs');
const { join } = require('node:path');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n');

const registers = {
    A: 0,
    B: 0,
    C: 0,
    IP: 0
};

input[0].split('\n').forEach((line) => {
    const m = /^Register ([ABC]): ([0-9]+)$/.exec(line);
    if (m[1] === 'A') {
        registers.A = Number.parseInt(m[2], 10);
    } else if (m[1] === 'B') {
        registers.B = Number.parseInt(m[2], 10);
    } else if (m[1] === 'C') {
        registers.C = Number.parseInt(m[2], 10);
    }
})

let output = [];

const program = input[1].replace('Program: ', '').split(',').map((n => Number.parseInt(n, 10)))

const combo = (operand) => {
    if (operand === 4) { return registers.A }
    if (operand === 5) { return registers.B }
    if (operand === 6) { return registers.C }
    return operand; 
}

const ops = {
    adv : (operand) => { registers.A = Math.floor(registers.A / Math.pow(2, combo(operand))); registers.IP += 2; },
    bxl : (operand) => { registers.B = Number(BigInt(registers.B) ^ BigInt(operand)); registers.IP += 2; },
    bst : (operand) => { registers.B = combo(operand) % 8; registers.IP += 2; },
    jnz : (operand) => { registers.IP = (registers.A !== 0) ? operand : registers.IP + 2; },
    bxc : (operand) => { registers.B = Number(BigInt(registers.B) ^ BigInt(registers.C)); registers.IP += 2; },
    out : (operand) => { output.push(combo(operand) % 8); registers.IP += 2; },
    bdv : (operand) => { registers.B = Math.floor(registers.A / Math.pow(2, combo(operand))); registers.IP += 2; },
    cdv : (operand) => { registers.C = Math.floor(registers.A / Math.pow(2, combo(operand))); registers.IP += 2; },
}

const opcodes = [
    ops.adv,
    ops.bxl,
    ops.bst,
    ops.jnz,
    ops.bxc,
    ops.out,
    ops.bdv,
    ops.cdv
];


const run = (a) => {
    registers.IP = 0;
    registers.A = a;
    output = [];

    while(registers.IP < program.length) {
        opcodes[program[registers.IP]](program[registers.IP + 1]);
    }

    return output;
}

let result = Number.MAX_SAFE_INTEGER;
let queue = [ [1, 0] ];

while(queue.length > 0) {
    const [validateDigits, startA] = queue.pop();
    const endA = startA + 8;
    const validate = program.slice(-validateDigits).join(',');

    for (let testA = startA; testA < endA; testA++) {
        if (run(testA).join(',') === validate) {
            queue.unshift([validateDigits + 1, testA * 8]);
            if (validateDigits === program.length) {
                if (testA < result) {
                    result = testA;
                }
            }
        }
    }
}

console.log(result);