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

	initalPosition := []int{0, 0}

	matrix := make([][]rune, len(lines))
	for i := range matrix {
		matrix[i] = make([]rune, len(lines[i]))
		for j := range lines[i] {
			matrix[i][j] = []rune(lines[i])[j]
			if matrix[i][j] == '^' {
				initalPosition[0] = i
				initalPosition[1] = j
			}
		}
	}

	// Let the guard walk one initial time
	{
		found := false
		direction := []int{-1, 0}
		position := []int{initalPosition[0], initalPosition[1]}

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

				matrix[newPosition[0]][newPosition[1]] = 'X'
				position = []int{newPosition[0], newPosition[1]}
			}
			direction = []int{direction[1], 0 - direction[0]}
		}
	}

	blocks := 0
	testMatrix := make([][]rune, height)
	for i := range testMatrix {
		testMatrix[i] = make([]rune, width)
	}

	for x := range width {
		for y := range height {
			if matrix[x][y] != 'X' {
				continue
			}

			for i := range testMatrix {
				copy(testMatrix[i], matrix[i])
			}

			found := false
			directionId := 0
			direction := []int{-1, 0}
			position := []int{initalPosition[0], initalPosition[1]}

			testMatrix[x][y] = '#'

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

					val := testMatrix[newPosition[0]][newPosition[1]]
					if val == '#' {
						break
					}

					// in a loop
					if val == rune(directionId) {
						blocks += 1
						found = true
						break
					}

					if val == '#' {
						break
					}

					testMatrix[newPosition[0]][newPosition[1]] = rune(directionId)

					position = []int{newPosition[0], newPosition[1]}
				}

				direction = []int{direction[1], 0 - direction[0]}
				directionId = (directionId + 1) % 4
			}
		}
	}

	fmt.Println(blocks)
}
