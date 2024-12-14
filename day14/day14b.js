const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n')

const extractRegex = /^p=(\-?[0-9]+),(\-?[0-9]+) v=(\-?[0-9]+),(\-?[0-9]+)$/

const robots = [];
const width = 101;
const height = 103;

const debugMap = () => {
    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {    
            const robotsAtCoord = robots.filter((robot) => robot.pos[0] === x && robot.pos[1] === y).length;
            if (robotsAtCoord === 0) {
                s += '.';
            } else {
                s += robotsAtCoord;
            }
        }
        console.log(s);
    }
    console.log('')
}

const move = (robot, n) => {
    robot.pos = [
        (robot.pos[0] + (robot.dir[0] * n)) % width,
        (robot.pos[1] + (robot.dir[1] * n)) % height
    ];
    if (robot.pos[0] < 0) { 
        robot.pos[0] += width;
    }
    if (robot.pos[1] < 0) { 
        robot.pos[1] += height;
    }
};

input.forEach((line) => {
    const m = extractRegex.exec(line);
    robots.push({    
        pos: [ Number.parseInt(m[1], 10), Number.parseInt(m[2], 10) ],
        dir: [ Number.parseInt(m[3], 10), Number.parseInt(m[4], 10) ]
    })
});

let moves = 0;
while (true) {    
    moves++;
    robots.forEach((robot) => move(robot, 1));

    let exitLoop = false;

    for (let y = 0; y < height; y++) {
        let s = '';
        for (let x = 0; x < width; x++) {
            const robotsAtCoord = robots.filter((robot) => robot.pos[0] === x && robot.pos[1] === y).length;
            // Given the size of the image and number of robots they most likely do not overlap?
            if (robotsAtCoord > 1) {
                exitLoop = true;
                break;
            }
            s += robotsAtCoord.length === 0 ? '.' : '#';
        }

        if (exitLoop) {
            break;
        }
    }

    // Show for visual inspection
    if (!exitLoop) {
        console.log(moves);
        debugMap();        
    }
}


