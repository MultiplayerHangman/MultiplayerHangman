define(['require', 'socketio'], function (require, io) {

  'use strict';

  class Server {

    constructor() {
      this.socket = io.connect('http://' + document.domain + ':' + location.port);
    }

    emit(eventName, info) { return this.socket.emit(eventName, info); }

    on(eventName, callback) { return this.socket.on(eventName, callback); }


    //
    // Make requests to the server
    //

    joinGame() {
      this.emit('connection', {
        'data': 'I\'m connected!'
      });
    }

    // Ask the server to become the chooser
    becomeChooser(playerName) {
      this.emit('become_chooser', {
        'username': playerName
      });
    }

    // Ask the server to become the guesser
    becomeGuesser(playerName) {
      this.emit('become_guesser', {
        'username': playerName
      });
    }

    // Reset the player type from the title screen
    resetFromTitleScreen(userType) {
      this.emit('reset_titlescreen', {
        'reset_type' : userType
      });
    }

    // Send the secret phrase to the server as the chooser
    submitSecretPhrase(secretPhrase) {
      this.emit('submit_secret_phrase', {
        'secret': secretPhrase
      });
    }

    // Send the guess to the server as the guesser
    guessLetter(letter) {
      this.emit('guess_letter', {
        'letter': letter
      });
    }


    //
    // Get data from the server
    //

    // Connected to the server
    onConnect(callback) { this.on('connect', callback); }

    // The screen of the game changed (ex. from TitleScreen to GameScreen)
    onGameStateChanged(callback) { this.on('change_gamestate', callback); }

    // Updates to toggle button statuses
    onTitleScreenUpdates(callback) { this.on('update_titlescreen', callback); }

    // Updates to whether the chooser has been set
    onChooserStatusUpdates(callback) { this.on('chooser_feedback', callback); }

    // Updates to whether the guesser has been set
    onGuesserStatusUpdates(callback) { this.on('guesser_feedback', callback); }

    // Updates to names, scores, and round on the game screen
    onGameScreenUpdates(callback) { this.on('update_gamescreen', callback); }

    // Another user pressed the reset button
    onPlayersReset(callback) { this.on('external_reset', callback); }

    // Updates to the phrase currently discovered
    onDiscoveredPhraseUpdates(callback) { this.on('discovered_phrase', callback); }

  }

  return Server;

});
