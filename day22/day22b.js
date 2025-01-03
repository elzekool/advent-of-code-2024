const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const mix = (a, b) => Number(BigInt(a) ^ BigInt(b));
const prune = (a) => a % 16777216;

const k = (a, b, c, d) => {
    return `${a === 0 ? '0' : a.toFixed(0)},${b === 0 ? '0' : b.toFixed(0)},${c === 0 ? '0' : c.toFixed(0)},${d === 0 ? '0' : d.toFixed(0)}`;
}

const bananas = {};
let rounds = 2000;

input.split('\n').map(n => Number.parseInt(n.trim())).forEach(n => {
    let seed = n;
    let prices = [];
    let diffs = [];
    let last = n % 10;
    for (let x = 0; x < rounds; x++) {
        seed = prune(mix(seed, seed * 64));
        seed = prune(mix(seed, Math.floor(seed / 32)));
        seed = prune(mix(seed, seed * 2048));
        prices.push((seed % 10));
        diffs.push((seed % 10)-last);
        last = seed % 10;
    }

    let combinations = {};
    for (let x = 3; x < rounds; x++) {        
        const key = k(diffs[x-3], diffs[x-2], diffs[x-1], diffs[x]);        
        if (combinations[key]) {
            continue;
        }
        combinations[key] = true;
        const price = prices[x];
        bananas[key] = (bananas[key] ?? 0) + price;     
    }        
});

let max = 0;
Object.values(bananas).forEach((val) => {
    if (val > max) {
        max = val;
    }
});

console.log(max);
