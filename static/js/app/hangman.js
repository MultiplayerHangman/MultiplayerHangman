define(['require', 'jquery', 'socketio', 'p5', 'app/game', 'app/player', 'app/titleScreen', 'app/loadingScreen', 'app/gameScreen', 'app/resultsScreen'], function (require, $, io, p5, Game, Player, TitleScreen, LoadingScreen, GameScreen, ResultsScreen) {
  const screenWidth = 1080;
  const screenHeight = 700;
  const maxLife = 7;
  const player = new Player();
  const game = new Game(maxLife);
  let socket = io.connect('http://' + document.domain + ':' + location.port);

  const screens = { title: 1, loading: 2, game: 3, results: 4 };
  let screenToDisplay = screens.title;

  const becomeChooserButton = $('#become-chooser');
  const becomeGuesserButton = $('#become-guesser');
  const resetButton = $('#reset');
  const submitButton = $('#submit');

  // We need to load P5 - the global functions are scoped within 'sketch'
  const loadedP5 = new p5(function (sketch) {
    const titleScreen = new TitleScreen(sketch, player);
    const loadingScreen = new LoadingScreen(sketch, player);
    const gameScreen = new GameScreen(sketch, player, game);
    const resultsScreen = new ResultsScreen(sketch, game);

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
        titleScreen.draw();
      } else if (screenToDisplay === screens.loading) {
        loadingScreen.draw();
      } else if (screenToDisplay === screens.game) {
        gameScreen.draw();
      } else if (screenToDisplay === screens.results) {
        resultsScreen.draw();
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
      sketch.text(sketch.mouseX + '; ' + sketch.mouseY,50,screenHeight-30);
      sketch.pop();
    };


    // Keyboard Input ///////////////////////////////////////////////////////////////////


    sketch.keyPressed = () => {
      if (!player.userConfirmed) {

        player.playerName = textModify(player.playerName,20);
        player.playerName = player.playerName.trim();

      } else if (screenToDisplay === screens.loading && player.isChooser()) {

        player.secretPhrase = textModify(player.secretPhrase,24);
        player.secretPhrase = player.secretPhrase.toUpperCase();

      } else if (screenToDisplay === screens.game && player.isGuesser()) {
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
          alert('Please enter a phrase.');
        }
      } else if (screenToDisplay === screens.game && !alreadyGuessed(player.letterChosen)) {
        if (player.letterChosen.length == 1) {
          socket.emit('guess_letter', {'letter': player.letterChosen});
          player.letterChosen = '';
        } else {
          alert('Please enter a letter.');
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
      if (task == 'disable') {
        becomeChooserButton.css('background-color', 'rgb(100,100,100)');
        becomeChooserButton.prop('disabled', true);
      } else if (task == 'enable') {
        becomeChooserButton.css('background-color', 'transparent');
        becomeChooserButton.prop('disabled', false);
      }
    }


    // Toggles from enabled to disabled
    function toggleGuesserButton(task) {
      if (task === 'disable') {
        becomeGuesserButton.css('background-color', 'rgb(100,100,100)');
        becomeGuesserButton.prop('disabled', true);
      } else if (task === 'enable') {
        becomeGuesserButton.css('background-color', 'transparent');
        becomeGuesserButton.prop('disabled', false);
      }
    }


    function toggleSubmitButton(task) {
      if (task == 'disable') {
        submitButton.css('background-color', 'rgb(100,100,100)');
        submitButton.prop('disabled', true);
      } else if (task == 'enable') {
        submitButton.css('background-color', 'transparent');
        submitButton.prop('disabled', false);
      }
    }


    // Changes the game's state for this particular client
    function setGameState(gameState) {
      if (gameState == 'titlescreen') {
        screenToDisplay = screens.title;
      } else if (gameState == 'loadingscreen') {
        screenToDisplay = screens.loading;
      } else if (gameState == 'gamescreen') {
        screenToDisplay = screens.game;
      } else if (gameState == 'resultsscreen') {
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
      if (state['gamestate'] == 'titlescreen') {
        setGameState(state['gamestate']);
        becomeChooserButton.show();
        becomeGuesserButton.show();
        resetButton.show();
        submitButton.hide();
      } else if (state['gamestate'] == 'loadingscreen') {
        setGameState(state['gamestate']);
        becomeChooserButton.hide();
        becomeGuesserButton.hide();
        resetButton.hide();
        if (player.isChooser()) {
          submitButton.show();
          toggleSubmitButton('enable');
        } else {
          submitButton.hide();
        }
      } else if (state['gamestate'] == 'gamescreen') {
        setGameState(state['gamestate']);
        becomeChooserButton.hide();
        becomeGuesserButton.hide();
        resetButton.hide();
        submitButton.show();
        if (player.isGuesser()) {
          toggleSubmitButton('enable');
        } else {
          toggleSubmitButton('disable');
        }
      }
    });


    socket.on('update_titlescreen', function(info) {
      if (info['guess_disable']) {
        toggleGuesserButton('disable');
      } else {
        toggleGuesserButton('enable');
      }
      if (info['choose_disable']) {
        toggleChooserButton('disable');
      } else {
        toggleChooserButton('enable');
      }
    });


    socket.on('update_gamescreen', function(info) {
      game.chooser = info['chooser_name'];
      game.guesser = info['guesser_name'];
      game.chooserPoints = info['chooser_score'];
      game.guesserPoints = info['guesser_score'];
      game.round = info['round'];
      if (!player.isGuesser()) {
        toggleSubmitButton('disable');
      }
    });


    // Result from pressing 'Become Chooser' button
    socket.on('chooser_feedback', function(result) {
      if (result['chooser_confirmed']) {
        toggleChooserButton('disable');
      }
    });


    // Result from pressing 'Become Guesser' button
    socket.on('guesser_feedback', function(result) {
      if (result['guesser_confirmed']) {
        toggleGuesserButton('disable');
      }
    });


    // Called when any user presses the 'Reset' button
    socket.on('external_reset', function(info) {
      if (info['type_enable'] == 'guesser') {
        toggleGuesserButton('enable');
      } else if (info['type_enable'] == 'chooser') {
        toggleChooserButton('enable');
      }
    });


    // Returns the phrase discovered so far, whether the round is completed, and letter just attempted
    socket.on('discovered_phrase', function(phrase) {
      game.phrase = phrase['discovered_phrase'];
      if (phrase['phrase_completed']) {
        setGameState('resultsscreen');
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
