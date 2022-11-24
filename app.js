const rows = 10;
const cols = 10;

var openSet = [];
var closedSet = [];
var path = [];
var array = new Array(10);

class Node {
    constructor(x,y,g = 0, h = 0, f = 0){
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.f = f;
        this.parent = undefined;
        this.neighbors = [];
    }

    updateNeighbors(grid){
        let i = this.x;
        let j = this.y;
        if (i < cols - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    }
}

for(let i = 0; i < cols; i++){
    array[i] = new Array(10);
    for(var j=0;j<rows;j++){
        array[i][j] = new Node(i,j);
    }
}

for(let i=0;i<cols;i++){
    for(let j=0;j<rows;j++){
        array[i][j].updateNeighbors(array);
    }
}

var start = array[0][0];
var end = array[9][9];

var result;

array[start.x][start.y] = 1;
array[end.x][end.y] = 3;

openSet.push(start);

while(openSet.length > 0){
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndex].f) {
            lowestIndex = i;
        }
    }

    let current = openSet[lowestIndex];
    if(current === end){
        let temp = current;
        path.push(temp);
        while(temp.parent){
            path.push(temp.parent);
            temp = temp.parent;
        }
        console.log("Done!");
        result = path.reverse();
        break;
    }

    openSet.splice(lowestIndex,1);

    closedSet.push(current);

    let neighbors = current.neighbors;
    for(let i = 0;i < neighbors.length; i++){
        let neighbor = neighbors[i];

        if(!closedSet.includes(neighbor)){
            let possibleG = current.g + 1;

            if(!openSet.includes(neighbor)){
                openSet.push(neighbor)
            }else if(possibleG >= neighbor.g){
                continue;
            }

            neighbor.g = possibleG;
            neighbor.h = heuristic(neighbor,end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = current;
        }
    }
}

function heuristic(pos,pos1){
    let d1 = Math.abs(pos.x - pos1.x);
    let d2 = Math.abs(pos.y - pos1.y);
    return d1 + d2;
}

//console.log(result)