const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

// const input = `7 6 4 2 1
// 1 2 7 8 9
// 9 7 6 2 1
// 1 3 2 4 5
// 8 6 4 4 1
// 1 3 6 7 9`;

let safe = 0;

input.split('\n').forEach((line) => {
    const all_items = line.trim().split(' ');
    const all_items_len = all_items.length;

    let was_safe = false;

    for(let removeIdx = -1; removeIdx < all_items_len; removeIdx++) {
        const items = all_items.filter((_, idx) => idx !== removeIdx);
        const diffs = items.slice(0, -1).map((diff_item, index) => diff_item - items[index+1]);

        const up_diffs = diffs.filter((diff_item) => diff_item > 0);
        const down_diffs = diffs.filter((diff_item) => diff_item < 0);

        if (up_diffs.length > 0 && down_diffs.length > 0) {            
            continue;
        }

        if (diffs.filter((diff) => Math.abs(diff) < 1 || Math.abs(diff) > 3).length > 0) {
            continue;
        }

        safe++;
        was_safe = true;
        break;
    }

    console.log(`${was_safe ? 'save' : 'unsafe'} ${line}`)
});

console.log(safe);