const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('\n\n');

// This keeps the wires we know, this is used to sort the gates
let known = {};

// This contains the states of the wires
let wires = {};

// This list contains the gates, initially unsorted
let gates = [];

const types = {
    XOR: (a, b) => ((a === 1 || b === 1) && (a != b)) ? 1 : 0,
    OR: (a, b) => (a === 1 || b === 1) ? 1 : 0,
    AND: (a, b) => (a === 1 && b === 1) ? 1 : 0
};

// Read inputs
input[0].split('\n').forEach((line) => {
    const [ wire, value ] = line.split(': ');
    known[wire] = true;
    wires[wire] = value === "1" ? 1 : 0;
});

// Read gates
let idx = 0;
input[1].split('\n').forEach((line) => {
    let [wireInA, type, wireInB,, wireOut] = line.split(' ').map(l => l.trim());
    gates.push([ wireInA, wireInB , wireOut, type, idx++ ]);
});

// Sort gates
let gatesSorted = [];
while(gates.length > 0) {
    let next = gates.findIndex(
        ([ wireInA, wireInB ]) => known[wireInA] === true && known[wireInB] === true
    );
    known[gates[next][2]] = true;
    gatesSorted.push(gates[next]);
    gates.splice(next, 1);
}
gates = [ ...gatesSorted ];

// Bits, we are looking from the input, so we take nr of bits of x/y
// for z the number of bits is one higher (due to the carry)
const bits = Object.keys(wires).filter(wire => wire.startsWith('x')).length;

const getWireKey = (inp, bit) => `${inp}${bit > 9 ? `${bit}` : `0${bit}`}`;
const findGateByOutputWire = (wire) => gates.find(([,, wireOut]) => wireOut === wire);
const findGatesByInputWire = (wire) =>  gates.filter(([wireInA, wireInB]) => (wireInA === wire || wireInB === wire));
const findGatesByInputWireAndType = (wire, type) =>  gates.filter(([wireInA, wireInB ,, _type]) => (wireInA === wire || wireInB === wire) && type === _type);

// We can check a bit in the circuit based on 
// checking x + y = z + carry against the add thruth table
const invalid = new Set();

// Thruth table for x + y = z + carry
const thruthTable = [
    // x   y   z  carry
    [  0,  0,  0,   0   ],
    [  0,  1,  1,   0   ],
    [  1,  0,  1,   0   ],
    [  1,  1,  0,   1   ]
];

for (let bit = 0; bit < bits; bit++) {
    thruthTable.forEach(([ x, y, z, carry ]) => {
        // Set all bits to 0
        for (let j = 0; j < bits; j++) {
            wires[getWireKey('x', j)] = 0;
            wires[getWireKey('y', j)] = 0;
        }

        // Set the bits we are interested in
        wires[getWireKey('x', bit)] = x;
        wires[getWireKey('y', bit)] = y;

        // Run program
        for(let j = 0; j < gatesSorted.length; j++) {
            const [ wireInA, wireInB , wireOut, type ] = gatesSorted[j];
            wires[wireOut] = types[type](wires[wireInA], wires[wireInB]);
        }

        // Test z output
        if (wires[getWireKey('z', bit)] !== z) {
            invalid.add(bit);
        }

        // Test carry output
        if (wires[getWireKey('z', bit+1)] !== carry) {
            invalid.add(bit+1);
        }
    })
}

// List invalid bits, in our case there were 8 bits wrong
console.log(invalid);

// Additionally when looking at the schematic there are 3 basic schema's
//
// For the first bit (z00) in my case this circuit was correct and I think this is the case for everyone.
// -------------------------------
//
//           +-------+
// x00 ------|       |
//           |  XOR  |------ z00
// y00 ------|       |
//           +-------+
//
//
// The circuit for the second bit (z01) is also specific and was in my case correct and I think this is the case for everyone.
// -------------------------------
//
//           +-------+
// x00 ------|       |
//           |  AND  |-----+ 
// y00 ------|       |     |        +-------+
//           +-------+     +--xy0---|       |
//                                  |  XOR  |------ z01
//           +-------+     +--xy1---|       |
// x01 ------|       |     |        +-------+
//           |  XOR  |-----+ 
// y01 ------|       |
//           +-------+
//
//
// The circuit for other bits (until the last) follow a different structure (basically expands on the cirtuit of z01 and here are the errors I think
// (NB as this circuit connects back to the previous bit I use z02 as example and yx0/xy1 refer back to the previous circuit points)
// -------------------------------
//
//
//           +-------+
// xy0 ------|       |
//           |  AND  |-----+ 
// xy1 ------|       |     |        +-------+
//           +-------+     +--------|       |
//                                  |  OR   |----+ 
//           +-------+     +--------|       |    |       +-------+
// x01 ------|       |     |        +-------+    +-------|       |
//           |  AND  |-----+                             |  XOR  |------ z02
// y01 ------|       |                           +-------|       |
//           +-------+                           |       +--------
//                                               |
//           +-------+                           |
// x02 ------|       |                           |
//           |  XOR  |---------------------------+
// y02 ------|       |
//           +-------+
//
//
// As stated the last bit (z45) is also a different pattern as there only the carry exists
// -------------------------------
//
//           +-------+
// x44 ------|       |
//           |  AND  |-----+ 
// x44 ------|       |     |        +-------+
//           +-------+     +--------|       |
//                                  |  OR   |------- z45 
//           +-------+     +--------|       |    
// x44 ------|       |     |        +-------+    
//           |  AND  |-----+                     
// y44 ------|       |                           
//           +-------+                           
//
//

// You can use the following to find the inputs from following the output
// 
// console.log(findGateByOutputWire('hvw'));

// Go through the output bits and mark all gates as valid in that chain.
// move down until a maximum depth of two (the longest chain if looking at the schematic of z02)
const validGateIds = new Set();
const markAsValid = (wireOut, depth = 0) => {
    if (depth > 2) {
        return;
    }
    const [wireInA, wireInB,,, idx] = findGateByOutputWire(wireOut);
    validGateIds.add(idx);    
    if (!wireInA.startsWith('x') && !wireInA.startsWith('y')) {
        markAsValid(wireInA, depth + 1);
    }
    if (!wireInB.startsWith('x') && !wireInB.startsWith('y')) {
        markAsValid(wireInB, depth + 1);
    }
}

// As we are now using the output bits go through bits+1
for (let z = 0; z < bits+1; z++) {
    if (invalid.has(z)) {
        continue;
    }
    markAsValid(getWireKey('z', z), 0);
}

// Get the list of invalid gates
const possibleInvalidGates = gates.filter(([, , , , idx]) => !validGateIds.has(idx));

// We should now have possibleInvalidGates.length = 5 * invalid.length
// Conclusion, we do :)
console.log(possibleInvalidGates.length / 5);

// In the end we did not use above :D
// But it gave me the confidence that I could find a solution...
//
// so, still useful ;-)

// Next try:
//
// From the schematics above we know that
// 
// An AND gate always need to connect to an OR (except for x00/y00 -> XOR )
// An OR gate always need to connect to an XOR (except when output is z45)
// An XOR gate always needs to connect to an XOR (in this case also an AND) or the output wire that corresponds to the correct bit
//
//
// NB: This eventually find the wright answer, trick was to keep adding tests until we got to 8 wrongly
//     connected ports. 
//
//
const invalidGateIdx = new Set();
gates.forEach((possibleInvalidGate) => {
    const [wireInA, wireInB, wireOut, type, idx] = possibleInvalidGate;

    // Case AND
    if (type === 'AND') {
        // For the circuit x00 / y00 -> carry z01
        if (wireInA === 'x00' || wireInB === 'x00') {
            const gates = findGatesByInputWireAndType(wireOut, 'XOR');

            if (gates.length !== 1) {
                console.log('AND gate x00/y00 does not connect to an XOR', possibleInvalidGate);
                invalidGateIdx.add(idx);
            } else if (gates[0][2] !== 'z01') {
                console.log('AND gate x00/y00 does not connect to an XOR with output z01', possibleInvalidGate);
                invalidGateIdx.add(idx);
            }

        // All other cases
        } else {
            if (findGatesByInputWireAndType(wireOut, 'OR').length !== 1) {
                console.log('AND gate does not connect to an OR', possibleInvalidGate);
                invalidGateIdx.add(idx);                                
            }
        }

    // Case OR
    } else if (type === 'OR') {
        if (wireOut === getWireKey('z', bits)) {
            // continue, no other checks

        } else if (findGatesByInputWireAndType(wireOut, 'XOR').length !== 1) {
            console.log('OR gate does not connect to an XOR', possibleInvalidGate);
            invalidGateIdx.add(idx);

        } else if (findGatesByInputWireAndType(wireOut, 'AND').length !== 1) {
            console.log('OR gate does not connect to an AND', possibleInvalidGate);
            invalidGateIdx.add(idx);
        }

    // Case XOR
    } else if (type === 'XOR') {
        if (wireOut.startsWith('z')) {
            // continue, no other checks    
        } else if (findGatesByInputWireAndType(wireOut, 'AND').length !== 1) {
            console.log('XOR gate does not connect to an AND', possibleInvalidGate);
            invalidGateIdx.add(idx);
        } else {
            const gates = findGatesByInputWireAndType(wireOut, 'XOR');

            if (gates.length !== 1) {
                console.log('XOR gate does not connect to an XOR', possibleInvalidGate);
                invalidGateIdx.add(idx);    
            }

            // Check if we are connected to an output XOR
            // In this case we want to check if the bit aligns (e.g. x/y12 -> z12)
            if (gates[0][2].startsWith('z')) {
                const connectingGateA = findGateByOutputWire(wireInA);
                const connectingGateB = findGateByOutputWire(wireInB);
                if (
                    typeof connectingGateA !== "undefined" && 
                    connectingGateA[3] === 'XOR' && 
                    (connectingGateA[0].startsWith('x') || connectingGateA[0].startsWith('y'))
                ) {
                    if (connectingGateA[0].replace(/[xy]/, 'z') !== gates[0][2]) {
                        console.log('XOR gate has a mismatched bit to output XOR', possibleInvalidGate);
                        invalidGateIdx.add(idx);
                    }
                } else if (
                    typeof connectingGateB !== "undefined" && 
                    connectingGateB[3] === 'XOR' && 
                    (connectingGateB[0].startsWith('x') || connectingGateB[0].startsWith('y'))
                ) {
                    if (connectingGateB[0].replace(/[xy]/, 'z') !== gates[0][2]) {
                        console.log('XOR gate has a mismatched bit to output XOR', possibleInvalidGate);
                        invalidGateIdx.add(idx);
                    }                    
                }
            }
        }
    }
});


// Output what should be the wrongly connected outputs
console.log('');
console.log(invalidGateIdx.size);
console.log(gates.filter(([, , , , idx]) => invalidGateIdx.has(idx)).map(([, , wireOut, , ]) => wireOut).sort().join(','));