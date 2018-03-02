const screenWidth = 1080;
const screenHeight = 700;
let player, titleScreen, loadingScreen, gameScreen;
let clientNumber;
let socket = io.connect('http://' + document.domain + ':' + location.port);


function setup() {
  const canvas = createCanvas(screenWidth,screenHeight);

  // Put the canvas inside the #sketch-holder div
  canvas.parent('sketch-holder');

  clientNumber = 0;

  titleScreen = false;
  loadingScreen = false;
  gameScreen = true;

  // Creates a new instance of playerInfo() to store user data
  player = new playerInfo();
}


// Overall Control Flow /////////////////////////////////////////////////////////////


function draw() {
  // Repeatedly updates the screen
  clear();

  posReference();

  /*
  if (clientNumber <= 2) {
    titleScreen = true;
  } else {
    titleScreen = false;
    loadingScreen = true;
  }
  */

  if (titleScreen) {

    drawTitleScreen();

  } else if (loadingScreen) {

    player.userType = "chooser";
    
    drawLoadingScreen();

  } else if (gameScreen) {

    drawGameScreen();

  }
}

// Development tool used for tracking position
function posReference() {
  push();
  stroke(255,80);
  fill(255,180);
  strokeWeight(1);
  textSize(12);
  line(mouseX,0,mouseX,screenHeight);
  line(0,mouseY,screenWidth,mouseY);
  text(str(mouseX) + "; " + str(mouseY),50,screenHeight-30);
  pop();
}


// User Player Info /////////////////////////////////////////////////////////////////

/*
ABOUT:
  playerName: Name of user
  userConfirmed: Whether the user has confirmed their play type
  userType: The play type the user has chosen or been assigned
  lifeCount: Number of failures on hangman round permitted/number of player lives
  secretPhrase: As the chooser, a secret phrase is chosen and stored
  letterChosen: Letter chosen by user on game screen when permitted to do so
*/


function playerInfo() {
  this.playerName = "";
  this.userConfirmed = false; // whether the user has confirmed their user type
  this.userType = "";
  this.lifeCount = 9;
  this.secretPhrase = "";
  this.letterChosen = "";

  this.resetPlayer = function() {
    this.playerName = "";
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

  document.getElementById("letter-submit").style.display = "none";

  textAlign(CENTER);
  stroke(255);
  fill(255);

  // Title of titlescreen
  textSize(18);
  text("MULTIPLAYER: " + clientNumber, screenWidth/2, screenHeight/4 - 20);
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

  if (player.playerName.length == 0) {
    stroke(210);
    fill(210);

    // Filler text in empty name bar
    text("Your Nickname", screenWidth/2, screenHeight/3 + 100);
  }
}


function drawLoadingScreen() {
  player.userConfirmed = true;

  document.getElementById("become-chooser").style.display = "none";
  document.getElementById("become-guesser").style.display = "none";
  document.getElementById("reset").style.display = "none";
  

  textAlign(CENTER);
  stroke(255);
  fill(255);

  textSize(20);
  text("Game in Session", screenWidth/2, 50);

  if (player.userType == "guesser" || player.userType == "spectator") {

    document.getElementById("letter-submit").style.display = "none";

    push();
    textStyle(ITALIC);
    textSize(32);
    text("Waiting for Chooser...",screenWidth/2,screenHeight/2);
    pop();

  } else if (player.userType == "chooser") {

    document.getElementById("letter-submit").style.display = "inline";

    push();
    textSize(32);
    text("Provide a phrase to guess:",screenWidth/2,screenHeight/2-80);

    textSize(16);
    text("Maximum length of 30 characters (including spaces)",screenWidth/2,screenHeight/2+80);
    text("LETTERS ONLY",screenWidth/2,screenHeight/2+105);

    textSize(40);
    text(player.secretPhrase,screenWidth/2,screenHeight/2+12);

    if (player.secretPhrase.length == 0) {

      push();
      stroke(210);
      fill(210);
      text("Enter your phrase here",screenWidth/2,screenHeight/2+12);
      pop();

    }

    rectMode(CENTER);
    fill(80,120);
    rect(screenWidth/2,screenHeight/2,700,80);
    pop();

  }
}


function drawGameScreen() {
  player.userConfirmed = true;
  // player.lifeCount = 0;

  document.getElementById("become-chooser").style.display = "none";
  document.getElementById("become-guesser").style.display = "none";
  document.getElementById("reset").style.display = "none";
  document.getElementById("letter-submit").style.display = "inline";

  let adjustedSW = screenWidth - 20;

  push();

  stroke(255,180);
  fill(255,180);
  strokeWeight(6);
  line(5,70,adjustedSW,70);
  line(20,screenHeight - 90,adjustedSW,screenHeight - 90);

  stroke(255);
  fill(255);
  strokeWeight(5);
  line(100,510,400,510);
  line(160,510,160,160); 
  line(160,160,300,160);
  line(300,160,300,198);

  drawHangman(9 - player.lifeCount);

  rectMode(CORNERS);
  noFill();
  strokeWeight(1);
  rect(30,625,770,682);

  textAlign(CENTER);
  textSize(20);
  fill(255);
  strokeWeight(1);
  text("Guesser: _______",150,35);
  text("Chooser: _______",adjustedSW - 150,35);
  text("Round: _____",adjustedSW/2, 35);
  text(player.letterChosen,400,660);
  text("Spectators: " + clientNumber,90,590);

  if (player.letterChosen.length == 0) {
    fill(210);
    stroke(210);
    text("Enter letter to guess",400,660);
  }

  pop();
}


function drawHangman(hits) {
  let hangmanCenterX = 300;
  let standDeviation = 0;

  push();
  textAlign(CENTER);

  if (hits == 9) {
    strokeWeight(0.7);
  } else {
    strokeWeight(1.6);
  }

  // Face of hangman
  if (hits >= 1) {
    noFill();
    // Head
    ellipse(hangmanCenterX,230,45,60);
    if (hits < 9) {
      // Normal eye holes
      ellipse(hangmanCenterX - 8,222,12,12);
      ellipse(hangmanCenterX + 8,222,12,12);
    }
    // Frown
    arc(hangmanCenterX,250,20,20,PI + QUARTER_PI,- QUARTER_PI);
    fill(255);
    if (hits < 9) {
      // Normal eye pupils
      ellipse(hangmanCenterX - 8,222,2,2);
      ellipse(hangmanCenterX + 8,222,2,2);
    }
  }
  // Neck of hangman
  if (hits >= 2) line(hangmanCenterX,260,hangmanCenterX,270);
  // "Left" arm of hangman (relative to user)
  if (hits >= 3) {
    if (hits < 9) {
      line(hangmanCenterX,270,hangmanCenterX-30,325);
    } else {
      line(hangmanCenterX,270,hangmanCenterX-15.5,330.7);
    }
    
  }
  // "Right" arm of hangman (relative to user)
  if (hits >= 4) {
    if (hits < 9) {
      line(hangmanCenterX,270,hangmanCenterX+30,325);
    } else {
      line(hangmanCenterX,270,hangmanCenterX+15.5,330.7);
    }
  }
  // Torso of hangman
  if (hits >= 5) line(hangmanCenterX,270,hangmanCenterX,330);
  // "Left" leg of hangman (relative to user)
  if (hits >= 6) line(hangmanCenterX,330,hangmanCenterX-15,420);
  // "Right" leg of hangman (relative to user)
  if (hits >= 7) line(hangmanCenterX,330,hangmanCenterX+15,420);
  // Stand for hangman to be supported before death
  if (hits < 9) {
    if (hits == 8) {
      standDeviation = 52;
    } else {
      standDeviation = 0;
    }
    line(hangmanCenterX-55+standDeviation,420,hangmanCenterX+55+standDeviation,420);
    line(hangmanCenterX-55+standDeviation,460,hangmanCenterX+55+standDeviation,460);
    line(hangmanCenterX-25+standDeviation,420,hangmanCenterX-40+standDeviation,510);
    line(hangmanCenterX+25+standDeviation,420,hangmanCenterX+40+standDeviation,510);
  }
  // "x"'s to replace eyes when death occurs
  if (hits == 9) {
    text("x",hangmanCenterX - 8,226);
    text("x",hangmanCenterX + 8,226);
  }
  pop();
}


// Keyboard Input ///////////////////////////////////////////////////////////////////


function keyPressed() {
  if (!player.userConfirmed) {

    player.playerName = textModify(player.playerName,20);
    player.playerName = player.playerName.trim();

  } else if (loadingScreen && player.userType == "chooser") {

    player.secretPhrase = textModify(player.secretPhrase,30);
    player.secretPhrase = player.secretPhrase.toLowerCase();

  } else if (gameScreen) {
    /*
    if (key == 'A') {
      player.lifeCount -= 1;
    } else if (key == 'S') {
      player.lifeCount += 1;
    }
    player.lifeCount = constrain(player.lifeCount,0,9);
    */

    player.letterChosen = textModify(player.letterChosen, 1).toUpperCase();
    player.letterChosen = player.letterChosen.trim();
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
  socket.emit('reset');
  player.resetPlayer();
  $("#become-guesser").css("background-color", "transparent");
  $("#become-chooser").css("background-color", "transparent");
  $("#become-guesser").prop("disabled", false);
  $("#become-chooser").prop("disabled", false);
});

$('#become-chooser').click(function() {
  // We can't actually become a chooser until a phrase is provided
  // socket.emit('become_chooser');
  if (player.playerName.trim().length > 0) {
    player.becomeChooser();
    $(this).css("background-color", "rgb(100,100,100)");
    $(this).prop("disabled", true);
    $("#become-guesser").prop("disabled", true);
  }
});

$('#become-guesser').click(function() {
  if (player.playerName.length > 0) {
    socket.emit('become_guesser');
    player.becomeGuesser();
    $(this).css("background-color", "rgb(100,100,100)");
    $(this).prop("disabled", true);
    $("#become-chooser").prop("disabled", true);
  }
});


// Socket events ////////////////////////////////////////////////////////////////////


socket.on('client_count', function(json) {
  clientNumber = json['count'];
});

socket.on('connect', function() {
  socket.emit('connection', {'data': 'I\'m connected!'});
  player.userType = "spectator";
});

socket.on('disconnect', function() {
  socket.emit('disconnect');
});
