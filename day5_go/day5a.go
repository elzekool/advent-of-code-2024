package main

import (
	"fmt"
	"os"
	"slices"
	"strconv"
	"strings"
)

func main() {
	input, _ := os.ReadFile("input.txt")
	blocks := strings.Split(string(input), "\n\n")

	sorts := make(map[string]int)
	for _, sortItem := range strings.Split(blocks[0], "\n") {
		nrs := strings.Split(sortItem, "|")
		sorts[nrs[0]+"|"+nrs[1]] = -1
		sorts[nrs[1]+"|"+nrs[0]] = 1
	}

	sum := 0
	for _, line := range strings.Split(blocks[1], "\n") {
		pages := strings.Split(line, ",")
		slices.SortFunc(pages, func(a, b string) int {
			if val, ok := sorts[a+"|"+b]; ok {
				return val
			}
			return 0
		})

		sortedPages := strings.Join(pages, ",")
		if line != sortedPages {
			continue
		}

		newval, _ := strconv.Atoi(pages[len(pages)/2])
		sum += newval
	}

	fmt.Println(sum)
}
