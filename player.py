#
# Used to represent a player connected to the game
#

NO_NAME = 'Anonymous'


# Different roles that the players can have
class PlayerType:
  GUESSER_TYPE = 'guesser'
  CHOOSER_TYPE = 'chooser'
  SPECTATOR_TYPE = 'spectator'
  NO_TYPE = 'none'


class Player:

  def __init__(self, sid):
    # Keep record of the session id of the player
    self.sid = sid
    self.player_type = PlayerType.SPECTATOR_TYPE
    self.name = NO_NAME
    self.missed_guesses = 0
    self.score = 0

  # Checks if the player is a guesser
  def is_guesser(self):
    return self.player_type == PlayerType.GUESSER_TYPE

  # Checks if the player is a chooser
  def is_chooser(self):
    return self.player_type == PlayerType.CHOOSER_TYPE

  # Checks if the player is a spectator
  def is_spectator(self):
    return self.player_type == PlayerType.SPECTATOR_TYPE

  # Returns the type of the player
  def get_player_type(self):
    return self.player_type

  # Makes the player a guesser
  def make_guesser(self):
    self.player_type = PlayerType.GUESSER_TYPE

  # Makes the player a chooser
  def make_chooser(self):
    self.player_type = PlayerType.CHOOSER_TYPE

  # Makes the player a spectator
  def make_spectator(self):
    self.player_type = PlayerType.SPECTATOR_TYPE

  # Sets the name of the player
  def set_name(self, name):
    assert name is not None
    self.name = name

  # Returns the name of the player
  def get_name(self):
    assert self.name is not None
    return self.name

  # Resets the name of the player
  def reset_name(self):
    self.name = NO_NAME

  # Returns the score of the player
  def get_score(self):
    return self.score

  # Returns the number of phrase misses the player has
  def get_misses(self):
    return self.missed_guesses

  # Resets the round after a results_screen completes
  def round_reset(self):
    self.missed_guesses = 0

  # Fully resets the player
  def full_reset(self):
    self.make_spectator()
    self.reset_name()

  
