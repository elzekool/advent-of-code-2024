const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

let blocks = [];

let blockId = 0;
let blockSize = null;
input.split('').forEach(i => {
    const j = Number.parseInt(i, 10);
    if (blockSize === null) {
        blockSize = j;
        return;
    }
    blocks.push({
        id: blockId,
        size: blockSize,
        sorted: false        
    });
    blocks.push({
        id: null,
        size: j,
        sorted: false
    });
    blockSize = null;
    blockId++;
});

if (blockId !== null) {
    blocks.push({
        id: blockId,
        size: blockSize,
        sorted: false,
    });
    blocks.push({
        id: null,
        size: 0,
        sorted: true

    });
    blockId = null;
} else {
    blocks[blocks.length-1].sorted = true;
}

const printBlocks = () => {
    return; 

    let s = '';
    blocks.forEach((b) => {
        for(let i = 0; i < b.size; i++) {
            if (b.id === null) {
                if (b.sorted) {
                    s+= `\x1b[31m.\x1b[0m`
                } else {
                    s+= '.';
                }
                
            } else {
                s+= b.id;
            }
        }
    })
    console.log(s);
}

let i = 0;

printBlocks();

while (true) {
    const firstEmptyBlockIdx = blocks.findIndex(({id, size}) => id === null && size > 0);
    const lastFilledBlockIdx = blocks.findLastIndex(({id, size}) => id !== null && size > 0);

    if (blocks[firstEmptyBlockIdx].sorted) {
        break;
    }

    const freeBlock = blocks[firstEmptyBlockIdx];
    const filledBlock = blocks[lastFilledBlockIdx];

    // scenario 1 -> free block size is same as filled block
    if (freeBlock.size === filledBlock.size) {
        // Move blockId and reset block id of last block to null
        blocks[firstEmptyBlockIdx].id = blocks[lastFilledBlockIdx].id;
        blocks[lastFilledBlockIdx].id = null;
        blocks[lastFilledBlockIdx].sorted = true;
    
    // scenario 2 -> free block is smaller then filled block
    } else if(freeBlock.size < filledBlock.size) {
        const toMove = freeBlock.size;
        blocks[firstEmptyBlockIdx].id = blocks[lastFilledBlockIdx].id;
        blocks[lastFilledBlockIdx].size -= toMove;
        blocks.splice(lastFilledBlockIdx+1, 0, {
            id: null,
            size: toMove,
            sorted: true
        });
    // scenario 3 -> free block is larger then filled block}
    } else if (freeBlock.size > filledBlock.size) {
        const remainingFree = freeBlock.size - filledBlock.size;
        blocks.splice(firstEmptyBlockIdx+1, 0, {
            id: null,
            size: remainingFree,
            sorted: false,
        });
        blocks[firstEmptyBlockIdx].id = blocks[lastFilledBlockIdx+1].id;
        blocks[firstEmptyBlockIdx].size = blocks[lastFilledBlockIdx+1].size;
        blocks[lastFilledBlockIdx+1].id = null;
        blocks[lastFilledBlockIdx+1].sorted = true;

    // Ehh 
    } else {
        console.log("panick!");
    }

    const lastEmptyNonSortedBlockIdx = blocks.findLastIndex(({id, sorted}) => id === null && sorted === false);
    if (blocks[lastEmptyNonSortedBlockIdx+1].id === null && blocks[lastEmptyNonSortedBlockIdx+1].sorted) {
        blocks[lastEmptyNonSortedBlockIdx].sorted = true;
    }

    printBlocks();
}

printBlocks();

let sum = 0;
let idx = 0;
blocks.forEach(({ id, size }) => {
    if (id === null) {
        return;
    }
    for (let i = 0; i < size; i++) {
        sum += id * idx;
        idx++;
    }
});
console.log(sum);


