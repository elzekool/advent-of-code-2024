const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

// Here we keep track of the blocks on the disk, every block has:
// id: id of block, null if free space
// size: size of block
// sorted: is block sorted
let blocks = [];

let blockId = 0;
let blockSize = null;
input.split('').forEach(i => {
    const j = Number.parseInt(i, 10);
    if (blockSize === null) {
        blockSize = j;
        return;
    }
    // Add block for filled space
    blocks.push({ id: blockId, size: blockSize, sorted: false });
    // Add block for free space
    blocks.push({ id: null, size: j, sorted: false });
    blockSize = null;
    blockId++;
});

// The last block has no empty space character so add it now
if (blockId !== null) {
    blocks.push({ id: blockId, size: blockSize, sorted: false });
    blocks.push({ id: null, size: 0, sorted: true });
    blockId = null;
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

printBlocks();
while (true) {
    const firstFreeBlockIdx = blocks.findIndex(({id, size}) => id === null && size > 0);
    const lastFilledBlockIdx = blocks.findLastIndex(({id, size}) => id !== null && size > 0);

    // We are done when the first free block is sorted
    if (blocks[firstFreeBlockIdx].sorted) {
        break;
    }

    const freeBlock = blocks[firstFreeBlockIdx];
    const filledBlock = blocks[lastFilledBlockIdx];

    // scenario 1 -> free block size is same as filled block
    if (freeBlock.size === filledBlock.size) {
        // Move blockId and reset block id of last block to null
        freeBlock.id = filledBlock.id;
        filledBlock.id = null;
        filledBlock.sorted = true;
    
    // scenario 2 -> free block is smaller then filled block
    } else if(freeBlock.size < filledBlock.size) {
        // Move block Id
        freeBlock.id = filledBlock.id;
        // Split last block in filled and free block based on copied size
        filledBlock.size -= freeBlock.size;
        blocks.splice(lastFilledBlockIdx+1, 0, {
            id: null,
            size: freeBlock.size,
            sorted: true
        });
    // scenario 3 -> free block is larger then filled block}
    } else if (freeBlock.size > filledBlock.size) {
        const remainingFree = freeBlock.size - filledBlock.size;
        
        // Move block id and reduce size to copied data
        freeBlock.id = filledBlock.id;
        freeBlock.size = filledBlock.size;

        // Create free block after it of remaining free space
        blocks.splice(firstFreeBlockIdx+1, 0, {
            id: null,
            size: remainingFree,
            sorted: false,
        });

        // Set original free block to free
        filledBlock.id = null;
        filledBlock.sorted = true;
    }

    // Check if there is a free block at the end we can consider sorted
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


