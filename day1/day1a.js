
const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
const items = input.split('\n').map(item => item.split('   ').map(n => Number.parseInt(n, 10)));

const items_1 = items.map((item) => item[0]).sort();
const items_2 = items.map((item) => item[1]).sort();

let diff = 0;

items_1.forEach((item, index) => { 
    diff += Math.abs(items_1[index] - items_2[index]);
});

console.log(diff);