from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os
from hangman import Hangman
from player import Player

# Session ID of a guesser/choose when none have been selected
PLAYER_NOT_CHOSEN = "PLAYER_NOT_CHOSEN"

app = Flask(__name__)
socketio = SocketIO(app)

# Session
guesser = PLAYER_NOT_CHOSEN # The session ID of the player who guesses the phrase
chooser = PLAYER_NOT_CHOSEN # The session ID of the player who provides the phrase
game = None                 # Hangman game instance
players = {}                # Dictionary of [session_id:Player] currently connected

# Return True if the current player is a guesser, False if not
def is_guesser():
  global guesser
  assert request.sid is not None
  return guesser == request.sid

# Return True if the current player is a chooser, False if not
def is_chooser():
  global chooser
  assert request.sid is not None
  return chooser == request.sid

# Set the guesser back to PLAYER_NOT_CHOSEN, returns True if there was a
# guesser previously, False if not
def reset_guesser():
  # Reset roles in players dictionary
  global guesser
  global players
  if guesser != PLAYER_NOT_CHOSEN:
    assert guesser in players
    players[guesser].make_spectator()
    guesser = PLAYER_NOT_CHOSEN
    return True
  return False

# Set the chooser back to PLAYER_NOT_CHOSEN, returns True if there was a
# chooser previously, False if not
def reset_chooser():
  # Reset roles in players dictionary
  global chooser
  global players
  if chooser != PLAYER_NOT_CHOSEN:
    assert chooser in players
    players[chooser].make_spectator()
    chooser = PLAYER_NOT_CHOSEN
    return True
  return False

# Become the new guesser - assumes guesser was already reset
def become_guesser():
  global guesser
  global players
  assert guesser == PLAYER_NOT_CHOSEN
  guesser = request.sid
  assert guesser in players
  players[guesser].make_guesser()

# Become the new chooser - assumes chooser was already reset
def become_chooser():
  global chooser
  global players
  assert chooser == PLAYER_NOT_CHOSEN
  chooser = request.sid
  assert chooser in players
  players[chooser].make_chooser()

@app.route('/')
def display_page():
  isDebugMode = os.getenv('FLASK_DEBUG', 0) == 1
  return render_template('index.html', debug=isDebugMode)

@socketio.on('connection')
def handle_client_connection(json):
  print('Received connection from client (' + request.sid + ') with data: ' + json['data'])

  # Add the player to the players list
  assert request.sid is not None
  assert request.sid not in players
  players[request.sid] = Player(request.sid)

  emit('client_count', {'count': len(players)}, broadcast=True)

@socketio.on('disconnect')
def handle_client_disconnection():
  print('Received disconnection from client')

  # Delete the player from the players list
  assert request.sid is not None
  assert request.sid in players
  players.pop(request.sid, None)

  emit('client_count', {'count': len(players)}, broadcast=True)

@socketio.on('reset')
def reset_game_request():
  print('reset game')
  reset_guesser()
  reset_chooser()
  emit('reset', broadcast=True)

@socketio.on('become_chooser')
def become_chooser_request(name, phrase):
  # Reset the game
  game = Hangman(phrase)
  # Set the new chooser
  reset_chooser()
  become_chooser()

  print('The new chooser is: ' + players[chooser].name + " (" + chooser + ")")
  sendMessageBack('You were chosen as the chooser')
  # Also need to tell everyone else about new chooser (with name) and that the game was reset

@socketio.on('become_guesser')
def become_guesser_request():
  # Set the new guesser
  reset_guesser()
  become_guesser()

  print('The new guesser is: ' + players[guesser].name + " (" + guesser + ")")
  # Also need to tell everyone else about new guesser (with name)

if __name__ == '__main__':
  socketio.run(app)
