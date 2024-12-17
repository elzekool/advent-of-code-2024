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

const program = input[1].replace('Program: ', '').split(',').map((n => Number.parseInt(n, 10)))

const combo = (operand) => {
    if (operand === 4) { return 'A' }
    if (operand === 5) { return 'B' }
    if (operand === 6) { return 'C' }
    return operand; 
}

const ops = {
    adv : (operand) => { console.log(`${registers.IP}: A = (A / pow(2,${combo(operand)}));`); registers.IP += 2; },
    bxl : (operand) => { console.log(`${registers.IP}: B = B xor ${operand}`); registers.IP += 2; },
    bst : (operand) => { console.log(`${registers.IP}: B = ${combo(operand)} mod 8`); registers.IP += 2; },
    jnz : (operand) => { console.log(`${registers.IP}: if (A != 0) { goto ${operand}; }`); registers.IP += 2; },
    bxc : (operand) => { console.log(`${registers.IP}: B = B xor C`); registers.IP += 2; },
    out : (operand) => { console.log(`${registers.IP}: OUT ${combo(operand)} mod 8`); registers.IP += 2; },
    bdv : (operand) => { console.log(`${registers.IP}: B = (A / pow(2,${combo(operand)}));`); registers.IP += 2; },
    cdv : (operand) => { console.log(`${registers.IP}: C = (A / pow(2,${combo(operand)}));`); registers.IP += 2; },
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

while(registers.IP < program.length) {
    opcodes[program[registers.IP]](program[registers.IP + 1]);
}
