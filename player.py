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
    self.score = 0

  def is_guesser(self):
    return self.player_type == PlayerType.GUESSER_TYPE

  def is_chooser(self):
    return self.player_type == PlayerType.CHOOSER_TYPE

  def is_spectator(self):
    return self.player_type == PlayerType.SPECTATOR_TYPE

  def make_guesser(self):
    self.player_type = PlayerType.GUESSER_TYPE

  def make_chooser(self):
    self.player_type = PlayerType.CHOOSER_TYPE

  def make_spectator(self):
    self.player_type = PlayerType.SPECTATOR_TYPE

  def set_name(self, name):
    assert name is not None
    self.name = name

  def get_name(self):
    assert self.name is not None
    return self.name

  def get_player_type(self):
    return self.player_type

  def reset_name(self):
    self.name = NO_NAME

  def reset(self):
    self.make_spectator()
    self.reset_name()

  def get_score(self):
    return self.score
