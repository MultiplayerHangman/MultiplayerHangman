define(['require', 'jquery', 'socketio', 'p5', 'app/gameinfo', 'app/playerinfo'], function (require, $, io, p5, GameInfo, PlayerInfo) {
  const screenWidth = 1080;
  const screenHeight = 700;
  const maxLife = 7;
  let player = new PlayerInfo();
  let game = new GameInfo(maxLife);
  let socket = io.connect('http://' + document.domain + ':' + location.port);

  const screens = { title: 1, loading: 2, game: 3, results: 4 };
  let screenToDisplay = screens.title;

  const becomeChooserButton = $('#become-chooser');
  const becomeGuesserButton = $('#become-guesser');
  const resetButton = $('#reset');
  const submitButton = $('#submit');

  // We need to load P5 - the global functions are scoped within "sketch"
  const loadedP5 = new p5(function (sketch) {
    sketch.setup = () => {
      const canvas = sketch.createCanvas(screenWidth,screenHeight);

      // Put the canvas inside the #sketch-holder div
      canvas.parent('sketch-holder');

      becomeChooserButton.show();
      becomeGuesserButton.show();
      resetButton.show();
      submitButton.hide();

      screenToDisplay = screens.title;
    };

    // Overall Control Flow /////////////////////////////////////////////////////////////

    sketch.draw = () => {
      // Repeatedly updates the screen
      sketch.clear();

      sketch.posReference();

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
    };

    // Development tool used for tracking position
    sketch.posReference = () => {
      sketch.push();
      sketch.stroke(255,80);
      sketch.fill(255,180);
      sketch.strokeWeight(1);
      sketch.textSize(12);
      sketch.line(sketch.mouseX,0,sketch.mouseX,screenHeight);
      sketch.line(0,sketch.mouseY,screenWidth,sketch.mouseY);
      sketch.text(sketch.mouseX + "; " + sketch.mouseY,50,screenHeight-30);
      sketch.pop();
    };

    // Program Screen Definitions /////////////////////////////////////////////////////////


    function drawTitleScreen() {

      sketch.textAlign(sketch.CENTER);
      sketch.stroke(255);
      sketch.fill(255);

      // Title of titlescreen
      sketch.textSize(18);
      sketch.text("MULTIPLAYER: ", screenWidth/2, screenHeight/4 - 20);
      sketch.textSize(80);
      sketch.text("HANGMAN", screenWidth/2, screenHeight/3);

      // Name of player in name bar
      sketch.textSize(30);
      sketch.text(player.playerName, screenWidth/2, screenHeight/3 + 100);


      if (player.userConfirmed) {
        sketch.push(); // Seperate style for loading text

        sketch.textSize(16);
        sketch.textStyle(sketch.ITALIC);
        sketch.strokeWeight(0.5);

        // Loading text when player has confirmed
        if (player.userType == "guesser") {
          sketch.text("Waiting for a chooser...", screenWidth/2, 2*screenHeight/3 + 40);
        } else if (player.userType == "chooser") {
          sketch.text("Waiting for a guesser...", screenWidth/2, 2*screenHeight/3 + 40);
        }

        sketch.pop(); // Removes temporary style

        sketch.fill(255, 40);
      } else {
        sketch.noFill();
      }

      // Frame of name bar
      sketch.rectMode(sketch.RADIUS);
      sketch.rect(screenWidth/2, screenHeight/3 + 89, 160, 25);

      if (player.playerName.length == 0) {
        sketch.stroke(210);
        sketch.fill(210);

        // Filler text in empty name bar
        sketch.text("Your Nickname", screenWidth/2, screenHeight/3 + 100);
      }
    }


    function drawLoadingScreen() {

      sketch.textAlign(sketch.CENTER);
      sketch.stroke(255);
      sketch.fill(255);

      sketch.textSize(20);
      sketch.text("Game in Session", screenWidth/2, 50);

      if (player.userType == "guesser" || player.userType == "spectator") {

        sketch.push();
        sketch.textStyle(sketch.ITALIC);
        sketch.textSize(32);
        sketch.text("Waiting for Chooser...",screenWidth/2,screenHeight/2);
        sketch.pop();

      } else if (player.userType == "chooser") {

        sketch.push();
        sketch.textSize(32);
        sketch.text("Provide a phrase to guess:",screenWidth/2,screenHeight/2-80);

        sketch.textSize(16);
        sketch.text("Maximum length of 30 characters (including spaces)",screenWidth/2,screenHeight/2+80);
        sketch.text("LETTERS ONLY",screenWidth/2,screenHeight/2+105);

        sketch.textSize(40);
        sketch.text(player.secretPhrase,screenWidth/2,screenHeight/2+12);

        if (player.secretPhrase.length == 0) {

          sketch.push();
          sketch.stroke(210);
          sketch.fill(210);
          sketch.text("Enter your phrase here",screenWidth/2,screenHeight/2+12);
          sketch.pop();

        }

        sketch.rectMode(sketch.CENTER);
        sketch.fill(80,120);
        sketch.rect(screenWidth/2,screenHeight/2,700,80);
        sketch.pop();

      }
    }


    function drawGameScreen() {

      let adjustedSW = screenWidth - 20;

      sketch.push();

      sketch.stroke(255,180);
      sketch.fill(255,180);
      sketch.strokeWeight(6);
      sketch.line(5,70,adjustedSW,70);
      sketch.line(20,screenHeight - 90,adjustedSW,screenHeight - 90);

      sketch.stroke(255);
      sketch.fill(255);
      sketch.strokeWeight(5);
      sketch.line(100,510,400,510);
      sketch.line(160,510,160,160);
      sketch.line(160,160,300,160);
      sketch.line(300,160,300,198);

      drawHangman(maxLife - game.lifeCount);

      drawPhraseLetters();

      sketch.rectMode(sketch.CORNERS);
      sketch.noFill();
      sketch.strokeWeight(1);
      sketch.rect(30,625,770,682);

      sketch.textAlign(sketch.CENTER);
      sketch.textSize(20);
      sketch.fill(255);
      sketch.strokeWeight(1);
      if (player.userType == "guesser") {
        sketch.textSize(28);
      }
      sketch.text("Guesser: " + game.guesser,150,35);
      sketch.textSize(20);
      if (player.userType == "chooser") {
        sketch.textSize(28);
      }
      sketch.text("Chooser: " + game.chooser,adjustedSW - 150,35);
      sketch.textSize(20);
      sketch.strokeWeight(1);
      sketch.text("Round: " + game.round + " / 5",adjustedSW/2, 35);
      sketch.text(player.letterChosen,400,660);
      sketch.text("Spectators: ",90,590);

      if (player.letterChosen.length == 0) {
        sketch.fill(210);
        sketch.stroke(210);
        sketch.text("Enter letter to guess",400,660);
      }

      sketch.pop();
    }


    function drawHangman(hits) {
      let hangmanCenterX = 300;
      let standDeviation = 0;

      sketch.push();
      sketch.textAlign(sketch.CENTER);

      if (hits == maxLife) {
        sketch.strokeWeight(0.7);
      } else {
        sketch.strokeWeight(1.6);
      }

      // Face of hangman
      if (hits >= 1) {
        sketch.noFill();
        // Head
        sketch.ellipse(hangmanCenterX,230,45,60);
        if (hits < maxLife) {
          // Normal eye holes
          sketch.ellipse(hangmanCenterX - 8,222,12,12);
          sketch.ellipse(hangmanCenterX + 8,222,12,12);
        }
        // Frown
        sketch.arc(hangmanCenterX,250,20,20, sketch.PI + sketch.QUARTER_PI,- sketch.QUARTER_PI);
        sketch.fill(255);
        if (hits < maxLife) {
          // Normal eye pupils
          sketch.ellipse(hangmanCenterX - 8,222,2,2);
          sketch.ellipse(hangmanCenterX + 8,222,2,2);
        }
      }
      // Neck of hangman
      if (hits >= 2) sketch.line(hangmanCenterX,260,hangmanCenterX,270);
      // "Left" arm of hangman (relative to user)
      // "Right" arm of hangman (relative to user)
      if (hits >= 3) {
        if (hits < maxLife) {
          sketch.line(hangmanCenterX,270,hangmanCenterX-30,325);
          sketch.line(hangmanCenterX,270,hangmanCenterX+30,325);
        } else {
          sketch.line(hangmanCenterX,270,hangmanCenterX-15.5,330.7);
          sketch.line(hangmanCenterX,270,hangmanCenterX+15.5,330.7);
        }

      }
      // Torso of hangman
      if (hits >= 4) sketch.line(hangmanCenterX,270,hangmanCenterX,330);
      // "Left" and "Right" leg of hangman (relative to user)
      if (hits >= 5) {
        sketch.line(hangmanCenterX,330,hangmanCenterX-15,420);
        sketch.line(hangmanCenterX,330,hangmanCenterX+15,420);
      }
      // Stand for hangman to be supported before death
      if (hits < maxLife) {
        if (hits == maxLife - 1) {
          standDeviation = 52;
        } else {
          standDeviation = 0;
        }
        sketch.line(hangmanCenterX-55+standDeviation,420,hangmanCenterX+55+standDeviation,420);
        sketch.line(hangmanCenterX-55+standDeviation,460,hangmanCenterX+55+standDeviation,460);
        sketch.line(hangmanCenterX-25+standDeviation,420,hangmanCenterX-40+standDeviation,510);
        sketch.line(hangmanCenterX+25+standDeviation,420,hangmanCenterX+40+standDeviation,510);
      }
      // "x"'s to replace eyes when death occurs
      if (hits == maxLife) {
        sketch.textSize(20);
        sketch.text("x",hangmanCenterX - 8,226);
        sketch.text("x",hangmanCenterX + 8,226);
      }
      sketch.pop();
    }


    function drawPhraseLetters() {
      sketch.push();
      sketch.textAlign(sketch.CENTER);
      sketch.textSize(30);
      sketch.stroke(255);
      sketch.fill(255);
      sketch.strokeWeight(1);
      sketch.text(game.phrase,680,280);
      sketch.textSize(18);
      sketch.text("Used:" + game.lettersListString,680,450);
      sketch.pop();
    }


    function drawResultsScreen() {
      sketch.push();
      sketch.stroke(255);
      sketch.fill(255);
      sketch.textSize(38);
      sketch.textStyle(sketch.ITALIC);
      sketch.text("Results",screenWidth/2,screenHeight/3);

      sketch.textSize(25);
      sketch.textStyle(sketch.NORMAL);
      sketch.text("Guesser: " + game.guesser,screenWidth/3,screenHeight/2);
      sketch.text("Chooser: " + game.chooser,(2*screenWidth)/3,screenHeight/2);

      sketch.textSize(18);
      sketch.text(game.playerOnePoints,screenWidth/3,screenHeight/2);
      sketch.text(game.playerTwoPoints,(2*screenWidth)/3,screenHeight/2);
      sketch.pop();
    }



    // Keyboard Input ///////////////////////////////////////////////////////////////////


    keyPressed = () => {
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
    };


    // General purpose text input function used exclusively in keyPressed()
    function textModify(text, maxStringLength) {
      if (sketch.keyCode == sketch.BACKSPACE && text.length > 0) {
        text = text.substring(0, text.length - 1);
      } else if (sketch.keyCode != sketch.BACKSPACE && text.length < maxStringLength) {
        if (sketch.keyIsDown(sketch.SHIFT)) {
          text += sketch.key;
        } else {
          text += sketch.key.toLowerCase();
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
  });

});
