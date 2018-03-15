define(['require'], function () {

  /*
    Unique User Game Info
    ABOUT:
      playerName: Name of user
      userConfirmed: Whether the user has confirmed their play type
      userType: The play type the user has chosen or been assigned
      secretPhrase: As the chooser, a secret phrase is chosen and stored
      letterChosen: Letter chosen by user on game screen when permitted to do so
  */
  function PlayerInfo() {
    this.playerName = '';
    this.userConfirmed = false; // whether the user has confirmed their user type
    this.userType = 'spectator';
    this.secretPhrase = '';
    this.letterChosen = '';
  }

  PlayerInfo.prototype.resetPlayer = function() {
    this.playerName = '';
    this.userType = '';
  };

  PlayerInfo.prototype.becomeChooser = function() {
    this.playerName = this.playerName.trim();
    this.userConfirmed = true;
    this.userType = 'chooser';
  };

  PlayerInfo.prototype.becomeGuesser = function() {
    this.playerName = this.playerName.trim();
    this.userType = 'guesser';
  };

  return PlayerInfo;

});
