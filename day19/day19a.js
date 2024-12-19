const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n');

const patterns = input[0].split(',').map((t) => t.trim());
const towls = input[1].split('\n').map((t) => t.trim());
const cache = {};

function hasMatches(remaining) {
    // If empty we know we found a match
    if (remaining === '') {
        return true;
    }

    // Don't check the remainder if we already did so
    // also helps with repetitions between towls
    if (typeof cache[remaining] !== "undefined") {
        return cache[remaining];
    }

    // Learned about some() :)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    return cache[remaining] = (patterns.some((p) => {        
        if (remaining.startsWith(p)) {
            return hasMatches(remaining.substring(p.length));
        }
        return false;
    }));
}

console.log(towls.filter((towl) => hasMatches(towl)).length);
