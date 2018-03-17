define(['require', 'app/constants'], function (require, c) {

  'use strict';

  class LoadingScreen {

    constructor(sketch, player) {
      this.sketch = sketch; // Reference to the p5 library
      this.player = player; // Instantiated Player object
    }

    draw() {
      this.sketch.textAlign(this.sketch.CENTER);
      this.sketch.stroke(255);
      this.sketch.fill(255);

      this.sketch.textSize(20);
      this.sketch.text('Game in Session', c.screenWidth / 2, 50);

      if (this.player.isGuesser() || this.player.isSpectator()) {
        this.sketch.push();
        this.sketch.textStyle(this.sketch.ITALIC);
        this.sketch.textSize(32);
        this.sketch.text('Waiting for Chooser...', c.screenWidth / 2, c.screenHeight / 2);
        this.sketch.pop();

      } else if (this.player.isChooser()) {

        this.sketch.push();
        this.sketch.textSize(32);
        this.sketch.text('Provide a phrase to guess:', c.screenWidth / 2, c.screenHeight / 2 - 80);

        this.sketch.textSize(16);
        this.sketch.text('Maximum length of 30 characters (including spaces)', c.screenWidth / 2, c.screenHeight / 2 + 80);
        this.sketch.text('LETTERS ONLY', c.screenWidth / 2, c.screenHeight / 2 + 105);

        this.sketch.textSize(40);
        this.sketch.text(this.player.getSecretPhrase(), c.screenWidth / 2, c.screenHeight / 2 + 12);

        if (this.player.getSecretPhrase() === 0) {
          this.sketch.push();
          this.sketch.stroke(210);
          this.sketch.fill(210);
          this.sketch.text('Enter your phrase here', c.screenWidth / 2, c.screenHeight / 2 + 12);
          this.sketch.pop();
        }

        this.sketch.rectMode(this.sketch.CENTER);
        this.sketch.fill(80, 120);
        this.sketch.rect(c.screenWidth / 2, c.screenHeight / 2, 700, 80);
        this.sketch.pop();
      }
    }

  }

  return LoadingScreen;

});
