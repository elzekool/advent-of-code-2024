const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

// Here we keep track of the blocks on the disk, every block has:
// id: id of block, null if free space
// size: size of block
let blocks = [];

// Here we keep track of the block ids encountered, this saves looking 
// them up later
let blockIds = [];

let blockId = 0;
let blockSize = null;
input.split('').forEach(i => {
    const j = Number.parseInt(i, 10);
    if (blockSize === null) {
        blockSize = j;
        return;
    }
    // Add block for filled space
    blocks.push({ id: blockId, size: blockSize });
    // Add block for free space
    blocks.push({ id: null, size: j });
    blockIds.push(blockId);
    blockSize = null;

    // Keep track of our blockIds
    blockId++;
});

// The last block has no empty space character so add it now
if (blockId !== null) {    
    blocks.push({ id: blockId, size: blockSize });
    blockIds.push(blockId);
} else {
    blocks[blocks.length-1].sorted = true;
}

const printBlocks = () => {
    // Remove for pretty picture :D
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

// Reverse block ids as we need to move items from high to low
blockIds.reverse();

blockIds.forEach((blockId) => {
    const filledBlockIdx = blocks.findIndex(({id}) => id === blockId);
    const filledBlock = blocks[filledBlockIdx];

    // Search for an empty space before the block index with enough space
    const firstEmptyBlockIdx = blocks.findIndex(({ id, size }) => id === null && size >= filledBlock.size);
    if (firstEmptyBlockIdx === -1 || firstEmptyBlockIdx > filledBlockIdx) {
        // No space, move to next block id
        return;
    }

    const freeBlock = blocks[firstEmptyBlockIdx];

    // scenario 1 -> free block size is same as filled block
    if (freeBlock.size === filledBlock.size) {
        // Move block id and reset block id of last block to null
        freeBlock.id = filledBlock.id;
        filledBlock.id = null;

    // scenario 2 -> free block is larger then filled block}
    } else if (freeBlock.size > filledBlock.size) {
        const remainingFree = freeBlock.size - filledBlock.size;

        // move block id and size from filled block
        freeBlock.id = filledBlock.id;
        freeBlock.size = filledBlock.size;
        filledBlock.id = null;

        // create new free block after it
        blocks.splice(firstEmptyBlockIdx+1, 0, {
            id: null,
            size: remainingFree
        });        
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


