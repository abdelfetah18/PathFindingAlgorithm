let fps = 60;

let cols = 20; //columns in the grid
let rows = 20; //rows in the grid

let grid = new Array(cols); //array of all the grid points

let openSet = []; //array containing unevaluated grid points
let closedSet = []; //array containing completely evaluated grid points

let start; //starting grid point
let end; // ending grid point (goal)
let path = [];
let blocking = [];

var startPos = { x:0, y:0 };
var endPos = { x:0, y:0 };
var states = ["start","end","wall"];
var stateIndex = 0;
var state = states[stateIndex];
var width = 400;
var height = 400;
var boxR = 20;
var p = 10;

var canvas = document.getElementById("mycanvas");
var context = canvas.getContext("2d");

function clearData(){
    grid = new Array(cols); //array of all the grid points

    openSet = []; //array containing unevaluated grid points
    closedSet = []; //array containing completely evaluated grid points

    start = undefined; //starting grid point
    end = undefined; // ending grid point (goal)
    path = [];
    blocking = [];

    startPos = { x:0, y:0 };
    endPos = { x:0, y:0 };
    states = ["start","end","wall"];
    stateIndex = 0;
    state = states[stateIndex];
    context.beginPath();
    context.fillStyle = "#fff";
    context.fillRect(0,0,width+p,height+p);
    drawBoard();
    document.getElementById("state").innerText = state;
    document.getElementById("state").style.color = "green"; 
}

function onClick(e) {
    const rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    switch(state){
        case "start":
            clearRect(startPos.x,startPos.y);
            drawRect(x,y,"green");
            var newX = (parseInt(((x)/boxR).toFixed())*boxR)+p;
            var newY = (parseInt(((y)/boxR).toFixed())*boxR)+p;
            startPos = { x:(x > newX ? newX-p : (newX-boxR)-p),y:(y > newY ? newY-p : (newY-boxR)-p) };
            break;
        case "end":
            clearRect(endPos.x,endPos.y);
            drawRect(x,y,"red");
            var newX = (parseInt(((x)/boxR).toFixed())*boxR)+p;
            var newY = (parseInt(((y)/boxR).toFixed())*boxR)+p;
            endPos = { x:(x > newX ? newX-p : (newX-boxR)-p),y:(y > newY ? newY-p : (newY-boxR)-p) };
            break;
        case "wall":
            drawRect(x,y,"black");
            
            var newX = (parseInt(((x)/boxR).toFixed())*boxR)+p;
            var newY = (parseInt(((y)/boxR).toFixed())*boxR)+p;
            var pp = { x:(x > newX ? (newX-p)/boxR : ((newX-boxR)-p)/boxR),y:(y > newY ? (newY-p)/boxR : ((newY-boxR)-p)/boxR) };
            blocking.push(pp);
            break;
    }
}
var is_mouse_down = false;

function onMouseDown(e){
    if(is_mouse_down){
        const rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        if(state == "wall"){
            drawRect(x,y,"black");
            var newX = (parseInt(((x)/boxR).toFixed())*boxR)+p;
            var newY = (parseInt(((y)/boxR).toFixed())*boxR)+p;
            var pp = { x:(x > newX ? (newX-p)/boxR : ((newX-boxR)-p)/boxR),y:(y > newY ? (newY-p)/boxR : ((newY-boxR)-p)/boxR) };
            blocking.push(pp);
        }
    }
 
}

canvas.onclick = onClick;
canvas.onmousedown = () => is_mouse_down = true;
canvas.onmouseup = () => is_mouse_down = false;
canvas.onmousemove = onMouseDown;

function drawBoard(){
    for (var x = 0; x <= width; x += boxR) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, height + p);
    }

    for (var x = 0; x <= height; x += boxR) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(width + p, 0.5 + x + p);
    }
    context.strokeStyle = "black";
    context.stroke();
}

function drawRect(x,y,color){
    var newX = (parseInt(((x)/boxR).toFixed())*boxR)+p;
    var newY = (parseInt(((y)/boxR).toFixed())*boxR)+p;
    var _x = x > newX ? newX : (newX-boxR);
    var _y = y > newY ? newY : (newY-boxR);
    if(_x >= 0 && _x < width && _y < height && _y >= 0){
        context.beginPath();
        context.fillStyle = color;
        context.fillRect(_x,_y,boxR,boxR);
        drawBoard();
    }
}

function clearRect(x,y){
    var newX = (parseInt(((x)/boxR).toFixed())*boxR)+p;
    var newY = (parseInt(((y)/boxR).toFixed())*boxR)+p;
    context.clearRect(newX,newY,boxR,boxR);
}

function isFilled(x,y){
    var newX = (parseInt(((x)/boxR).toFixed())*boxR)+p;
    var newY = (parseInt(((y)/boxR).toFixed())*boxR)+p;
    var data = context.getImageData(x > newX ? newX+5 : (newX-boxR)+5,y > newY ? newY+5 : (newY-boxR)+5,1,1).data;
    var r = data[0];
    var g = data[1];
    var b = data[2];
    var o = data[3];
    if(r == 0 && g == 0 && b == 0 && o == 255){
        return true;
    }else{
        return false;
    }
}

function changeState(){
    stateIndex = (stateIndex+1) % 3;
    state = states[stateIndex];
    switch (state){
        case "start":
            document.getElementById("state").innerText = state;
            document.getElementById("state").style.color = "green"; 
            break;
        case "end":
            document.getElementById("state").innerText = state;
            document.getElementById("state").style.color = "red";
            break;
        case "wall":
            document.getElementById("state").innerText = state;
            document.getElementById("state").style.color = "black";
            break;
    }
}

drawBoard();

function DrawPath(list){
    for(var i=1; i<(list.length-1); i++){
        drawRect((list[i].y+1)*boxR,(list[i].x+1)*boxR,"blue");
    }
}

//heuristic we will be using - Manhattan distance
//for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function heuristic(position0, position1) {
    let d1 = Math.abs(position1.x - position0.x);
    let d2 = Math.abs(position1.y - position0.y);
    return d1 + d2;
}

//constructor function to create all the grid points as objects containind the data for the points
function GridPoint(x, y) {
    this.x = x; //x location of the grid point
    this.y = y; //y location of the grid point
    this.f = 0; //total cost function
    this.g = 0; //cost function from start to the current grid point
    this.h = 0; //heuristic estimated cost function from current grid point to the goal
    this.neighbors = []; // neighbors of the current grid point
    this.parent = undefined; // immediate source of the current grid point

    // update neighbors array for a given grid point
    this.updateNeighbors = function (grid) {
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
    };
}

//initializing the grid
function init() {
    //making a 2D array
    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = new GridPoint(i, j);
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].updateNeighbors(grid);
        }
    }

    start = grid[(startPos.y/boxR)][(startPos.x/boxR)];
    end = grid[(endPos.y/boxR)][(endPos.x/boxR)];

    //set blocking blocks
    for(var i=0; i<blocking.length; i++){
        closedSet.push(grid[blocking[i].y][blocking[i].x]);
    }
    
    console.log("start:",start);
    console.log("end:",end);

    openSet.push(start);

}

//A star search implementation
async function search() {
    init();
    while (openSet.length > 0) {
        //assumption lowest index is the first one to begin with
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];
        if (current === end) {
            let temp = current;
            path.push(temp);
            while (temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            }
            console.log("DONE!");
            // return the traced path
            var result = path.reverse();
            setTimeout(() => {
                DrawPath(result);
            }, (50));
            return result;
        }

        //remove current from openSet
        openSet.splice(lowestIndex, 1);
        //add current to closedSet
        closedSet.push(current);

        let neighbors = current.neighbors;
        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];

            if (!closedSet.includes(neighbor)) {
                let possibleG = current.g + 1;

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (possibleG >= neighbor.g) {
                    continue;
                }

                neighbor.g = possibleG;
                neighbor.h = heuristic(neighbor, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
                if(current != start){
                    var promise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            drawRect((current.y+1)*boxR,(current.x+1)*boxR,"gray");
                            resolve("done!");
                        },1000/fps);
                    });
                    await promise;
                }
            }
        }
    }
    //no solution by default
    return [];
}
