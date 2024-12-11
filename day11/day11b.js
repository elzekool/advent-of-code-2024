const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

let stones = input.split(' ').map((n) => Number.parseInt(n, 10)).map(n => ({    
    stones: 1,
    
    // Most common cases
    zeros: n === 0 ? 1 : 0,
    ones: n === 1 ? 1 : 0,
    n2024: n === 2024 ? 1 : 0,

    remaining: (n === 0 || n === 1 || n === 2024) ? {} : { [n] : 1 },    
}));

const updateRemaining = (remaining, val, qty) => {
    remaining[val] = (remaining[val] ?? 0) + qty;
}

for(let x = 0; x < 75; x++) {    
    stones.forEach((stone, i) => {

        const newRemaining = {};
        let newZeros = 0;
        let newOnes = 0;
        let new2024 = 0;

        // 0 -> 1
        newOnes = stone.zeros;

        // 1 -> 2024
        new2024 = stone.ones;

        // 2024 -> [ 20, 24 ] 
        if (stone.n2024 > 0) {
            updateRemaining(newRemaining, 20, stone.n2024);
            updateRemaining(newRemaining, 24, stone.n2024);
            stone.stones += stone.n2024;
        }

        // other
        Object.keys(stone.remaining).forEach((remainingKey) => {
            const remaining = Number.parseInt(remainingKey, 10);
            const remainingCount = stone.remaining[remainingKey];            
            const numDigits = Math.ceil(Math.log10(remaining+1));
            
            if (numDigits % 2 === 0) {
                const num1 = Math.floor(remaining / Math.pow(10, numDigits / 2));
                const num2 = remaining % Math.pow(10, numDigits / 2);

                if (num1 === 0) {
                    newZeros += remainingCount;
                } else if (num1 === 1) {
                    newOnes += remainingCount;
                } else if (num1 === 2024) {
                    new2024 += remainingCount;
                } else {
                    updateRemaining(newRemaining, num1, remainingCount);
                }

                if (num2 === 0) {
                    newZeros += remainingCount;
                } else if (num2 === 1) {
                    newOnes += remainingCount;
                } else if (num2 === 2024) {
                    new2024 += remainingCount;
                } else {
                    updateRemaining(newRemaining, num2, remainingCount);
                }

                stone.stones += remainingCount;
            } else {
                updateRemaining(newRemaining, remaining * 2024, remainingCount);
            }
        });

        stone.ones = newOnes;
        stone.zeros = newZeros;
        stone.n2024 = new2024;
        stone.remaining = newRemaining;
    })
}

console.log(stones.reduce((acc, stone) => {
    return acc + stone.stones;
}, 0));
