# Different types that the player can be
GUESSER_TYPE = "guesser"
CHOOSER_TYPE = "chooser"
SPECTATOR_TYPE = "spectator"

class Player:

  def __init__(self, sid):
    # Keep record of the session id of the player
    self.sid = sid
    self.player_type = SPECTATOR_TYPE
    self.name = "Anonymous"

  def is_guesser(self):
    return self.player_type == GUESSER_TYPE

  def is_chooser(self):
    return self.player_type == CHOOSER_TYPE

  def is_spectator(self):
    return self.player_type == SPECTATOR_TYPE

  def make_guesser(self):
    self.player_type = GUESSER_TYPE

  def make_chooser(self):
    self.player_type = CHOOSER_TYPE

  def make_spectator(self):
    self.player_type = SPECTATOR_TYPE

  def set_name(self, name):
    assert name is not None
    self.name = name

  def get_name(self):
    assert self.name is not None
    return self.name
