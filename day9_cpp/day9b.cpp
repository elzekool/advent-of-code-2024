#include <iostream>
#include <vector>
#include <string>
#include <fstream>

using namespace std;

// #define IS_DEBUG
#define FREE_BLOCK_ID -1

struct diskBlock
{
    long blockId;
    char blockSize;

    // Doubly linked-list
    diskBlock* next;
    diskBlock* prev;
};

#ifdef IS_DEBUG
    void printBlocks(diskBlock* pFirstBlock)
    {
        diskBlock* pBlock = pFirstBlock;
        while (pBlock != NULL)
        {
            for (char i = 0; i < pBlock->blockSize; i++) {
                if (pBlock->blockId == FREE_BLOCK_ID) {
                    cout << ".";
                } else {
                    cout << pBlock->blockId;
                }
            }

            pBlock = pBlock->next;
        }
        cout << std::endl;
    }
#endif

diskBlock* findBlockById(diskBlock* pFirstBlock, long blockId)
{
    diskBlock* pBlock = pFirstBlock;
    while (pBlock != NULL)
    {
        if (pBlock->blockId == blockId) {
            return pBlock;
        }
        pBlock = pBlock->next;
    }
    return NULL;
}

diskBlock* findFreeBlock(diskBlock* pFirstBlock, char minSize, long beforeBlockId)
{
    diskBlock* pBlock = pFirstBlock;
    while (pBlock != NULL)
    {
        if (pBlock->blockId == beforeBlockId) {
            return NULL;
        }

        if (
            pBlock->blockId == FREE_BLOCK_ID && 
            pBlock->blockSize >= minSize
        ) {
            return pBlock;
        }

        pBlock = pBlock->next;
    }
    return NULL;
}

diskBlock* insertBlockAfter(diskBlock* pBlock) {
    struct diskBlock *pNewBlock = (struct diskBlock*)malloc(sizeof(struct diskBlock));
    pNewBlock->prev = pBlock;
    pNewBlock->next = pBlock->next;
    if (pBlock->next != NULL) {
        pBlock->next->prev = pNewBlock;
    }
    pBlock->next = pNewBlock;

    return pNewBlock;
}

int main()
{
    #ifdef IS_DEBUG
        std::ifstream fileStream("./test_input.txt");
    #else
        std::ifstream fileStream("./input.txt");
    #endif
    char inputChar = 0;
    
    diskBlock* pFirstBlock = NULL;   
    diskBlock* pLastReadBlock = NULL;

    bool isBlock = true;
    long blockId = 0;
    long lastBlockId = 0;

    while(fileStream.get(inputChar)) {
        char blockSize = inputChar - '0';
        struct diskBlock *b = (struct diskBlock*)malloc(sizeof(struct diskBlock));

        if (isBlock) {            
            b->blockId = blockId;
            b->blockSize = blockSize;
            b->prev = pLastReadBlock;
            b->next = NULL;
            lastBlockId = blockId;
            blockId++;            
        } else {
            b->blockId = FREE_BLOCK_ID;
            b->blockSize = blockSize;
            b->prev = pLastReadBlock;
            b->next = NULL;
        }

        if (pFirstBlock == NULL) {
            pFirstBlock = b;
        }

        if (pLastReadBlock != NULL) {
            pLastReadBlock->next = b;
        }

        pLastReadBlock = b;
        isBlock = !isBlock;
    }

    #ifdef IS_DEBUG
        printBlocks(pFirstBlock);
    #endif

    for (long testBlockId = lastBlockId; testBlockId >= 0; testBlockId--) {
        diskBlock* pBlockById = findBlockById(pFirstBlock, testBlockId);

        // Search for an empty space before the block index with enough space
        diskBlock* pFirstEmptyBlock = findFreeBlock(pFirstBlock, pBlockById->blockSize, pBlockById->blockId);
        if (pFirstEmptyBlock == NULL) {
            continue;
        }

        // scenario 1 -> free block size is same as filled block
        if (pFirstEmptyBlock->blockSize == pBlockById->blockSize) {
            // Move block id and reset block id of last block to null
            pFirstEmptyBlock->blockId = pBlockById->blockId;
            pBlockById->blockId = FREE_BLOCK_ID;

        // scenario 2 -> free block is larger then filled block}
        } else if (pFirstEmptyBlock->blockSize > pBlockById->blockSize) {
            char remainingFree = pFirstEmptyBlock->blockSize - pBlockById->blockSize;

            // move block id and size from filled block
            pFirstEmptyBlock->blockId = pBlockById->blockId;
            pFirstEmptyBlock->blockSize = pBlockById->blockSize;
            pBlockById->blockId = FREE_BLOCK_ID;

            diskBlock* pNewBlock = insertBlockAfter(pFirstEmptyBlock);
            pNewBlock->blockId = FREE_BLOCK_ID;
            pNewBlock->blockSize = remainingFree;
        }

        #ifdef IS_DEBUG
            printBlocks(pFirstBlock);
        #endif
    }

    #ifdef IS_DEBUG
        printBlocks(pFirstBlock);
    #endif

    long sum = 0;
    long idx = 0;
    diskBlock* pBlock = pFirstBlock;
    while (pBlock != NULL) {
        if (pBlock->blockId == FREE_BLOCK_ID) {
            idx += pBlock->blockSize;
        } else {
            for (char i = 0; i < pBlock->blockSize; i++) {
                sum += pBlock->blockId * idx;    
                idx++;
            }
        }
        pBlock = pBlock->next;
    } 
    
    cout << sum << std::endl;

    return 0;
}