class Agent {
	constructor(x, y, angle){
		this.x = x;
		this.y = y;
		this.moveX = Math.sin(angle);
		this.moveY = Math.cos(angle);
		this.status = "uninfected";
		this.iDays = 0;
	}
	move(maxX, maxY){
		if (this.x + this.moveX < 0)
			this.moveX = - this.moveX;
		if (this.y + this.moveY < 0)
			this.moveY = - this.moveY;
		if (this.x + this.moveX > maxX)
			this.moveX = - this.moveX;
		if (this.y + this.moveY > maxY)
			this.moveY = - this.moveY;
		this.x = this.x + this.moveX;
		this.y = this.y + this.moveY;
	}
	infect(){
		this.status = "infected";
		this.iDays = 100;
	}
	tick(){
		if (this.status == "infected"){
			this.iDays = this.iDays - 1;
			if (this.iDays < 0)
				this.status = "immune";			
		}
	}
}

var canvasSize = 400;
var agents = [];
var status = "stop";
var infectionChance = 0.20;
var numAgents = 200;
var gHistory = [];

function setup() {
	createCanvas(canvasSize+1000, canvasSize);
	setupGraph();
	resetSim();
}

function setupGraph(){
	stroke(0);
	strokeWeight(2);
	line (canvasSize + 100, 0, canvasSize + 100, canvasSize);
	strokeWeight(3);
	line (canvasSize + 100, canvasSize, 3 * canvasSize + 100, canvasSize);
	strokeWeight(1);
	for(var i = 1; i < gHistory.length; i++) {
		stroke(255, 0, 0);
		line(canvasSize + 100+i-1, canvasSize-gHistory[i-1][0]*(canvasSize/numAgents), canvasSize + 100+i, canvasSize-gHistory[i][0]*(canvasSize/numAgents));
		stroke(0, 255, 0);
		line(canvasSize + 100+i-1, canvasSize-gHistory[i-1][1]*(canvasSize/numAgents), canvasSize + 100+i, canvasSize-gHistory[i][1]*(canvasSize/numAgents));
		stroke(0, 0, 128);
		line(canvasSize + 100+i-1, canvasSize-gHistory[i-1][2]*(canvasSize/numAgents), canvasSize + 100+i, canvasSize-gHistory[i][2]*(canvasSize/numAgents));
	}
}

function resetSim(){
	agents = [];
	gHistory = [];
	for(var i = 0; i < numAgents; i++) {
	    agents.push(new Agent(random(canvasSize), random(canvasSize), random(PI)));
	}
	agents[0].infect();
	agents[1].infect();
	agents[2].infect();
	agents[3].infect();
	agents[0].iDays = random(100);
	agents[1].iDays = random(100);
	
}
function draw() {
	background(255);
	setupGraph();
	agents.forEach(drawAgent);
	if (status == "start"){
		infect(agents);
	}
  // if (mouseIsPressed) {
  //   fill(0);
  // } else {
  //   fill(255);
  // }
  //ellipse(mouseX, mouseY, 80, 80);
}

function infect(agents) {
	agents.forEach(function(a){a.move(canvasSize,canvasSize)});
	var threshold = 20;
	for(var i = 0; i < agents.length; i++) {
		if (agents[i].status == "infected" && agents[i].iDays < 70){
			for(var j = 0; j < agents.length; j++) {
				if (agents[j].status == "uninfected" && idist(agents[i],agents[j]) < threshold)
					agents[j].infect();
			}			
		}
		agents[i].tick();
	}
	var nInf = 0;
	var nUinf = 0;
	var nImm = 0;
	for(var i = 0; i < agents.length; i++) {
		if (agents[i].status == "infected")
			nInf = nInf + 1;
		if (agents[i].status == "uninfected")
			nUinf = nUinf + 1;
		if (agents[i].status == "immune")
			nImm = nImm + 1;
	}
	gHistory.push([nInf, nUinf, nImm]);
}

function idist(i, j){
	var distance = Math.abs(i.x - j.x) + Math.abs(i.y - j.y);
	if (distance < 100)
		distance = distance;
	return distance;
}
function drawAgent(a){
	var dotSize = 4;
	var arrowSize = 6;
	strokeWeight(1);
	if (a.status == "uninfected")
		stroke(0, 255, 0);
	else if (a.status == "infected")
		stroke(255, 0, 0);
	else
		stroke(0, 0, 128)
	ellipse(a.x, a.y, dotSize, dotSize);
	line(a.x, a.y, a.x+a.moveX*arrowSize, a.y+a.moveY*arrowSize);
}

function startSketch(){
	status = "start";
}

function stopSketch(){
	status = "stop";
}

function resetSketch(){
	resetSim();
}

function runSketch(){
	resetSim();
	for(var i = 0; i < 1200; i++) {
		infect(agents);
	}	
}