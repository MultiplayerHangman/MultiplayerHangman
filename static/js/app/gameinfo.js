define(['require'], function () {

  // Unique User Game Info
  function GameInfo(maxLife) {
    this.chooser = '';
    this.guesser = '';
    this.chooserPoints = 0;
    this.guesserPoints = 0;
    this.phrase = '';
    this.round = 0;
    this.lettersListString = '';
    this.lettersList = [];
    this.lifeCount = maxLife;
  }

  GameInfo.prototype.makeLettersListString = function(arr) {
    this.lettersList = arr;
    this.lettersListString = "";
    for (let s = 0 ; s < this.lettersList.length ; s++) {
      this.lettersListString += " " + this.lettersList[s];
    }
  };

  return GameInfo;

});
