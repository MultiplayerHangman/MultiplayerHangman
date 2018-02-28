const screenWidth = 1080;
const screenHeight = 700;
let player, titleScreen, loadingScreen, gameScreen;
let socket = io.connect('http://' + document.domain + ':' + location.port);


function setup() {
  const canvas = createCanvas(screenWidth,screenHeight);

  // Put the canvas inside the #sketch-holder div
  canvas.parent('sketch-holder');

  titleScreen = true;
  loadingScreen = false;
  gameScreen = false;

  // Creates a new instance of playerInfo() to store user data
  player = new playerInfo();
}


// Overall Control Flow /////////////////////////////////////////////////////////////


function draw() {
  // Repeatedly updates the screen
  clear();

  if (titleScreen) {
    drawTitleScreen();
  } else if (loadingScreen) {
    player.userType = "guesser";
    drawLoadingScreen();
  }
}


// User Player Info /////////////////////////////////////////////////////////////////


function playerInfo() {
  this.playerName = "";
  this.userConfirmed = false; // whether the user has confirmed their user type
  this.userType = "";

  this.resetPlayer = function() {
    this.userConfirmed = false;
    this.userType = "";
  };

  this.becomeChooser = function() {
    this.playerName = this.playerName.trim();
    this.userConfirmed = true;
    this.userType = "chooser";
    // alert("became chooser"); // for testing
  };

  this.becomeGuesser = function() {
    this.playerName = this.playerName.trim();
    this.userConfirmed = true;
    this.userType = "guesser";
    // alert("became guesser"); // for testing
  };
};


// Program Screen Definitions /////////////////////////////////////////////////////////


function drawTitleScreen() {

  textAlign(CENTER);
  stroke(255);
  fill(255);

  // Title of titlescreen
  textSize(18);
  text("MULTIPLAYER", screenWidth/2, screenHeight/4 - 20);
  textSize(80);
  text("HANGMAN", screenWidth/2, screenHeight/3);

  // Name of player in name bar
  textSize(30);
  text(player.playerName, screenWidth/2, screenHeight/3 + 100);

  
  if (player.userConfirmed) {
    push(); // Seperate style for loading text

      textSize(16);
      textStyle(ITALIC);
      strokeWeight(0.5);

      // Loading text when player has confirmed
      if (player.userType == "guesser") {
        text("Waiting for a chooser...", screenWidth/2, 2*screenHeight/3 + 40);
      } else if (player.userType == "chooser") {
        text("Waiting for a guesser...", screenWidth/2, 2*screenHeight/3 + 40);
      }

    pop(); // Removes temporary style

    fill(255, 40);
  } else {
    noFill();
  }

  // Frame of name bar
  rectMode(RADIUS);
  rect(screenWidth/2, screenHeight/3 + 89, 160, 25);

  if (player.playerName.trim().length == 0) {
    stroke(210);
    fill(210);

    // Filler text in empty name bar
    text("Your Nickname", screenWidth/2, screenHeight/3 + 100);
  }
}


function drawLoadingScreen() {
  textAlign(CENTER);
  stroke(255);
  fill(255);
  if (player.userType == "guesser") {
    textSize(20);
    text("Game in Session", screenWidth/2, 50);

    textStyle(ITALIC);
    textSize(32);
    text("Loading word and setting up gallows...", screenWidth/2, screenHeight/2);
    textStyle(NORMAL);

  } else if (player.userType == "chooser") {

  }
}


// Keyboard Input ///////////////////////////////////////////////////////////////////


function keyPressed() {
  if (!player.userConfirmed) {
    player.playerName = textModify(player.playerName, 20);
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


// Jquery Events ////////////////////////////////////////////////////////////////////


$('#reset').click(function() {
  socket.emit('Reset');
  player.resetPlayer();
  $("#become-guesser").css("background-color", "transparent");
  $("#become-chooser").css("background-color", "transparent");
  $("#become-guesser").prop("disabled", false);
  $("#become-chooser").prop("disabled", false);
});


$('#become-chooser').click(function() {
  socket.emit('Become Chooser');
  if (player.playerName.trim().length > 0) {
    player.becomeChooser();
    $(this).css("background-color", "rgb(100,100,100)");
    $(this).prop("disabled", true);
    $("#become-guesser").prop("disabled", true);
  }
});


$('#become-guesser').click(function() {
  socket.emit('Become Guesser');
  if (player.playerName.trim().length > 0) {
    player.becomeGuesser();
    $(this).css("background-color", "rgb(100,100,100)");
    $(this).prop("disabled", true);
    $("#become-chooser").prop("disabled", true);
  }
});


socket.on('connect', function() {
  socket.emit('connection', {data: 'I\'m connected!'});
});
