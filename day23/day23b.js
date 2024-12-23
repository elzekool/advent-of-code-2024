const fs = require('node:fs');
const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

const edges = {};
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

const union = (set1, set2) => new Set([...set1, ...set2])
const intersect = (set1, set2) => new Set([...set1].filter(val => set2.includes(val)))

const cliques = [];

// https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
const bors_kerbosch = (R, P, X) => {
    // if P and X are both empty then
    if (P.size === 0 && X.size === 0) {
        // report R as a maximal clique
        cliques.push([...R]);
        return;
    }

    // for each vertex v in P do
    [...P].forEach(v => {
        bors_kerbosch(
            // R ⋃ {v}
            union(R, [v]),
            // P ⋂ v
            intersect(P, edges[v]),
            // X ⋂ v
            intersect(X, edges[v])
        );

        // P := P \ {v}
        P.delete(v);

        // X := X ⋃ {v}
        X.add(v);
    });
}

// Find all cliques
bors_kerbosch(
    new Set(), 
    new Set(Object.keys(edges)),
    new Set()
);

// Now search for the maximum size
let maxLength = 0;
cliques.forEach((c) => {
    const len = c.length;
    if (len > maxLength) {
        maxLength = len;
    }
});

// And return the longest one, sorted
console.log(cliques.find(c => c.length === maxLength).sort().join(','));
