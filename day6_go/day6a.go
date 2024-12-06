package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	width := len(lines[0])
	height := len(lines)
	position := []int{0, 0}

	matrix := make([][]rune, len(lines))
	for i := range matrix {
		matrix[i] = make([]rune, len(lines[i]))
		for j := range lines[i] {
			matrix[i][j] = []rune(lines[i])[j]
			if matrix[i][j] == '^' {
				position[0] = i
				position[1] = j
			}
		}
	}

	direction := []int{-1, 0}

	visited := 1
	found := false

	for {
		if found {
			break
		}

		for {
			newPosition := []int{position[0] + direction[0], position[1] + direction[1]}
			if newPosition[0] < 0 || newPosition[1] < 0 || newPosition[0] >= width || newPosition[1] >= height {
				found = true
				break
			}

			if matrix[newPosition[0]][newPosition[1]] == '#' {
				break
			}

			if matrix[newPosition[0]][newPosition[1]] != 'X' {
				matrix[newPosition[0]][newPosition[1]] = 'X'
				visited += 1
			}

			position = []int{newPosition[0], newPosition[1]}
		}
		direction = []int{direction[1], 0 - direction[0]}
	}

	fmt.Println(visited)
}
