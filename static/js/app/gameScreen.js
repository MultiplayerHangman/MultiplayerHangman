define(['require', 'app/constants'], function (require, c) {

  'use strict';

  function GameScreen(sketch, player, game) {
    this.sketch = sketch; // Reference to the p5 library
    this.player = player; // Instantiated Player object
    this.game = game;     // Instantiated Game object
  }

  GameScreen.prototype.draw = function() {
    const adjustedSW = c.screenWidth - 20;

    this.sketch.push();

    this.sketch.stroke(255, 180);
    this.sketch.fill(255, 180);
    this.sketch.strokeWeight(6);
    this.sketch.line(5, 70, adjustedSW, 70);
    this.sketch.line(20, c.screenHeight - 90, adjustedSW, c.screenHeight - 90);

    this.sketch.stroke(255);
    this.sketch.fill(255);
    this.sketch.strokeWeight(5);
    this.sketch.line(100, 510, 400, 510);
    this.sketch.line(160, 510, 160, 160);
    this.sketch.line(160, 160, 300, 160);
    this.sketch.line(300, 160, 300, 198);

    this.drawHangman(c.maxLife - this.game.lifeCount);

    this.drawPhraseLetters();

    this.sketch.rectMode(this.sketch.CORNERS);
    this.sketch.noFill();
    this.sketch.strokeWeight(1);
    this.sketch.rect(30, 625, 770, 682);

    this.sketch.textAlign(this.sketch.CENTER);
    this.sketch.textSize(20);
    this.sketch.fill(255);
    this.sketch.strokeWeight(1);
    if (this.player.isGuesser()) {
      this.sketch.textSize(28);
    }
    this.sketch.text('Guesser: ' + this.game.guesser, 150, 35);
    this.sketch.textSize(20);
    if (this.player.isChooser()) {
      this.sketch.textSize(28);
    }
    this.sketch.text('Chooser: ' + this.game.chooser, adjustedSW - 150,35);
    this.sketch.textSize(20);
    this.sketch.strokeWeight(1);
    this.sketch.text('Round: ' + this.game.round + ' / 5', adjustedSW / 2, 35);
    this.sketch.text(this.player.letterChosen, 400, 660);
    this.sketch.text('Spectators: ', 90, 590);

    if (this.player.letterChosen.length === 0) {
      this.sketch.fill(210);
      this.sketch.stroke(210);
      this.sketch.text('Enter letter to guess', 400, 660);
    }

    this.sketch.pop();
  };

  GameScreen.prototype.drawHangman = function(hits) {
    const hangmanCenterX = 300;
    let standDeviation = 0;

    this.sketch.push();
    this.sketch.textAlign(this.sketch.CENTER);

    if (hits === c.maxLife) {
      this.sketch.strokeWeight(0.7);
    } else {
      this.sketch.strokeWeight(1.6);
    }

    // Face of hangman
    if (hits >= 1) {
      this.sketch.noFill();
      // Head
      this.sketch.ellipse(hangmanCenterX, 230, 45, 60);
      if (hits < c.maxLife) {
        // Normal eye holes
        this.sketch.ellipse(hangmanCenterX - 8, 222, 12, 12);
        this.sketch.ellipse(hangmanCenterX + 8, 222, 12, 12);
      }
      // Frown
      this.sketch.arc(hangmanCenterX, 250, 20, 20, this.sketch.PI + this.sketch.QUARTER_PI,- this.sketch.QUARTER_PI);
      this.sketch.fill(255);
      if (hits < c.maxLife) {
        // Normal eye pupils
        this.sketch.ellipse(hangmanCenterX - 8, 222, 2, 2);
        this.sketch.ellipse(hangmanCenterX + 8, 222, 2, 2);
      }
    }
    // Neck of hangman
    if (hits >= 2) this.sketch.line(hangmanCenterX, 260, hangmanCenterX, 270);
    // 'Left' arm of hangman (relative to user)
    // 'Right' arm of hangman (relative to user)
    if (hits >= 3) {
      if (hits < c.maxLife) {
        this.sketch.line(hangmanCenterX, 270, hangmanCenterX - 30, 325);
        this.sketch.line(hangmanCenterX, 270, hangmanCenterX + 30, 325);
      } else {
        this.sketch.line(hangmanCenterX, 270, hangmanCenterX - 15.5, 330.7);
        this.sketch.line(hangmanCenterX, 270, hangmanCenterX + 15.5, 330.7);
      }
    }

    // Torso of hangman
    if (hits >= 4) this.sketch.line(hangmanCenterX, 270, hangmanCenterX, 330);

    // 'Left' and 'Right' leg of hangman (relative to user)
    if (hits >= 5) {
      this.sketch.line(hangmanCenterX, 330, hangmanCenterX - 15, 420);
      this.sketch.line(hangmanCenterX, 330, hangmanCenterX + 15, 420);
    }

    // Stand for hangman to be supported before death
    if (hits < c.maxLife) {
      if (hits === c.maxLife - 1) {
        standDeviation = 52;
      } else {
        standDeviation = 0;
      }
      this.sketch.line(hangmanCenterX - 55 + standDeviation, 420, hangmanCenterX + 55 + standDeviation, 420);
      this.sketch.line(hangmanCenterX - 55 + standDeviation, 460, hangmanCenterX + 55 + standDeviation, 460);
      this.sketch.line(hangmanCenterX - 25 + standDeviation, 420, hangmanCenterX - 40 + standDeviation, 510);
      this.sketch.line(hangmanCenterX + 25 + standDeviation, 420, hangmanCenterX + 40 + standDeviation, 510);
    }

    // 'x''s to replace eyes when death occurs
    if (hits === c.maxLife) {
      this.sketch.textSize(20);
      this.sketch.text('x', hangmanCenterX - 8, 226);
      this.sketch.text('x', hangmanCenterX + 8, 226);
    }
    this.sketch.pop();
  }


  GameScreen.prototype.drawPhraseLetters = function() {
    this.sketch.push();
    this.sketch.textAlign(this.sketch.CENTER);
    this.sketch.textSize(30);
    this.sketch.stroke(255);
    this.sketch.fill(255);
    this.sketch.strokeWeight(1);
    this.sketch.text(this.game.phrase, 680, 280);
    this.sketch.textSize(18);
    this.sketch.text('Used:' + this.game.lettersListString, 680, 450);
    this.sketch.pop();
  }

  return GameScreen;

});
