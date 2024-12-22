const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const mix = (a, b) => Number(BigInt(a) ^ BigInt(b));
const prune = (a) => a % 16777216;

const nextRng = (seed) => {
    let next = seed;
    next = mix(next, next * 64);
    next = prune(next);
    next = mix(next, Math.floor(next / 32));
    next = prune(next);
    next = mix(next, next * 2048)
    next = prune(next);

    return next;
}

let sum = 0;

input.split('\n').map(n => Number.parseInt(n.trim())).forEach(n => {
    let seed = n;
    for (let x = 0; x < 2000; x++) {
        seed = nextRng(seed);
    }
    sum += seed;
})

console.log(sum);
