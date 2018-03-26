#
# Contains all of the game logic regarding guesser and chooser
# and ways to guess
# This is the interface that the sockets can call to manipulate the
# control flow
#

from hangman import Hangman
from player import Player, PlayerType

# Session ID of a guesser/choose when none have been selected
PLAYER_NOT_CHOSEN = 'PLAYER_NOT_CHOSEN'

# These are the different screens that the users can be seeing
class GameState:
  TITLE_SCREEN = 'titlescreen'
  LOADING_SCREEN = 'loadingscreen'
  GAME_SCREEN = 'gamescreen'


class Game:

  def __init__(self):
    self.guesser = PLAYER_NOT_CHOSEN         # The session ID of the player who guesses the phrase
    self.chooser = PLAYER_NOT_CHOSEN         # The session ID of the player who provides the phrase
    self.hangman = None                      # Hangman game instance
    self.players = {}                        # Dictionary of [session_id:Player] currently connected
    self.game_state = GameState.TITLE_SCREEN # Screen that the users are on
    self.round = 0
    self.letters_guessed = []
    self.phrase_misses = 0

  # Reset the whole state
  def reset(self):
    self.reset_guesser()
    self.reset_chooser()
    self.hangman = None
    # Don't reset players since people are still connected as spectators
    self.game_state = GameState.TITLE_SCREEN
    self.round = 0
    self.letters_guessed = []
    self.phrase_misses = 0

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
    if (sid == PLAYER_NOT_CHOSEN):
      return
    self.players[sid].make_guesser()
    self.players[sid].set_name(name)

  # Become the new chooser - assumes chooser was already reset
  def set_chooser(self, sid, name):
    self.chooser = sid
    if (sid == PLAYER_NOT_CHOSEN):
      return
    self.players[sid].make_chooser()
    self.players[sid].set_name(name)

  # Become a spectator on the server
  def set_spectator(self, sid):
    self.players[sid].make_spectator()

  # Get the name of the player
  def get_name(self, sid):
    if (sid == PLAYER_NOT_CHOSEN):
      return PLAYER_NOT_CHOSEN
    assert sid is not None
    assert sid in self.players
    return self.players[sid].get_name()

  # Set a new name for the player
  def set_name(self, sid, name):
    assert sid is not None
    assert sid in self.players
    return self.players[sid].set_name(name)

  # Reset the name of the player
  def reset_name(self, sid):
    assert sid is not None
    assert sid in self.players
    return self.players[sid].reset_name()

  # Reset the hangman game
  def set_phrase(self, phrase):
    self.hangman = Hangman(phrase)

  # Get the current type of the player as a string
  def get_player_type(self, sid):
    return self.players[sid].get_player_type()

  # Get the "opposite" (ex. chooser/guesser) type of the player
  def get_opposite_player_type(self, sid):
    if self.is_guesser(sid):
      return PlayerType.CHOOSER_TYPE
    elif self.is_chooser(sid):
      return PlayerType.GUESSER_TYPE
    else:
      return PlayerType.NO_TYPE

  # Determines if both chooser and guesser have been confirmed
  def players_ready(self):
    return self.is_guesser_set() and self.is_chooser_set()

  # Returns the phrase in its currently discovered position
  def guess_letter(self, letter):
    assert self.hangman is not None
    self.hangman.guess(letter)
    self.letters_guessed.append(letter)
    return self.get_currently_discovered_phrase()

  # Returns the phrase with underlines for what hasn't been guessed yet
  def get_currently_discovered_phrase(self):
    if self.hangman is None:
      return None
    return self.hangman.getCurrentlyDiscoveredPhrase()

  # Checks if phrase has been successfully completed
  def is_completed(self):
    if self.hangman is None:
      return False
    return self.hangman.isCompleted()

  def hit_constrain(self, val):
    self.phrase_misses = min(7, max(0, val))

  def get_score(self, sid):
    if sid not in self.players:
      return 0
    return self.players[sid].get_score()

  def swap_players(self):
    self.players[self.guesser].player_type = PlayerType.CHOOSER_TYPE
    self.players[self.chooser].player_type = PlayerType.GUESSER_TYPE
    temp_player_sid = self.guesser
    self.guesser = self.chooser
    self.chooser = temp_player_sid

  def prepare_next_round(self):
    self.Hangman = None
    self.letters_guessed = []
    self.misses = 0
