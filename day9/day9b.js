const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

let blocks = [];

let blockIds = [];
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
        size: blockSize      
    });
    blocks.push({
        id: null,
        size: j
    });
    blockIds.push(blockId);
    blockSize = null;
    blockId++;
});

if (blockId !== null) {    
    blocks.push({
        id: blockId,
        size: blockSize
    });
    blocks.push({
        id: null,
        size: 0
    });
    blockIds.push(blockId);
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
                s+= '.';                
            } else {
                s+= b.id;
            }
        }
    })
    console.log(s);
}

blockIds.reverse();
blockIds.forEach((blockId) => {
    const filledBlockIdx = blocks.findIndex(({id}) => id === blockId);
    const filledBlock = blocks[filledBlockIdx];
    const firstEmptyBlockIdx = blocks.findIndex(({ id, size }) => id === null && size >= filledBlock.size);
    if (firstEmptyBlockIdx === -1 || firstEmptyBlockIdx > filledBlockIdx) {
        return;
    }

    const freeBlock = blocks[firstEmptyBlockIdx];

    // scenario 1 -> free block size is same as filled block
    if (freeBlock.size === filledBlock.size) {
        // Move blockId and reset block id of last block to null
        blocks[firstEmptyBlockIdx].id = blocks[filledBlockIdx].id;
        blocks[filledBlockIdx].id = null;
        blocks[filledBlockIdx].sorted = true;

    // scenario 2 -> free block is larger then filled block}
    } else if (freeBlock.size > filledBlock.size) {
        const remainingFree = freeBlock.size - filledBlock.size;
        blocks.splice(firstEmptyBlockIdx+1, 0, {
            id: null,
            size: remainingFree,
            sorted: false,
        });
        blocks[firstEmptyBlockIdx].id = blocks[filledBlockIdx+1].id;
        blocks[firstEmptyBlockIdx].size = blocks[filledBlockIdx+1].size;
        blocks[filledBlockIdx+1].id = null;
        blocks[filledBlockIdx+1].sorted = true;

    // Ehh 
    } else {
        console.log("panick!");
    }

    printBlocks();
})

printBlocks();

let sum = 0;
let idx = 0;
blocks.forEach(({ id, size }) => {
    if (id === null) {
        idx += size;
        return;
    }
    for (let i = 0; i < size; i++) {
        sum += id * idx;
        idx++;
    }
});
console.log(sum);


