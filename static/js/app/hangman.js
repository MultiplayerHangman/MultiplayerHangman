// Hack to enable the reset() function from the console
let server;

define(['require', 'p5', 'app/server', 'app/game', 'app/player', 'app/titleScreen', 'app/loadingScreen', 'app/gameScreen', 'app/resultsScreen', 'app/button'], function (require, p5, Server, Game, Player, TitleScreen, LoadingScreen, GameScreen, ResultsScreen, Button) {

  'use strict';

  const screenWidth = 1080;
  const screenHeight = 700;
  const maxLife = 7;
  const player = new Player();
  const game = new Game(maxLife);
  server = new Server();

  const GameStates = { title: 'titlescreen', loading: 'loadingscreen', game: 'gamescreen', results: 'resultsscreen' };
  let gameState = GameStates.title;

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
    };

    // Overall Control Flow /////////////////////////////////////////////////////////////

    sketch.draw = () => {
      // Repeatedly updates the screen
      sketch.clear();

      sketch.posReference();

      if (gameState === GameStates.title) {
        titleScreen.draw();
      } else if (gameState === GameStates.loading) {
        loadingScreen.draw();
      } else if (gameState === GameStates.game) {
        gameScreen.draw();
      } else if (gameState === GameStates.results) {
        resultsScreen.draw();
      } else {
        console.error('Trying to display unknown screen: ' + gameState);
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
        player.playerName = textModify(player.playerName, 20);
      } else if (gameState === GameStates.loading && player.isChooser()) {
        player.secretPhrase = textModify(player.secretPhrase, 24);
      } else if (gameState === GameStates.game && player.isGuesser()) {
        player.letterChosen = textModify(player.letterChosen, 1).toUpperCase();

        // Don't allow spaces or already guessed letters
        if (player.letterChosen === ' ' || game.alreadyGuessed(player.letterChosen)) {
          player.letterChosen = '';
        }
      }
    };

    // Returns whether the character is an alphabet character or a space
    function isAlphaOrSpace(c) {
      console.assert(c.length === 1, 'Attempted to check if a non-character string was alphabet or space', c);

      if (c === ' ') { return true; }

      // Only works for Latin characters, but check if alphabet
      return c.toUpperCase() != c.toLowerCase();
    }

    // General purpose text input function used exclusively in keyPressed()
    function textModify(text, maxStringLength) {
      if (sketch.keyCode === sketch.BACKSPACE && text.length > 0) {
        text = text.substring(0, text.length - 1);
      } else if (sketch.keyCode != sketch.BACKSPACE && text.length < maxStringLength && isAlphaOrSpace(sketch.key)) {
        text += sketch.key.toUpperCase();
      }
      return text;
    }


    // Jquery Events ////////////////////////////////////////////////////////////////////


    resetButton.click(function() {
      server.resetFromTitleScreen(player.userType);
      player.reset();
      player.userConfirmed = false;
    });

    // Submit button either for submitting a a secret phrase or guessing a letter
    submitButton.click(function() {
      if (gameState === GameStates.loading) {
        if (player.getSecretPhrase().length > 0) {
          server.submitSecretPhrase(player.getSecretPhrase());
        } else {
          alert('Please enter a phrase.');
        }
      } else if (gameState === GameStates.game && !game.alreadyGuessed(player.letterChosen)) {
        if (player.letterChosen.length === 1) {
          server.guessLetter(player.letterChosen);
          player.letterChosen = '';
        } else {
          alert('Please enter a letter.');
        }
      }
    });

    // Changes the game's state for this particular client
    function setGameState(state) {
      console.assert(
        gameState === GameStates.title ||
        gameState === GameStates.loading ||
        gameState === GameStates.game ||
        gameState === GameStates.results,
        'Unexpected game state: ' + gameState);
      gameState = state;
    }


    // Socket events ////////////////////////////////////////////////////////////////////

    // Called once upon entering site
    server.onConnect(function() {
      server.joinGame();
    });

    // Changes the game's state for this particular client
    server.onGameStateChanged(function(state) {
      console.assert(state, 'Cannot have a null game state');

      setGameState(state['gamestate']);
      if (gameState === GameStates.title) {
        titleScreen.showChooserGuesserButtons(true);
        resetButton.show();
        submitButton.hide();
      } else if (gameState === GameStates.loading) {
        titleScreen.showChooserGuesserButtons(false);
        resetButton.hide();
        if (player.isChooser()) {
          submitButton.show();
          submitButton.enable(true);
        } else {
          submitButton.hide();
        }
      } else if (gameState === GameStates.game) {
        titleScreen.showChooserGuesserButtons(false);
        resetButton.hide();
        submitButton.show();
        submitButton.enable(player.isGuesser());
      } else if (gameState === GameStates.results) {
        console.log('Show results screen stuff here');
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
      console.assert(info, 'Cannot have null information on player reset');

      const playerTypeEnabled = info['type_enable'];
      console.assert(playerTypeEnabled === Player.GUESSER_TYPE || playerTypeEnabled === Player.CHOOSER_TYPE, 'Unexpected player type reset: ', playerTypeEnabled);

      if (playerTypeEnabled === Player.GUESSER_TYPE) {
        titleScreen.enableSelectingGuesser(true);
      } else if (playerTypeEnabled === Player.CHOOSER_TYPE) {
        titleScreen.enableSelectingChooser(true);
      }
    });

    // Returns the phrase discovered so far, whether the round is completed, and letter just attempted
    server.onDiscoveredPhraseUpdates(function(phrase) {
      console.assert(phrase, 'Cannot have null information on discovered phrase updates');

      game.phrase = phrase['discovered_phrase'];
      if (phrase['phrase_completed']) {
        setGameState(GameStates.results);
        submitButton.hide();
        setTimeout(function() { server.emit('prepare_next_round'); }, 5000);
      }
      game.lettersList = phrase['letters_used'];
      game.lifeCount = maxLife - phrase['misses'];
    });

    // Called when resetting the game for debugging purposes
    server.onResetGameRequest(function() {
      console.log('Resetting game');
      player.reset();
      game.reset(maxLife);
      gameState = GameStates.title;
      titleScreen.showChooserGuesserButtons(true);
      resetButton.show();
      submitButton.hide();
    });

  });

});

// Ask the server to kick everyone back to the title screen and reset state
function reset() {
  if (server) {
    server.resetGame();
  } else {
    console.err('Server not initialized yet');
  }
}
