package main

import (
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

type calibrationLine struct {
	expectedResult int
	inputs         []int
}

func convertInput(lines []string) []calibrationLine {
	calibrationLines := make([]calibrationLine, len(lines))

	for lineIdx, line := range lines {
		lineElements := strings.Split(line, ":")
		inputsAsStrings := strings.Split(strings.Trim(lineElements[1], " "), " ")

		expectedResult, _ := strconv.Atoi(strings.Trim(lineElements[0], " "))
		inputs := make([]int, len(inputsAsStrings))
		for numIndex, inputAsString := range inputsAsStrings {
			inputs[numIndex], _ = strconv.Atoi(inputAsString)
		}
		calibrationLines[lineIdx] = calibrationLine{
			expectedResult: expectedResult,
			inputs:         inputs,
		}
	}

	return calibrationLines
}

func recursiveSolve(goal int, remaining []int) []int {
	if len(remaining) == 1 {
		return remaining
	}

	value := remaining[len(remaining)-1]
	nodes := recursiveSolve(goal, remaining[0:len(remaining)-1])

	nodeLen := len(nodes)
	result := make([]int, nodeLen*3)

	for idx, node := range nodes {
		result[idx] = node + value
		result[idx+nodeLen] = node * value
		result[idx+(nodeLen*2)] = (int(math.Pow(10, math.Ceil(math.Log10(float64(value+1))))) * node) + value
	}

	return result
}

func main() {
	input, _ := os.ReadFile("../input.txt")
	lines := strings.Split(string(input), "\n")

	sum := 0
	for _, calcalibrationLine := range convertInput(lines) {
		found := false
		for _, solution := range recursiveSolve(calcalibrationLine.expectedResult, calcalibrationLine.inputs) {
			if solution == calcalibrationLine.expectedResult {
				found = true
				break
			}
		}
		if found {
			sum = sum + calcalibrationLine.expectedResult
		}
	}

	fmt.Println(sum)
}
