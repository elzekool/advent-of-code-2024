const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n');

let known = {};
let states = {};
let gates = [];

const types = {
    XOR: (a, b) => (a || b) && (a != b),
    OR: (a, b) => (a || b),
    AND: (a, b) => (a && b)
};

input[0].split('\n').forEach((line) => {
    const [ wire, value ] = line.split(': ');
    known[wire] = true;
    states[wire] = value === "1";
});

input[1].split('\n').forEach((line) => {
    const [wireInA, type, wireInB,, wireOut] = line.split(' ').map(l => l.trim());
    gates.push([ wireInA, wireInB , wireOut, types[type] ]);
});

let gatesSorted = [];
while(gates.length > 0) {
    let next = gates.findIndex(
        ([ wireInA, wireInB ]) => known[wireInA] === true && known[wireInB] === true
    );
    known[gates[next][2]] = true;
    gatesSorted.push(gates[next]);
    gates.splice(next, 1);
}

for(let j = 0; j < gatesSorted.length; j++) {
    const [ wireInA, wireInB , wireOut, type ] = gatesSorted[j];
    states[wireOut] = type(states[wireInA], states[wireInB]);
}

let s = '';
Object.keys(states).filter(wire => wire.startsWith('z')).sort().reverse().forEach((wire) => {
    s += states[wire] ? "1" : "0"
});

console.log(Number.parseInt(s, 2));

