# Advent Of Code 2024

These are my solutions to the [Advent of Code 2024](https://adventofcode.com/2024) puzzles.

## Disclaimer

Don't (really don't!) use this code as inspiration for a real project. This code is just cobbled
up to solve the puzzle. 

My coding standards for this repository are very very low, basically:
1. Does it run? 
2. See point 1 

Any damage to either machine, mental health (due to seeing the code) or hurted elfes are your responsibility

## Running the examples

### VS Code
There is a `launch.json` in this repository. For any puzzle (except C++ variants) you should be able to run the puzzle in debug mode by the following steps:

* Open the relevant puzzle file
* Go to the debug tab (For me this `Ctrl` - `Shift` - `D`)
* Select `Debug NodeJS` for NodeJS and `Debug Go` for Go, etc...
* Start debugging (For me this is `F5`)
* See the output in the Debug Console (For my I can select this with `Ctrl` - `Shift` - `Y`)

### NodeJS / Javascript
If not otherwise specified the solutions are written in Javascript. I have included an `.npmrc` which you can use with [Node Version Manager](https://github.com/nvm-sh/nvm) so you can run it with the version I used but saying that, most likely any fairly recent version of Node will do.

#### Steps
* Put the input for the puzzle in a file called `input.txt` in the folder of the puzzle (And make sure you use Linux line endings!)
* Run the puzzle with `node <script>` for example `node day1/day1a.js` (`a` is the first puzzle, `b` is the second puzzle)


### Go

My experience with Go was zero before starting this AoC and I am using the puzzles as a way to get familiar with it, saying that, here are the steps

#### Steps
* Put the input for the puzzle in a file called `input.txt` in the folder of the relevant day (And make sure you use Linux line endings!)
* Change directory to the relevant puzzle (for example `cwd day7_go/puzzle2` to go to puzzle 2 of day 7)
* Run the puzzle with `go run .`


### C++

Ow no.. C++, yes, C++, ... my experience with this is some very *bleep* Arduino code, so here we are. I have build and tested this under Linux with GCC
and this compiled without issues, on other systems you are on your own :)

#### Steps
* Put the input for the puzzle in a file called `input.txt` in the folder of the relevant day (And make sure you use Linux line endings!)
* Change directory to the relevant day (for example `cwd day9_cpp` to go to day 9)
* Run `make`
* Run one of the generated puzzle day executables

