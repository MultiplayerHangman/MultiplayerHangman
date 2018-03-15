define(['require'], function () {

  'use strict';

  function TitleScreen(sketch, player, screenWidth, screenHeight) {
    this.sketch = sketch; // Reference to the p5 library
    this.player = player; // PlayerInfo object

    // Dimensions of the screen
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }

  TitleScreen.prototype.draw = function() {
    this.sketch.textAlign(this.sketch.CENTER);
    this.sketch.stroke(255);
    this.sketch.fill(255);

    // Title of titlescreen
    this.sketch.textSize(18);
    this.sketch.text('MULTIPLAYER: ', this.screenWidth / 2, this.screenHeight / 4 - 20);
    this.sketch.textSize(80);
    this.sketch.text('HANGMAN', this.screenWidth/2, this.screenHeight/3);

    // Name of player in name bar
    this.sketch.textSize(30);
    this.sketch.text(this.player.playerName, this.screenWidth/2, this.screenHeight/3 + 100);

    if (this.player.userConfirmed) {
      this.sketch.push(); // Seperate style for loading text

      this.sketch.textSize(16);
      this.sketch.textStyle(this.sketch.ITALIC);
      this.sketch.strokeWeight(0.5);

      // Loading text when player has confirmed
      if (this.player.isGuesser()) {
        this.sketch.text('Waiting for a chooser...', this.screenWidth / 2, 2 * this.screenHeight / 3 + 40);
      } else if (this.player.isChooser()) {
        this.sketch.text('Waiting for a guesser...', this.screenWidth / 2, 2 * this.screenHeight / 3 + 40);
      }

      this.sketch.pop(); // Removes temporary style

      this.sketch.fill(255, 40);
    } else {
      this.sketch.noFill();
    }

    // Frame of name bar
    this.sketch.rectMode(this.sketch.RADIUS);
    this.sketch.rect(this.screenWidth / 2, this.screenHeight / 3 + 89, 160, 25);

    if (this.player.playerName.length === 0) {
      this.sketch.stroke(210);
      this.sketch.fill(210);

      // Filler text in empty name bar
      this.sketch.text('Your Nickname', this.screenWidth / 2, this.screenHeight / 3 + 100);
    }
  };

  return TitleScreen;

});
