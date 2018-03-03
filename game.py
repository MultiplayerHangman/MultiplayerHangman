#
# Contains all of the game logic regarding guesser and chooser
# and ways to guess
# This is the interface that the sockets can call to manipulate the
# control flow
#

from hangman import Hangman
from player import Player

# Session ID of a guesser/choose when none have been selected
PLAYER_NOT_CHOSEN = "PLAYER_NOT_CHOSEN"

class Game:

  def __init__(self):
    self.guesser = PLAYER_NOT_CHOSEN # The session ID of the player who guesses the phrase
    self.chooser = PLAYER_NOT_CHOSEN # The session ID of the player who provides the phrase
    self.hangman = None              # Hangman game instance
    self.players = {}                # Dictionary of [session_id:Player] currently connected
    self.gamestate = "titlescreen"

  # Keep track of a new player in the game
  def add_player(self, sid):
    assert sid is not None
    assert sid not in self.players
    self.players[sid] = Player(sid)

  # Remove a player from the game when they disconnect
  def remove_player(self, sid):
    assert sid is not None
    assert sid in self.players
    self.players.pop(sid, None)

  # Get the number of players currently connected
  def count_players(self):
    return len(self.players)

  # Return True if the current player is a guesser, False if not
  def is_guesser(self, sid):
    assert sid is not None
    return self.guesser == sid

  # Return True if the current player is a chooser, False if not
  def is_chooser(self, sid):
    assert sid is not None
    return self.chooser == sid

  # Return True if someone was chosen as a guesser, False if not
  def is_guesser_set(self):
    return self.guesser != PLAYER_NOT_CHOSEN

  # Return True if someone was chosen as a chooser, False if not
  def is_chooser_set(self):
    return self.chooser != PLAYER_NOT_CHOSEN

  # Set the guesser back to PLAYER_NOT_CHOSEN, returns True if there was a
  # guesser previously, False if not
  def reset_guesser(self):
    # Reset roles in players dictionary
    if self.guesser != PLAYER_NOT_CHOSEN:
      assert self.guesser in self.players
      self.players[self.guesser].make_spectator()
      self.guesser = PLAYER_NOT_CHOSEN
      return True
    return False

  # Set the chooser back to PLAYER_NOT_CHOSEN, returns True if there was a
  # chooser previously, False if not
  def reset_chooser(self):
    # Reset roles in players dictionary
    if self.chooser != PLAYER_NOT_CHOSEN:
      assert self.chooser in self.players
      self.players[self.chooser].make_spectator()
      self.chooser = PLAYER_NOT_CHOSEN
      return True
    return False

  # Become the new guesser - assumes guesser was already reset
  def set_guesser(self, sid, name):
    self.guesser = sid
    if (sid == "PLAYER_NOT_CHOSEN"):
      return
    self.players[sid].make_guesser()
    self.players[sid].set_name(name)

  # Become the new chooser - assumes chooser was already reset
  def set_chooser(self, sid, name):
    self.chooser = sid
    if (sid == "PLAYER_NOT_CHOSEN"):
      return
    self.players[sid].make_chooser()
    self.players[sid].set_name(name)

  # Become a spectator on the server
  def set_spectator(self, sid):
    self.players[sid].make_spectator()

  # Get the name of the player
  def get_name(self, sid):
    assert sid is not None
    assert sid in self.players
    return self.players[sid].get_name()

  # Set a new name for the player
  def set_name(self, sid, name):
    assert sid is not None
    assert sid in self.players
    return self.players[sid].set_name(name)

  # Reset the hangman game
  def reset_game(self, phrase):
    self.hangman = Hangman(phrase)

  # Resets user's type for everyone
  def reset_type(self, sid):
    if self.is_guesser(sid):
      return "guesser"
    elif self.is_chooser(sid):
      return "chooser"
    else:
      return "none"

  # Resets the user's opposite type if necessary
  def reset_opposite_type(self, sid):
    if self.is_guesser(sid):
      if self.is_chooser_set():
        return "none"
      else:
        return "chooser"
    elif self.is_chooser(sid):
      if self.is_guesser_set():
        return "none"
      else:
        return "guesser"
    else:
      return "none"

  # Determines if both chooser and guesser have been confirmed
  def players_ready(self):
    return self.is_guesser_set() and self.is_chooser_set()



