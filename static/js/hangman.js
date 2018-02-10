var screenWidth = 1000;
var screenHeight = 600;
var playerName;
var userNamed;
var titleScreen, playScreen;

function setup() {
  createCanvas(screenWidth,screenHeight);
  // Sets text stroke colour to white
  stroke(255);
  // Sets text fill colour to white
  fill(255);
  
  titleScreen = true;
  playScreen = false;
  userNamed = false;
  playerName = "";
}

function draw() {
  // Repeatedly applies a black background to update screen
  background(0);
  // Displays player's name (just for testing)
  if (titleScreen) {
  	textSize(80);
  	textAlign(CENTER);
  	text("HANGMAN",screenWidth/2,screenHeight/4);
  	textSize(30);
  	textAlign(LEFT);
  	text("Name: " + playerName,200,300);
  }
}

function keyPressed() {
  if (!userNamed) {
  	if (keyCode==BACKSPACE && playerName.length>0) {
  		// Cuts off last letter in the player's name
  		playerName = playerName.substring(0,playerName.length-1);
  	} else if (keyCode!=ENTER && playerName.length<25) {
  		// Concatenates the typed letter to the player's name in lowercase
  		if (keyIsDown(SHIFT)) {
  			playerName += key;
  		} else {
  			playerName += key.toLowerCase();
  		}
  	} else if (keyCode==ENTER) {
  		// Stops the naming process
  		userNamed = true;
  	}
  }
}

var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
  socket.emit('connection', {data: 'I\'m connected!'});
});
