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

const clusters = {};
Object.keys(edges).forEach((vertice) => {
    const verticeEdges = edges[vertice];
    verticeEdges.forEach((connectingVertice) => {
        const connectingVerticeVertices = edges[connectingVertice];
        const interSection = connectingVerticeVertices.filter(value => verticeEdges.includes(value));
        interSection.forEach((intersectedVertice) => {
            if (vertice[0] === "t" || connectingVertice[0] === "t" || intersectedVertice[0] === "t") {
                clusters[[ vertice, connectingVertice, intersectedVertice ].sort().join(',')] = true;
            }            
        });
    })
});

console.log(Object.keys(clusters).length);
