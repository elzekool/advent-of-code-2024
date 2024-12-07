package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	input, _ := os.ReadFile("../input.txt")
	lines := strings.Split(string(input), "\n")

	width := len(lines[0])
	height := len(lines)
	matrixSize := width * height

	coord := func(x, y int) int {
		return (x*width + y)
	}

	inBounds := func(x, y int) bool {
		return x >= 0 && y >= 0 && x < width && y <= height
	}

	rotate90Deg := func(direction []int) []int {
		return []int{direction[1], 0 - direction[0]}
	}

	initalPosition := []int{0, 0}

	matrix := make([]rune, matrixSize)
	for y := range lines {
		for x := range lines[y] {
			c := coord(x, y)
			matrix[c] = []rune(lines[x])[y]
			if matrix[c] == '^' {
				initalPosition[0] = x
				initalPosition[1] = y
			}
		}
	}

	var visitedCoords [][]int

	// Perform initial walk by the guard to determine the visited coords
	{
		stopSearch := false
		direction := []int{-1, 0}
		position := initalPosition

		for {
			if stopSearch {
				break
			}

			for {
				newPosition := []int{position[0] + direction[0], position[1] + direction[1]}
				if !inBounds(newPosition[0], newPosition[1]) {
					stopSearch = true
					break
				}

				c := coord(newPosition[0], newPosition[1])
				if matrix[c] == '#' {
					break
				}

				if matrix[c] != 'X' {
					matrix[c] = 'X'
					visitedCoords = append(visitedCoords, newPosition)
				}

				position = newPosition
			}
			direction = rotate90Deg(direction)
		}
	}

	workerCount := 50
	jobs := make(chan []int, len(visitedCoords))
	results := make(chan int, len(visitedCoords))

	for _ = range workerCount {

		// Go cpu.. gooooo brrr
		go func() {
			testMatrix := make([]rune, matrixSize)

			for check := range jobs {
				copy(testMatrix, matrix)

				blocksFound := 0

				stopSearch := false
				directionId := 0
				direction := []int{-1, 0}
				position := initalPosition

				testMatrix[check[0]*width+check[1]] = '#'

				for {
					if stopSearch {
						break
					}

					for {
						newPosition := []int{position[0] + direction[0], position[1] + direction[1]}
						if !inBounds(newPosition[0], newPosition[1]) {
							stopSearch = true
							break
						}

						c := coord(newPosition[0], newPosition[1])

						val := testMatrix[c]
						if val == '#' {
							break
						}

						// in a loop
						if val == rune(directionId) {
							blocksFound = 1
							stopSearch = true
							break
						}

						testMatrix[c] = rune(directionId)
						position = newPosition
					}

					direction = rotate90Deg(direction)
					directionId = (directionId + 1) % 4
				}

				results <- blocksFound
			}
		}()
	}

	for i := 0; i < len(visitedCoords); i++ {
		jobs <- visitedCoords[i]
	}
	close(jobs)

	blocks := 0
	for i := 0; i < len(visitedCoords); i++ {
		blocks += <-results
	}

	fmt.Println(blocks)
}
