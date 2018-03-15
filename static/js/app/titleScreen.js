define(['require', 'app/constants', 'app/button'], function (require, c, Button) {

  'use strict';

  function TitleScreen(sketch, player) {
    this.sketch = sketch; // Reference to the p5 library
    this.player = player; // Instantiated Player object

    // Reference to the chooser/guesser selection buttons
    this.chooserButton = new Button('#become-chooser');
    this.guesserButton = new Button('#become-guesser');
  }

  TitleScreen.prototype.draw = function() {
    this.sketch.textAlign(this.sketch.CENTER);
    this.sketch.stroke(255);
    this.sketch.fill(255);

    // Title of titlescreen
    this.sketch.textSize(18);
    this.sketch.text('MULTIPLAYER: ', c.screenWidth / 2, c.screenHeight / 4 - 20);
    this.sketch.textSize(80);
    this.sketch.text('HANGMAN', c.screenWidth/2, c.screenHeight/3);

    // Name of player in name bar
    this.sketch.textSize(30);
    this.sketch.text(this.player.playerName, c.screenWidth/2, c.screenHeight/3 + 100);

    if (this.player.userConfirmed) {
      this.sketch.push(); // Seperate style for loading text

      this.sketch.textSize(16);
      this.sketch.textStyle(this.sketch.ITALIC);
      this.sketch.strokeWeight(0.5);

      // Loading text when player has confirmed
      if (this.player.isGuesser()) {
        this.sketch.text('Waiting for a chooser...', c.screenWidth / 2, 2 * c.screenHeight / 3 + 40);
      } else if (this.player.isChooser()) {
        this.sketch.text('Waiting for a guesser...', c.screenWidth / 2, 2 * c.screenHeight / 3 + 40);
      }

      this.sketch.pop(); // Removes temporary style

      this.sketch.fill(255, 40);
    } else {
      this.sketch.noFill();
    }

    // Frame of name bar
    this.sketch.rectMode(this.sketch.RADIUS);
    this.sketch.rect(c.screenWidth / 2, c.screenHeight / 3 + 89, 160, 25);

    if (this.player.playerName.length === 0) {
      this.sketch.stroke(210);
      this.sketch.fill(210);

      // Filler text in empty name bar
      this.sketch.text('Your Nickname', c.screenWidth / 2, c.screenHeight / 3 + 100);
    }
  };

  // Hide or show the chooser buttons
  TitleScreen.prototype.showChooserGuesserButtons = function(shouldShow) {
    if (shouldShow) {
      this.chooserButton.show();
      this.guesserButton.show();
    } else {
      this.chooserButton.hide();
      this.guesserButton.hide();
    }
  };

  // Toggle status of whether the guesser button is enabled
  TitleScreen.prototype.enableSelectingGuesser = function(shouldEnable) {
    this.guesserButton.enable(shouldEnable);
  };

  // Toggle status of whether the chooser button is enabled
  TitleScreen.prototype.enableSelectingChooser = function(shouldEnable) {
    this.chooserButton.enable(shouldEnable);
  };

  // Expose setting button click events
  // Temporary until we move all the logic into this view
  TitleScreen.prototype.chooserButtonClick = function(callback) { return this.chooserButton.click(callback); };
  TitleScreen.prototype.guesserButtonClick = function(callback) { return this.guesserButton.click(callback); };

  return TitleScreen;

});
