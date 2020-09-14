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

var grapharea = function (p) {

	p.setup = function() {
		p.createCanvas(1000, canvasSize);
		p.setupGraph();
	}

	p.draw = function() {
		p.setupGraph();
	}	
	
	p.setupGraph = function() {
		p.stroke(0);
		p.strokeWeight(2);
		p.line (0, 0, 0, canvasSize);
		p.strokeWeight(3);
		p.line (0, canvasSize, 1200, canvasSize);
		p.strokeWeight(1);
		for(var i = 1; i < gHistory.length; i++) {
			p.stroke(255, 0, 0);
			p.line(0+i-1, canvasSize-gHistory[i-1][0]*(canvasSize/numAgents), 0+i, canvasSize-gHistory[i][0]*(canvasSize/numAgents));
			p.stroke(0, 255, 0);
			p.line(0+i-1, canvasSize-gHistory[i-1][1]*(canvasSize/numAgents), 0+i, canvasSize-gHistory[i][1]*(canvasSize/numAgents));
			p.stroke(0, 0, 128);
			p.line(0+i-1, canvasSize-gHistory[i-1][2]*(canvasSize/numAgents), 0+i, canvasSize-gHistory[i][2]*(canvasSize/numAgents));
		}
	}
}
var playarea = function (p) {	
	p.setup = function() {
		p.createCanvas(canvasSize, canvasSize);
		p.resetSim();
	}

	p.resetSim = function(){
		agents = [];
		gHistory = [];
		for(var i = 0; i < numAgents; i++) {
			agents.push(new Agent(p.random(canvasSize), p.random(canvasSize), p.random(p.PI)));
		}
		agents[0].infect();
		agents[1].infect();
		agents[2].infect();
		agents[3].infect();
		agents[0].iDays = p.random(100);
		agents[1].iDays = p.random(100);
	
	}
	p.draw = function() {
		p.background(255);
		//setupGraph();
		agents.forEach(drawAgent);
		if (status == "start"){
			p.infect(agents);
		}
	}

	p.infect = function(agents) {
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
		return distance;
	}
	function drawAgent(a){
		var dotSize = 4;
		var arrowSize = 6;
		p.strokeWeight(1);
		if (a.status == "uninfected")
			p.stroke(0, 255, 0);
		else if (a.status == "infected")
			p.stroke(255, 0, 0);
		else
			p.stroke(0, 0, 128)
			p.ellipse(a.x, a.y, dotSize, dotSize);
		p.line(a.x, a.y, a.x+a.moveX*arrowSize, a.y+a.moveY*arrowSize);
	}
}

var p5play = new p5(playarea, 'playarea');
var p5graph = new p5(grapharea, 'grapharea');

function startSketch(){
	status = "start";
}

function stopSketch(){
	status = "stop";
}

function resetSketch(){
	p5play.resetSim();
}

function runSketch(){
	p5play.resetSim();
	for(var i = 0; i < 1200; i++) {
		p5play.infect(agents);
	}	
}