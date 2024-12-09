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
    bool isSorted;

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
                if (pBlock->blockId == FREE_BLOCK_ID && pBlock->isSorted) {
                    cout << "\x1b[31m.\x1b[0m";
                } else if (pBlock->blockId == FREE_BLOCK_ID) {
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

diskBlock* findFirstFreeBlock(diskBlock* pFirstBlock)
{
    diskBlock* pBlock = pFirstBlock;
    while (pBlock != NULL)
    {
        if (
            pBlock->blockId == FREE_BLOCK_ID && 
            pBlock->blockSize > 0
        ) {
            return pBlock;
        }
        pBlock = pBlock->next;
    }
    return NULL;
}

diskBlock* findLastFilledBlock(diskBlock* pLastBlock)
{
    diskBlock* pBlock = pLastBlock;
    while ((pBlock != NULL))
    {
        if (
            pBlock->blockId != FREE_BLOCK_ID && 
            pBlock->blockSize > 0
        ) {
            return pBlock;
        }
        pBlock = pBlock->prev;
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
    diskBlock* pLastBlock = NULL;

    diskBlock* pLastReadBlock = NULL;

    bool isBlock = true;
    long blockId = 0;
    while(fileStream.get(inputChar)) {
        char blockSize = inputChar - '0';
        struct diskBlock *b = (struct diskBlock*)malloc(sizeof(struct diskBlock));

        if (isBlock) {            
            b->blockId = blockId;
            b->blockSize = blockSize;
            b->isSorted = false;
            b->prev = pLastReadBlock;
            b->next = NULL;
            blockId++;            
        } else {
            b->blockId = FREE_BLOCK_ID;
            b->blockSize = blockSize;
            b->isSorted = false;
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

    // Add one empty block at the end
    struct diskBlock *b = (struct diskBlock*)malloc(sizeof(struct diskBlock));
    b->blockId = FREE_BLOCK_ID;
    b->blockSize = 0;
    b->isSorted = true;
    b->prev = pLastReadBlock;
    b->next = NULL;
    pLastBlock = b;

    #ifdef IS_DEBUG
        printBlocks(pFirstBlock);
    #endif

    diskBlock* pFreeBlock = findFirstFreeBlock(pFirstBlock);
    diskBlock* pFilledBlock = findLastFilledBlock(pLastBlock);

    while(true) {
        // We are done when the first free block is sorted
        if (pFreeBlock->isSorted) {
            break;
        }

        // scenario 1 -> free block size is same as filled block
        if (pFreeBlock->blockSize == pFilledBlock->blockSize) {
            // Move blockId and reset block id of last block to empty
            pFreeBlock->blockId = pFilledBlock->blockId;
            pFilledBlock->blockId = FREE_BLOCK_ID;
            pFilledBlock->isSorted = true;

            // Both blocks have changed, we need to search for new blocks
            pFreeBlock = findFirstFreeBlock(pFirstBlock);
            pFilledBlock = findLastFilledBlock(pLastBlock);

            // Now we moved the last filled block, check if any block after is considered sorted
            if (pFilledBlock->next != NULL) {
                pFilledBlock->next->isSorted = true;
            }

        // scenario 2 -> free block is smaller then filled block
        } else if (pFreeBlock->blockSize < pFilledBlock->blockSize) {
            // Move block Id
            pFreeBlock->blockId = pFilledBlock->blockId;

            // Split last block in filled and free block based on copied size
            pFilledBlock->blockSize = pFilledBlock->blockSize - pFreeBlock->blockSize;
            diskBlock* pNewEmptyBlock = insertBlockAfter(pFilledBlock);
            pNewEmptyBlock->blockId = FREE_BLOCK_ID;
            pNewEmptyBlock->blockSize = pFreeBlock->blockSize;
            pNewEmptyBlock->isSorted = true;

            // We filled the free block, search for the next one
            pFreeBlock = findFirstFreeBlock(pFirstBlock);

        // scenario 3 -> free block is larger then filled block}
        } else if (pFreeBlock->blockSize > pFilledBlock->blockSize) {
            char remainingSize = pFreeBlock->blockSize - pFilledBlock->blockSize;
            
            // Move block id and reduce size to copied data
            pFreeBlock->blockId = pFilledBlock->blockId;
            pFreeBlock->blockSize = pFilledBlock->blockSize;

            // Create free block after it of remaining free space
            diskBlock* pNewEmptyBlock = insertBlockAfter(pFreeBlock);
            pNewEmptyBlock->blockId = FREE_BLOCK_ID;
            pNewEmptyBlock->blockSize = remainingSize;
            pNewEmptyBlock->isSorted = false;

            // Set filled block to free
            pFilledBlock->blockId = FREE_BLOCK_ID;
            pFilledBlock->isSorted = true;

            // Move the free block pointer to our new block
            // and search for the last filled block
            pFreeBlock = pFreeBlock->next;
            pFilledBlock = findLastFilledBlock(pLastBlock);

            // Now we moved the last filled block, check if any block after is considered sorted
            if (
                pFilledBlock->next != NULL && 
                pFilledBlock->next->blockId == FREE_BLOCK_ID
            ) {
                pFilledBlock->next->isSorted = true;
            }
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
        if (pBlock->blockId != FREE_BLOCK_ID) {
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