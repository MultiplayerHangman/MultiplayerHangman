define(['require', 'socketio'], function (require, io) {

  'use strict';

  function Server() {
    this.socket = io.connect('http://' + document.domain + ':' + location.port);
  }

  Server.prototype.emit = function(eventName, info) { return this.socket.emit(eventName, info); };

  Server.prototype.on = function(eventName, callback) { return this.socket.on(eventName, callback); };


  //
  // Make requests to the server
  //

  Server.prototype.joinGame = function() {
    this.emit('connection', {
      'data': 'I\'m connected!'
    });
  };

  // Ask the server to become the chooser
  Server.prototype.becomeChooser = function(playerName) {
    this.emit('become_chooser', {
      'username': playerName
    });
  };

  // Ask the server to become the guesser
  Server.prototype.becomeGuesser = function(playerName) {
    this.emit('become_guesser', {
      'username': playerName
    });
  };

  // Reset the player type from the title screen
  Server.prototype.resetFromTitleScreen = function(userType) {
    this.emit('reset_titlescreen', {
      'reset_type' : userType
    });
  };

  // Send the secret phrase to the server as the chooser
  Server.prototype.submitSecretPhrase = function(secretPhrase) {
    this.emit('submit_secret_phrase', {
      'secret': secretPhrase
    });
  };

  // Send the guess to the server as the guesser
  Server.prototype.guessLetter = function(letter) {
    this.emit('guess_letter', {
      'letter': letter
    });
  };


  //
  // Get data from the server
  //

  // Connected to the server
  Server.prototype.onConnect = function(callback) { this.on('connect', callback); };

  // The screen of the game changed (ex. from TitleScreen to GameScreen)
  Server.prototype.onGameStateChanged = function(callback) { this.on('change_gamestate', callback); };

  // Updates to toggle button statuses
  Server.prototype.onTitleScreenUpdates = function(callback) { this.on('update_titlescreen', callback); };

  // Updates to whether the chooser has been set
  Server.prototype.onChooserStatusUpdates = function(callback) { this.on('chooser_feedback', callback); };

  // Updates to whether the guesser has been set
  Server.prototype.onGuesserStatusUpdates = function(callback) { this.on('guesser_feedback', callback); };

  // Updates to names, scores, and round on the game screen
  Server.prototype.onGameScreenUpdates = function(callback) { this.on('update_gamescreen', callback); };

  // Another user pressed the reset button
  Server.prototype.onPlayersReset = function(callback) { this.on('external_reset', callback); };

  // Updates to the phrase currently discovered
  Server.prototype.onDiscoveredPhraseUpdates = function(callback) { this.on('discovered_phrase', callback); };

  return Server;

});
