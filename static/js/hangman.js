var screenWidth = 1000;
var screenHeight = 600;
var playerName,userNamed;

function setup() {
  createCanvas(screenWidth,screenHeight);
  // Sets text stroke colour to white
  stroke(255);
  // Sets text fill colour to white
  fill(255);
  textSize(40);

  userNamed = false;
  playerName = "";
}

function draw() {
  // Repeatedly applies a black background to update screen
  background(0);
  // Displays player's name (just for testing)
  text(playerName,200,200);
}

function keyPressed() {
  if (!userNamed) {
  	if (keyCode==BACKSPACE && playerName.length>0) {
  		// Cuts off last letter in the player's name
  		playerName = playerName.substring(0,playerName.length-1);
  	} else if (keyCode!=ENTER && playerName.length<20) {
  		// Concatenates the typed letter to the player's name in lowercase
  		playerName += key.toLowerCase();
  	} else if (keyCode==ENTER) {
  		// Stops the naming process
  		userNamed = true;
  	}
  }
}