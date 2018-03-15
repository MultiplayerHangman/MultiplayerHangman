define(['require'], function () {

  'use strict';

  // Unique User Game Info
  function Game(maxLife) {
    this.chooser = '';
    this.guesser = '';
    this.chooserPoints = 0;
    this.guesserPoints = 0;
    this.phrase = '';
    this.round = 0;
    this.lettersList = [];
    this.lifeCount = maxLife;
  }

  // Get a list of letters used as a string
  Game.prototype.getLettersList = function() {
    return this.lettersList.join(' ');
  };

  // Check whether the guesser had already guessed the letter
  Game.prototype.alreadyGuessed = function(letter) {
    return this.lettersList.indexOf(letter) >= 0;
  };

  return Game;

});
