const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

let edges = {};
input.split('\n').forEach((line) => {    
    const [ from, to ] = line.split('-').map(i => i.trim());
    if (typeof edges[from] === "undefined") {
        edges[from] = [];
    }
    if (typeof edges[to] === "undefined") {
        edges[to] = [];
    }
    edges[from].push(to);
    edges[to].push(from);
});

// 
//   +---+        +---+           +---+        +---+           +---+
//   | 1 |--------| 2 |-----------| 4 |--------| 7 |-----------| 8 |
//   +---+        +---+           +---+        +---+           +---+
//     |           /|\             / |
//     |          / | \   +---+   /  |
//     |          | |  *--| 6 |--*   |
//     |          |  \    +---+      /
//     |          |   \     |       /
//     |   +---+  |    \  +---+    /
//     *---| 3 |--*     *-| 5 |---*
//         +---+          +---+
//           \--------------/
//
// edges = {};
// edges['1'] = ['2','3'];
// edges['2'] = ['1','3','4','5', '6'];
// edges['3'] = ['1','2', '5'];
// edges['4'] = ['2','5','6', '7', '8'];
// edges['5'] = ['2','3', '4','6'];
// edges['6'] = ['2','4','5'];
// edges['7'] = ['8'];
// edges['8'] = ['7'];

const cliques = new Set();
const vertices = Object.keys(edges);

const isClique = (set) => {    
    // Go through all vertices in set
    for (let x = 0; x < set.length; x++) {        
        // Then check if all other vertices in the set also have an edge to the vertice
        if (set.length !== set.filter((v) => {
            if (v === set[x]) {
                return true;
            }
            return edges[v].includes(set[x]);
        }).length) {
            // One or more do not have a connected vertice no clique
            return false;
        }
    }
    return true;
}

vertices.forEach(v => {
    // Start with a set of only the vertice
    let set = [v];

    while(true) {
        // See if we can expand        
        const nextToExpand = vertices
            // We cannot expand with vertices already in the set
            .filter((w => !set.includes(w)))
            // And if we expand it must form a clique 
            // (e.g. all vertices have edges to all vertices in the set)
            .find((w) => isClique([ ...set, w ]));

        // If we cannot expand anymore the set is as large as it can get
        if (typeof nextToExpand === "undefined") {
            break;
        }
        // Else expand set
        set.push(nextToExpand);
    }
    
    // Add set as clique to the set of cliques
    // sort to make sure we add no double
    cliques.add(set.sort().join(','));
})

// Now search for the maximum size
let maxLength = 0;
cliques.forEach((c) => {
    const len = c.length;
    if (len > maxLength) {
        maxLength = len;
    }
});

// // And return the longest one, sorted
cliques.forEach((c) => {
    if (c.length === maxLength) {
        console.log(c);
    }
});
