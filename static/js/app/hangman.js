define(['require', 'p5', 'app/server', 'app/game', 'app/player', 'app/titleScreen', 'app/loadingScreen', 'app/gameScreen', 'app/resultsScreen', 'app/button'], function (require, p5, Server, Game, Player, TitleScreen, LoadingScreen, GameScreen, ResultsScreen, Button) {

  'use strict';

  const screenWidth = 1080;
  const screenHeight = 700;
  const maxLife = 7;
  const player = new Player();
  const game = new Game(maxLife);
  const server = new Server();
  const socket = server.socket;

  const screens = { title: 1, loading: 2, game: 3, results: 4 };
  const gameStates = { title: 'titlescreen', loading: 'loadingscreen', game: 'gamescreen', results: 'resultsscreen' };
  let screenToDisplay = screens.title;

  const resetButton = new Button('#reset');
  const submitButton = new Button('#submit');

  // We need to load P5 - the global functions are scoped within 'sketch'
  const loadedP5 = new p5(function (sketch) {
    const titleScreen = new TitleScreen(sketch, server, player);
    const loadingScreen = new LoadingScreen(sketch, player);
    const gameScreen = new GameScreen(sketch, player, game);
    const resultsScreen = new ResultsScreen(sketch, game);

    sketch.setup = () => {
      const canvas = sketch.createCanvas(screenWidth,screenHeight);

      // Put the canvas inside the #sketch-holder div
      canvas.parent('sketch-holder');

      titleScreen.showChooserGuesserButtons(true);
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
      sketch.stroke(255, 80);
      sketch.fill(255, 180);
      sketch.strokeWeight(1);
      sketch.textSize(12);
      sketch.line(sketch.mouseX, 0, sketch.mouseX, screenHeight);
      sketch.line(0, sketch.mouseY, screenWidth, sketch.mouseY);
      sketch.text(sketch.mouseX + '; ' + sketch.mouseY, 50, screenHeight - 30);
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
      if (sketch.keyCode === sketch.BACKSPACE && text.length > 0) {
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
      server.resetFromTitleScreen(player.userType);
      player.resetPlayer();
      player.userConfirmed = false;
    });

    // Submit button either for submitting a a secret phrase or guessing a letter
    submitButton.click(function() {
      if (screenToDisplay === screens.loading) {
        if (player.secretPhrase.length > 0) {
          server.submitSecretPhrase(player.secretPhrase);
        } else {
          alert('Please enter a phrase.');
        }
      } else if (screenToDisplay === screens.game && !alreadyGuessed(player.letterChosen)) {
        if (player.letterChosen.length === 1) {
          server.guessLetter(player.letterChosen);
          player.letterChosen = '';
        } else {
          alert('Please enter a letter.');
        }
      }
    });

    function alreadyGuessed(letter) {
      for (let i = 0; i < game.lettersList.length; i++){
        if (letter === game.lettersList[i]) {
          return true;
        }
      }
      return false;
    }

    // Changes the game's state for this particular client
    function setGameState(gameState) {
      if (gameState === gameStates.title) {
        screenToDisplay = screens.title;
      } else if (gameState === gameStates.loading) {
        screenToDisplay = screens.loading;
      } else if (gameState === gameStates.game) {
        screenToDisplay = screens.game;
      } else if (gameState === gameStates.results) {
        screenToDisplay = screens.results;
      } else {
        console.error('Unexpected game state: ' + gameState);
      }
    }


    // Socket events ////////////////////////////////////////////////////////////////////

    // Called once upon entering site
    server.onConnect(function() {
      server.joinGame();
    });

    // Changes the game's state for this particular client
    server.onGameStateChanged(function(state) {
      console.assert(state, 'Cannot have a null game state');

      const gameState = state['gamestate'];
      setGameState(gameState);
      if (gameState === gameStates.title) {
        titleScreen.showChooserGuesserButtons(true);
        resetButton.show();
        submitButton.hide();
      } else if (gameState === gameStates.loading) {
        titleScreen.showChooserGuesserButtons(false);
        resetButton.hide();
        if (player.isChooser()) {
          submitButton.show();
          submitButton.enable(true);
        } else {
          submitButton.hide();
        }
      } else if (gameState === gameStates.game) {
        titleScreen.showChooserGuesserButtons(false);
        resetButton.hide();
        submitButton.show();
        submitButton.enable(player.isGuesser());
      } else {
        console.error('Unexpected game state: ' + gameState);
      }
    });

    server.onGameScreenUpdates(function(info) {
      console.assert(info, 'Cannot have null information on game screen update');

      game.chooser = info['chooser_name'];
      game.guesser = info['guesser_name'];
      game.chooserPoints = info['chooser_score'];
      game.guesserPoints = info['guesser_score'];
      game.round = info['round'];
      if (!player.isGuesser()) {
        submitButton.enable(false);
      }
    });

    // Called when any user presses the 'Reset' button
    server.onPlayersReset(function(info) {
      console.asssert(info, 'Cannot have null information on player reset');

      const playerTypeEnabled = info['type_enable'];
      console.assert(playerTypeEnabled === 'guesser' || playerTypeEnabled === 'chooser', 'Unexpected player type reset: ', playerTypeEnabled);

      if (playerTypeEnabled === 'guesser') {
        titleScreen.enableSelectingGuesser(true);
      } else if (playerTypeEnabled === 'chooser') {
        titleScreen.enableSelectingChooser(true);
      }
    });

    // Returns the phrase discovered so far, whether the round is completed, and letter just attempted
    server.onDiscoveredPhraseUpdates(function(phrase) {
      console.assert(phrase, 'Cannot have null information on discovered phrase updates');

      game.phrase = phrase['discovered_phrase'];
      if (phrase['phrase_completed']) {
        setGameState(gameScreens.results);
        submitButton.hide();
        setTimeout(function() { server.emit('prepare_next_round'); }, 5000);
      }
      if (phrase['letters_used'].length > 0) {
        game.makeLettersListString(phrase['letters_used']);
      }
      game.lifeCount = maxLife - phrase['misses'];
    });
  });

});
