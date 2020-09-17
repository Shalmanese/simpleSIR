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

var agents = [];
var status = "stop";
var infectionChance = 0.20;
var numAgents = 200;
var gHistory = [];

class Adjustables{
	changed;
	canvasSize;
	numAgents;
	pSickAgents;
	walkSpeed;
	sneezeRadius;
	sneezeDuration;
	sneezeFrequency;
	sneezeInfectiousness;
}

var gvar = new Adjustables();
gvar.canvasSize = 400;
gvar.numAgents = 500;

var grapharea = function (p) {

	p.setup = function() {
		p.createCanvas(1200, gvar.canvasSize);
		p.setupGraph();
	}

	p.draw = function() {
		p.setupGraph();
	}
	
	p.reset = function () {
		p.clear();
		p.resizeCanvas(1200, gvar.canvasSize)
		p.setupGraph();
	}
	
	p.setupGraph = function() {
		p.stroke(0);
		p.strokeWeight(2);
		p.line (0, 0, 0, gvar.canvasSize);
		p.strokeWeight(3);
		p.line (0, gvar.canvasSize, 1200, gvar.canvasSize);
		p.strokeWeight(1);
		for(var i = 1; i < gHistory.length; i++) {
			p.stroke(255, 0, 0);
			p.line(0+i-1, gvar.canvasSize-gHistory[i-1][0]*(gvar.canvasSize/gvar.numAgents), 0+i, gvar.canvasSize-gHistory[i][0]*(gvar.canvasSize/gvar.numAgents));
			p.stroke(0, 255, 0);
			p.line(0+i-1, gvar.canvasSize-gHistory[i-1][1]*(gvar.canvasSize/gvar.numAgents), 0+i, gvar.canvasSize-gHistory[i][1]*(gvar.canvasSize/gvar.numAgents));
			p.stroke(0, 0, 128);
			p.line(0+i-1, gvar.canvasSize-gHistory[i-1][2]*(gvar.canvasSize/gvar.numAgents), 0+i, gvar.canvasSize-gHistory[i][2]*(gvar.canvasSize/gvar.numAgents));
		}
	}
}
var playarea = function (p) {	
	p.setup = function() {
		p.createCanvas(gvar.canvasSize, gvar.canvasSize);
		p.resetSim();
	}

	p.resetSim = function(){
		p.resizeCanvas(gvar.canvasSize, gvar.canvasSize)
		agents = [];
		gHistory = [];
		for(var i = 0; i < gvar.numAgents; i++) {
			agents.push(new Agent(p.random(gvar.canvasSize), p.random(gvar.canvasSize), p.random(p.PI)));
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
		agents.forEach(function(a){a.move(gvar.canvasSize,gvar.canvasSize)});
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

// Init
var p5play = new p5(playarea, 'playarea');
var p5graph = new p5(grapharea, 'grapharea');

document.addEventListener('DOMContentLoaded', (event) => {

	createSliders(30);
	scriptUpdated();
})

function createSliders(n){
	var d = document.getElementById("scriptAdjust");
	for(var i = 0; i < n; i++) {
		var s = document.createElement('input');
		s.type = "range";
		s.min = 0;
		s.className = "slider";
		s.id = "slideAdjust" + i;
		s.style.cssText = "visibility:hidden;";
		s.addEventListener("input", sliderChanged);
		d.appendChild(s);
	}

}

function sliderChanged(e){
	var lineno = parseInt(e.target.id.replace("slideAdjust", ""))
	var value = e.target.value;
	var text = document.getElementById("scriptText").value;
	var lines = text.split("\n");
	lines[lineno] = lines[lineno].replace(/<.*>/, "<" + value + ">");
	var text = lines.join("\n");
	document.getElementById("scriptText").value = text;
	scriptUpdated();
}
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

function run50Sketch(){
	for(var i = 0; i < 50; i++) {
		runSketch();
		p5graph.draw();
	}
	//alert("done");
}

function clearGraph(){
	p5play.resetSim();
	p5graph.reset();
}

function scriptUpdated(){
	var changed = false;
	var text = document.getElementById("scriptText").value;
	var lines = text.split("\n");
	for(var i = 0; i < lines.length; i++) {
		var res = new RegExp("<.*>").exec(lines[i]);
		var value = NaN;
		if (res){
			value = parseInt(res[0].substring(1, res[0].length - 1));
		}
		adjustSliders(i, value, lines[i]);
		changed = changed || bindVar(value, lines[i]);
	}
	if (changed){
		p5play.resetSim();
		p5graph.reset();
	}
}

function adjustSliders(i, value, line){
	var d = document.getElementById("slideAdjust" + i);
	if (d){
		if (isNaN(value)){
				d.style.cssText = "visibility:hidden;"
		}
		else{
			if (line.includes("%")){
				d.min = 0;
				d.max = 100;
			}
			else{
				d.min = Math.pow(10, Math.floor(Math.log10(value + 1)));			
				d.max = Math.pow(10, Math.ceil(Math.log10(value + 1)));			
			}
			d.setAttribute("value", value);
			d.style.cssText = "visibility:visible;"				
		}
	}
	
}

function bindVar(value, line){
	gvar.changed = false;
	if (line.includes("new World size")){
		if (gvar.canvasSize != value)
			gvar.changed = true;
		gvar.canvasSize = value;
	}
	if (line.includes("add People quantity")){
		if (gvar.numAgents != value)
			gvar.changed = true;
		gvar.numAgents = value;
	}
	
	return gvar.changed;
	
}