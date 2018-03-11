const screenWidth = 1080;
const screenHeight = 700;
const maxLife = 7;
let player, game;
let socket = io.connect('http://' + document.domain + ':' + location.port);

const screens = { title: 1, loading: 2, game: 3, results: 4 };
let screenToDisplay = screens.title;

const becomeChooserButton = $('#become-chooser');
const becomeGuesserButton = $('#become-guesser');
const resetButton = $('#reset');
const submitButton = $('#submit');

function setup() {
  const canvas = createCanvas(screenWidth,screenHeight);

  // Put the canvas inside the #sketch-holder div
  canvas.parent('sketch-holder');

  becomeChooserButton.show();
  becomeGuesserButton.show();
  resetButton.show();
  submitButton.hide();

  screenToDisplay = screens.title;
}


// Overall Control Flow /////////////////////////////////////////////////////////////


function draw() {
  // Repeatedly updates the screen
  clear();

  posReference();

  if (screenToDisplay === screens.title) {
    drawTitleScreen();
  } else if (screenToDisplay === screens.loading) {
    drawLoadingScreen();
  } else if (screenToDisplay === screens.game) {
    drawGameScreen();
  } else if (screenToDisplay === screens.results) {
    drawResultsScreen();
  } else {
    console.log('ERROR: Trying to display unknown screen: ' + screenToDisplay);
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
  secretPhrase: As the chooser, a secret phrase is chosen and stored
  letterChosen: Letter chosen by user on game screen when permitted to do so
*/


function playerInfo() {
  this.playerName = "";
  this.userConfirmed = false; // whether the user has confirmed their user type
  this.userType = "spectator";
  this.secretPhrase = "";
  this.letterChosen = "";

  this.resetPlayer = function() {
    this.playerName = "";
    this.userType = "";
  };

  this.becomeChooser = function() {
    this.playerName = this.playerName.trim();
    this.userConfirmed = true;
    this.userType = "chooser";
  };

  this.becomeGuesser = function() {
    this.playerName = this.playerName.trim();
    this.userType = "guesser";
  };
};

player = new playerInfo();

// Unique User Game Info //////////////////////////////////////////////////////////////


function gameInfo() {
  this.chooser = "";
  this.guesser = "";
  this.chooserPoints = 0;
  this.guesserPoints = 0;
  this.phrase = "";
  this.round = 0;
  this.lettersListString = "";
  this.lettersList = [];
  this.lifeCount = maxLife;

  this.makeLettersListString = function(arr) {
    this.lettersList = arr;
    this.lettersListString = "";
    for (let s = 0 ; s < this.lettersList.length ; s++) {
      this.lettersListString += " " + this.lettersList[s];
    }
  }
}

game = new gameInfo();

// Program Screen Definitions /////////////////////////////////////////////////////////


function drawTitleScreen() {

  textAlign(CENTER);
  stroke(255);
  fill(255);

  // Title of titlescreen
  textSize(18);
  text("MULTIPLAYER: ", screenWidth/2, screenHeight/4 - 20);
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

  textAlign(CENTER);
  stroke(255);
  fill(255);

  textSize(20);
  text("Game in Session", screenWidth/2, 50);

  if (player.userType == "guesser" || player.userType == "spectator") {

    push();
    textStyle(ITALIC);
    textSize(32);
    text("Waiting for Chooser...",screenWidth/2,screenHeight/2);
    pop();

  } else if (player.userType == "chooser") {

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

  drawHangman(maxLife - game.lifeCount);

  drawPhraseLetters();

  rectMode(CORNERS);
  noFill();
  strokeWeight(1);
  rect(30,625,770,682);

  textAlign(CENTER);
  textSize(20);
  fill(255);
  strokeWeight(1);
  if (player.userType == "guesser") {
    textSize(28);
  }
  text("Guesser: " + game.guesser,150,35);
  textSize(20);
  if (player.userType == "chooser") {
    textSize(28);
  }
  text("Chooser: " + game.chooser,adjustedSW - 150,35);
  textSize(20);
  strokeWeight(1);
  text("Round: " + game.round + " / 5",adjustedSW/2, 35);
  text(player.letterChosen,400,660);
  text("Spectators: ",90,590);

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

  if (hits == maxLife) {
    strokeWeight(0.7);
  } else {
    strokeWeight(1.6);
  }

  // Face of hangman
  if (hits >= 1) {
    noFill();
    // Head
    ellipse(hangmanCenterX,230,45,60);
    if (hits < maxLife) {
      // Normal eye holes
      ellipse(hangmanCenterX - 8,222,12,12);
      ellipse(hangmanCenterX + 8,222,12,12);
    }
    // Frown
    arc(hangmanCenterX,250,20,20,PI + QUARTER_PI,- QUARTER_PI);
    fill(255);
    if (hits < maxLife) {
      // Normal eye pupils
      ellipse(hangmanCenterX - 8,222,2,2);
      ellipse(hangmanCenterX + 8,222,2,2);
    }
  }
  // Neck of hangman
  if (hits >= 2) line(hangmanCenterX,260,hangmanCenterX,270);
  // "Left" arm of hangman (relative to user)
  // "Right" arm of hangman (relative to user)
  if (hits >= 3) {
    if (hits < maxLife) {
      line(hangmanCenterX,270,hangmanCenterX-30,325);
      line(hangmanCenterX,270,hangmanCenterX+30,325);
    } else {
      line(hangmanCenterX,270,hangmanCenterX-15.5,330.7);
      line(hangmanCenterX,270,hangmanCenterX+15.5,330.7);
    }

  }
  // Torso of hangman
  if (hits >= 4) line(hangmanCenterX,270,hangmanCenterX,330);
  // "Left" and "Right" leg of hangman (relative to user)
  if (hits >= 5) {
    line(hangmanCenterX,330,hangmanCenterX-15,420);
    line(hangmanCenterX,330,hangmanCenterX+15,420);
  }
  // Stand for hangman to be supported before death
  if (hits < maxLife) {
    if (hits == maxLife - 1) {
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
  if (hits == maxLife) {
    textSize(20);
    text("x",hangmanCenterX - 8,226);
    text("x",hangmanCenterX + 8,226);
  }
  pop();
}


function drawPhraseLetters() {
  push();
  textAlign(CENTER);
  textSize(30);
  stroke(255);
  fill(255);
  strokeWeight(1);
  text(game.phrase,680,280);
  textSize(18);
  text("Used:" + game.lettersListString,680,450);
  pop();
}


function drawResultsScreen() {
  push();
  stroke(255);
  fill(255);
  textSize(38);
  textStyle(ITALIC);
  text("Results",screenWidth/2,screenHeight/3);

  textSize(25);
  textStyle(NORMAL);
  text("Guesser: " + game.guesser,screenWidth/3,screenHeight/2);
  text("Chooser: " + game.chooser,(2*screenWidth)/3,screenHeight/2);

  textSize(18);
  text(game.playerOnePoints,screenWidth/3,screenHeight/2);
  text(game.playerTwoPoints,(2*screenWidth)/3,screenHeight/2);
  pop();
}



// Keyboard Input ///////////////////////////////////////////////////////////////////


function keyPressed() {
  if (!player.userConfirmed) {

    player.playerName = textModify(player.playerName,20);
    player.playerName = player.playerName.trim();

  } else if (screenToDisplay === screens.loading && player.userType == "chooser") {

    player.secretPhrase = textModify(player.secretPhrase,24);
    player.secretPhrase = player.secretPhrase.toUpperCase();

  } else if (screenToDisplay === screens.game && player.userType == "guesser") {
    /*
    if (key == 'A') {
      game.lifeCount -= 1;
    } else if (key == 'S') {
      game.lifeCount += 1;
    }
    game.lifeCount = constrain(game.lifeCount,0,9);
    */

    ///*
    player.letterChosen = textModify(player.letterChosen, 1).toUpperCase();
    player.letterChosen = player.letterChosen.trim();
    //*/
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


resetButton.click(function() {
  socket.emit('reset_titlescreen',{'reset_type':player.userType});
  player.resetPlayer();
  player.userConfirmed = false;
});


becomeChooserButton.click(function() {
  if (player.playerName.length > 0) {
    socket.emit('become_chooser',{'username':player.playerName});
    player.becomeChooser();
    player.userConfirmed = true;
  }
});


becomeGuesserButton.click(function() {
  if (player.playerName.length > 0) {
    socket.emit('become_guesser',{'username':player.playerName});
    player.becomeGuesser();
    player.userConfirmed = true;
  }
});


// Submit button either for submitting a a secret phrase or guessing a letter
submitButton.click(function() {
  if (screenToDisplay === screens.loading) {
    if (player.secretPhrase.length > 0) {
      socket.emit('submit_secret_phrase', {'secret': player.secretPhrase});
    } else {
      alert("Please enter a phrase.");
    }
  } else if (screenToDisplay === screens.game && !alreadyGuessed(player.letterChosen)) {
    if (player.letterChosen.length == 1) {
      socket.emit('guess_letter', {'letter': player.letterChosen});
      player.letterChosen = "";
    } else {
      alert("Please enter a letter.");
    }
  }
});


function alreadyGuessed(letter) {
  for (let i = 0; i < game.lettersList.length; i++){
    if (letter == game.lettersList[i]) {
      return true;
    }
  }
  return false;
}


// Socket events ////////////////////////////////////////////////////////////////////


/////////////////// Closely related Javascript functions ////////////


// Toggles from enabled to disabled
function toggleChooserButton(task) {
  if (task == "disable") {
    becomeChooserButton.css("background-color", "rgb(100,100,100)");
    becomeChooserButton.prop("disabled", true);
  } else if (task == "enable") {
    becomeChooserButton.css("background-color", "transparent");
    becomeChooserButton.prop("disabled", false);
  }
}


// Toggles from enabled to disabled
function toggleGuesserButton(task) {
  if (task === "disable") {
    becomeGuesserButton.css("background-color", "rgb(100,100,100)");
    becomeGuesserButton.prop("disabled", true);
  } else if (task === "enable") {
    becomeGuesserButton.css("background-color", "transparent");
    becomeGuesserButton.prop("disabled", false);
  }
}


function toggleSubmitButton(task) {
  if (task == "disable") {
    submitButton.css("background-color", "rgb(100,100,100)");
    submitButton.prop("disabled", true);
  } else if (task == "enable") {
    submitButton.css("background-color", "transparent");
    submitButton.prop("disabled", false);
  }
}


// Changes the game's state for this particular client
function setGameState(gameState) {
  if (gameState == "titlescreen") {
    screenToDisplay = screens.title;
  } else if (gameState == "loadingscreen") {
    screenToDisplay = screens.loading;
  } else if (gameState == "gamescreen") {
    screenToDisplay = screens.game;
  } else if (gameState == "resultsscreen") {
    screenToDisplay = screens.results;
  }
}


/////////////////////////////////////////////////////////////////////


// Called once upon entering site
socket.on('connect', function() {
  socket.emit('connection', {'data': 'I\'m connected!'});
});


// Changes the game's state for this particular client
socket.on('change_gamestate', function(state) {
  if (state['gamestate'] == "titlescreen") {
    setGameState(state['gamestate']);
    becomeChooserButton.show();
    becomeGuesserButton.show();
    resetButton.show();
    submitButton.hide();
  } else if (state['gamestate'] == "loadingscreen") {
    setGameState(state['gamestate']);
    becomeChooserButton.hide();
    becomeGuesserButton.hide();
    resetButton.hide();
    if (player.userType == "chooser") {
      submitButton.show();
      toggleSubmitButton("enable");
    } else {
      submitButton.hide();
    }
  } else if (state['gamestate'] == "gamescreen") {
    setGameState(state['gamestate']);
    becomeChooserButton.hide();
    becomeGuesserButton.hide();
    resetButton.hide();
    submitButton.show();
    if (player.userType == "guesser") {
      toggleSubmitButton("enable");
    } else {
      toggleSubmitButton("disable");
    }
  }
});


socket.on('update_titlescreen', function(info) {
  if (info['guess_disable']) {
    toggleGuesserButton("disable");
  } else {
    toggleGuesserButton("enable");
  }
  if (info['choose_disable']) {
    toggleChooserButton("disable");
  } else {
    toggleChooserButton("enable");
  }
});


socket.on('update_gamescreen', function(info) {
  game.chooser = info['chooser_name'];
  game.guesser = info['guesser_name'];
  game.chooserPoints = info['chooser_score'];
  game.guesserPoints = info['guesser_score'];
  game.round = info['round'];
  if (player.userType != "guesser") {
    toggleSubmitButton("disable");
  }
});


// Result from pressing "Become Chooser" button
socket.on('chooser_feedback', function(result) {
  if (result['chooser_confirmed']) {
    toggleChooserButton("disable");
  }
});


// Result from pressing "Become Guesser" button
socket.on('guesser_feedback', function(result) {
  if (result['guesser_confirmed']) {
    toggleGuesserButton("disable");
  }
});


// Called when any user presses the "Reset" button
socket.on('external_reset', function(info) {
  if (info['type_enable'] == "guesser") {
    toggleGuesserButton("enable");
  } else if (info['type_enable'] == "chooser") {
    toggleChooserButton("enable");
  }
});


// Returns the phrase discovered so far, whether the round is completed, and letter just attempted
socket.on('discovered_phrase', function(phrase) {
  game.phrase = phrase['discovered_phrase'];
  if (phrase['phrase_completed']) {
    setGameState("resultsscreen");
    submitButton.hide();
    setTimeout(function() { socket.emit('prepare_next_round'); }, 5000);
  }
  if (phrase['letters_used'].length > 0) {
    game.makeLettersListString(phrase['letters_used']);
  }
  game.lifeCount = maxLife - phrase['misses'];
});
