const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n');

const recursiveGetSolutions = (goal, remaining) => {
    // Check if we are a leaf
    if (remaining.length === 1) {
        return [ remaining[0] ];
    }

    const value = remaining[remaining.length-1];
    const nodes = recursiveGetSolutions(goal, remaining.slice(0, -1));

    return result = [
        ...nodes.map(n => n + value),
        ...nodes.map(n => n * value)
    ].filter(c => c <= goal);    
}

let sum = 0;

input.forEach((line) => {
    let [ result, input ] = line.split(':').map(s => s.trim());
    result = Number.parseInt(result, 10);
    input = input.split(' ').map(s => s.trim()).filter(s => s !== '').map(s => Number.parseInt(s, 10));

    const solutions = recursiveGetSolutions(result, input);
    if (solutions.indexOf(result) !== -1) {
        sum += result;
    }
});

console.log(sum);

