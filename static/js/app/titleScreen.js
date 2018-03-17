define(['require', 'app/constants', 'app/button'], function (require, c, Button) {

  'use strict';

  class TitleScreen {

    constructor(sketch, server, player) {
      this.sketch = sketch; // Reference to the p5 library
      this.server = server; // Reference to the server socket connection
      this.player = player; // Instantiated Player object

      // Reference to the chooser/guesser selection buttons
      this.chooserButton = new Button('#become-chooser');
      this.guesserButton = new Button('#become-guesser');

      // Setup UI event handlers
      this.setupUIEventHandlers();

      // Setup server event handlers
      this.setupServerEventHandlers();
    }

    draw() {
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
      this.sketch.text(this.player.getName(), c.screenWidth/2, c.screenHeight/3 + 100);

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

      if (this.player.getName().length === 0) {
        this.sketch.stroke(210);
        this.sketch.fill(210);

        // Filler text in empty name bar
        this.sketch.text('Your Nickname', c.screenWidth / 2, c.screenHeight / 3 + 100);
      }
    }

    // Hide or show the chooser buttons
    showChooserGuesserButtons(shouldShow) {
      if (shouldShow) {
        this.chooserButton.show();
        this.guesserButton.show();
      } else {
        this.chooserButton.hide();
        this.guesserButton.hide();
      }
    }

    // Toggle status of whether the guesser button is enabled
    enableSelectingGuesser(shouldEnable) {
      this.guesserButton.enable(shouldEnable);
    }

    // Toggle status of whether the chooser button is enabled
    enableSelectingChooser(shouldEnable) {
      this.chooserButton.enable(shouldEnable);
    }

    // Setup event handlers for UI (jQuery) events
    setupUIEventHandlers() {
      const self = this;

      this.chooserButton.click(function() {
        const playerName = self.player.getName();
        if (playerName.length > 0) {
          self.server.becomeChooser(playerName);
          self.player.becomeChooser();
          self.player.userConfirmed = true;
        }
      });

      this.guesserButton.click(function() {
        const playerName = self.player.getName();
        if (playerName.length > 0) {
          self.server.becomeGuesser(playerName);
          self.player.becomeGuesser();
          self.player.userConfirmed = true;
        }
      });
    }

    // Setup event handlers for server events
    setupServerEventHandlers() {
      const self = this;

      this.server.onTitleScreenUpdates(function(info) {
        self.enableSelectingGuesser(!info['guess_disable']);
        self.enableSelectingChooser(!info['choose_disable']);
      });

      // Result from pressing 'Become Chooser' button
      this.server.onChooserStatusUpdates(function(result) {
        if (result['chooser_confirmed']) {
          self.enableSelectingChooser(false);
        }
      });

      // Result from pressing 'Become Guesser' button
      this.server.onGuesserStatusUpdates(function(result) {
        if (result['guesser_confirmed']) {
          self.enableSelectingGuesser(false);
        }
      });
    }

  }

  return TitleScreen;

});
