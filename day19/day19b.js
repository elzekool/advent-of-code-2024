const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n');

const patterns = input[0].split(',').map((t) => t.trim());
const towls = input[1].split('\n').map((t) => t.trim());
const cache = {};

function matchCount(remainder) {
    if (remainder === '') {
        // If the string is empty we know we landed on a combination
        return 1;
    }

    // Don't check the remainder if we already did so
    // also helps with repetitions between towls
    if (typeof cache[remainder] !== "undefined") {
        return cache[remainder];
    }

    return cache[remainder] = patterns.reduce((acc, p) => {
        if (remainder.startsWith(p)) {
            return acc + matchCount(remainder.substring(p.length));
        }
        return acc;
    }, 0);
}

console.log(towls.reduce((acc, towl) => acc + matchCount(towl), 0));
