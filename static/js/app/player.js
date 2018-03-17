define(['require'], function () {

  // Different user types of the player
  const SPECTATOR_TYPE = 'spectator';
  const CHOOSER_TYPE = 'chooser';
  const GUESSER_TYPE = 'guesser';

  /*
    Unique User Game Info
    ABOUT:
      playerName: Name of user
      userConfirmed: Whether the user has confirmed their play type
      userType: The play type the user has chosen or been assigned
      secretPhrase: As the chooser, a secret phrase is chosen and stored
      letterChosen: Letter chosen by user on game screen when permitted to do so
  */
  function Player() {
    this.playerName = ''; // Do not access directly - use getName()
    this.userConfirmed = false; // whether the user has confirmed their user type
    this.userType = SPECTATOR_TYPE;
    this.secretPhrase = '';
    this.letterChosen = '';
  }

  Player.prototype.getName = function() {
    return this.playerName.toUpperCase().trim();
  };

  Player.prototype.getSecretPhrase = function() {
    return this.secretPhrase.toUpperCase().trim();
  };

  Player.prototype.resetPlayer = function() {
    this.playerName = '';
    this.userType = '';
  };

  Player.prototype.becomeChooser = function() {
    this.playerName = this.playerName.trim();
    this.userConfirmed = true;
    this.userType = CHOOSER_TYPE;
  };

  Player.prototype.becomeGuesser = function() {
    this.playerName = this.playerName.trim();
    this.userType = GUESSER_TYPE;
  };

  Player.prototype.isGuesser = function() {
    return this.userType === GUESSER_TYPE;
  };

  Player.prototype.isChooser = function() {
    return this.userType === CHOOSER_TYPE;
  };

  Player.prototype.isSpectator = function() {
    return this.userType === SPECTATOR_TYPE;
  }

  // Export the player type constants so we can parse the JSON
  Player.prototype.SPECTATOR_TYPE = SPECTATOR_TYPE;
  Player.prototype.GUESSER_TYPE = GUESSER_TYPE;
  Player.prototype.CHOOSER_TYPE = CHOOSER_TYPE;

  return Player;

});
