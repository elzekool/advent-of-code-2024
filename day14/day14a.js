const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n')

const extractRegex = /^p=(\-?[0-9]+),(\-?[0-9]+) v=(\-?[0-9]+),(\-?[0-9]+)$/

const robots = [];
const width = 101;
const height = 103;

const debugMap = () => {
    return;
    for (let y = 0; y < height; y++) {    
        let s = '';
        for (let x = 0; x < width; x++) {    
            const robotsAtCoord = robots.filter((robot) => robot.pos[0] === x && robot.pos[1] === y);
            if (robotsAtCoord.length === 0) {
                s += '.';
            } else {
                s += robotsAtCoord.length;
            }
        }
        console.log(s);
    }
    console.log('');
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

debugMap();
robots.forEach((robot) => move(robot, 100));

const quadrantWidth = Math.floor(width / 2);
const quadrantHeight = Math.floor(height / 2);

const quadrants = [
    [ 0, 0, quadrantWidth, quadrantHeight ],
    [ width - quadrantWidth, 0, width, quadrantHeight ],    
    [ 0, height - quadrantHeight, quadrantWidth, height ],
    [ width - quadrantWidth, height - quadrantHeight, width, height ],    
];

const sums = [];

quadrants.forEach((quadrant) => {
    let sum = 0;
    for (let y = quadrant[1]; y < quadrant[3]; y++) {    
        for (let x = quadrant[0]; x < quadrant[2]; x++) {
            const robotsAtCoord = robots.filter((robot) => robot.pos[0] === x && robot.pos[1] === y).length;
            sum += robotsAtCoord;
        }
    }
    sums.push(sum);
})

console.log(sums.reduce((acc, val) => acc * val, 1));

debugMap();