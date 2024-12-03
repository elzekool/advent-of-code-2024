const fs = require('node:fs');
const input = fs.readFileSync('input.txt', 'utf8').trim();
const items = input.split('\n').map(item => item.split('   ').map(n => Number.parseInt(n, 10)));

const items_1 = items.map((item) => item[0]);
const items_2 = items.map((item) => item[1]);

let similarity = 0;

items_1.forEach((item) => { 
    similarity += item * items_2.filter((item_2_item) => item_2_item === item).length;
});

console.log(similarity);