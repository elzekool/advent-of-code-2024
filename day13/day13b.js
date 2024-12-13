const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n')

const extractRegex = /^[A-Za-z ]+: X(\+|=)([0-9]+), Y(\+|=)([0-9]+)$/

const machines = [];

input.forEach((block) => {
    const lines = block.split('\n').map(m => extractRegex.exec(m));
    machines.push({
        a: [ Number.parseInt(lines[0][2], 10),  Number.parseInt(lines[0][4], 10) ],
        b: [ Number.parseInt(lines[1][2], 10),  Number.parseInt(lines[1][4], 10) ],
        pos: [ Number.parseInt(lines[2][2], 10) + 10000000000000,  Number.parseInt(lines[2][4], 10) + 10000000000000 ],
    })
});

const findMinTokens = (a, b, target) => {
    // Solve using the elimination method
    //
    // Problem:
    // Button A: X+94, Y+34
    // Button B: X+22, Y+67
    // Prize: X=8400, Y=5400
    //
    // Can be stated as:
    // 94a + 22b = 8400
    // 34a + 67b = 5400
    // 
    // If we multiply the first a with the second and visa-versa we eliminate it
    // (eg they become both 34*94a = 3196a) and then we only have one variable (b)
    // we can solve and after that calculate what b should be.
    // 
    // Step 1:
    // (34 * 94)a + (34 * 22)b = (34 * 8400)    =>    3196a +  748b = 285600
    // (94 * 34)a + (94 * 67)b = (94 * 5400)    =>    3196a + 6298b = 507600
    //
    // You can now see that a has the same multiplication factor (coeficient). This means that
    // it is not a factor anymore in the equation. So now we focus on b.
    //
    // We can subtract the formula's to make them one:
    //
    //    748b  =  285600
    //   6298b  =  507600
    // --------------------
    //  -5550b  = -222000
    //
    // We can now calculate the value for b:
    // b = -220000 / -5550 => 40
    //
    // We remove a from the formula, but we can also calculate this. For this we can pick
    // the first formula again
    // 
    // (34 * 94)a + (34 * 22)b = (34 * 8400)    =>   3196a + 29920 = 285600
    //
    // If we move 251920 to the right we get:
    // 3196a = 285600 - 29920    =>    3196a = 255680
    //
    // We can now calculate the value for a
    // a = 255680 / 3196 => 80
    //
    // https://www.mathplanet.com/education/algebra-1/systems-of-linear-equations-and-inequalities/the-elimination-method-for-solving-linear-systems
    //
    const aXMultiplied = a[0] * a[1];
    const bXMultiplied = b[0] * a[1];
    const goalXmultiplied = target[0] * a[1];

    const bYmultiplied = b[1] * a[0];
    const goalYmultiplied = target[1] * a[0];

    // Solve
    const bSolved = (goalXmultiplied - goalYmultiplied) / (bXMultiplied - bYmultiplied);
    const aSolved = (goalXmultiplied - (bXMultiplied * bSolved)) / aXMultiplied;

    // We only allow integer (whole) tokens
    if (Number.isInteger(aSolved) && Number.isInteger(bSolved)) {
        return aSolved * 3 + bSolved;
    }

    return -1;
}

let sum = 0;
machines.forEach((machine) => {
    const minTokens = findMinTokens(machine.a, machine.b, machine.pos);
    if (minTokens !== -1) {
        sum += minTokens;
    }
});

console.log(sum);