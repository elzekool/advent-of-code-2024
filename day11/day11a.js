const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

let stones = input.split(' ').map((n) => Number.parseInt(n, 10)).map(n => ({    
    stones: 1,
    remaining: { [n] : 1 },    
}));

const updateRemaining = (remaining, val, qty) => {
    remaining[val] = (remaining[val] ?? 0) + qty;
}

for(let x = 0; x < 25; x++) {    
    stones.forEach((stone, i) => {
        const newRemaining = {};
        Object.keys(stone.remaining).forEach((remainingKey) => {
            const remaining = Number.parseInt(remainingKey, 10);
            const remainingCount = stone.remaining[remainingKey];            
            const numDigits = Math.ceil(Math.log10(remaining+1));

            if (remaining === 0) {
                updateRemaining(newRemaining, 1, remainingCount);
            } else if (numDigits % 2 === 0) {
                const num1 = Math.floor(remaining / Math.pow(10, numDigits / 2));
                const num2 = remaining % Math.pow(10, numDigits / 2);
                updateRemaining(newRemaining, num1, remainingCount);            
                updateRemaining(newRemaining, num2, remainingCount);
                stone.stones += remainingCount;
            } else {
                updateRemaining(newRemaining, remaining * 2024, remainingCount);
            }
        });
        stone.remaining = newRemaining;
    })
}

console.log(stones.reduce((acc, stone) => {
    return acc + stone.stones;
}, 0));
