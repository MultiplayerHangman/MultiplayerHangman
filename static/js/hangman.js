const screenWidth = 1080;
const screenHeight = 700;
let titleScreen, playScreen;
let player;
let socket = io.connect('http://' + document.domain + ':' + location.port);

function setup() {
  const canvas = createCanvas(screenWidth,screenHeight);

  // Put the canvas inside the #sketch-holder div
  canvas.parent('sketch-holder');

  titleScreen = true;
  playScreen = false;
  
  // Creates a new instance of playerInfo() to store user data
  player = new playerInfo();
}

function draw() {
  // Repeatedly updates the screen
  clear();
  // Displays player's name (just for testing)
  if (titleScreen) {
    stroke(255);
    fill(255);
  	textSize(80);
  	textAlign(CENTER);
    // Title of titlescreen
  	text("HANGMAN", screenWidth/2, screenHeight/3);
    // Name of player in name bar
    textSize(30);
    text(player.playerName, screenWidth/2, screenHeight/3 + 100);

    rectMode(RADIUS);
    if (!player.userConfirmed) {
      noFill();
    } else {
      fill(255, 40);
    }
    // Frame of name bar
    rect(screenWidth/2, screenHeight/3 + 89, 240, 25);

    if (player.playerName.length == 0) {
      stroke(210);
      fill(210);
      // Filler text in empty name bar
      text("Your Name", screenWidth/2, screenHeight/3 + 100);
    }
  }
}

// This is an object created to store the user's player info
function playerInfo() {
  this.playerName = "";
  this.userConfirmed = false;

  this.resetPlayer = function() {
    this.playerName = "";
    this.userConfirmed = false;
  };
};


function keyPressed() {
  if (!player.userConfirmed) {
  	player.playerName = textModify(player.playerName, 30);
  }
}


// General purpose text input function used exclusively in keyPressed()
function textModify(text, maxStringLength) {
  if (keyCode == BACKSPACE && text.length > 0) {
    text = text.substring(0, text.length - 1);
  } else if (keyCode != BACKSPACE && text.length < maxStringLength) {
    if (keyIsDown(SHIFT)) {
      text += key;
    } else {
      text += key.toLowerCase();
    }
  }
  return text;
}


$('#reset').click(function() {
  socket.emit('Reset');
});

$('#become-chooser').click(function() {
  socket.emit('Become Chooser');
});

$('#become-guesser').click(function() {
  socket.emit('Become Guesser');
});


socket.on('connect', function() {
  socket.emit('connection', {data: 'I\'m connected!'});
});
