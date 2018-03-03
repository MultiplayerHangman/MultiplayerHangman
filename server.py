from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os
from game import Game
from log import Log

app = Flask(__name__)
socketio = SocketIO(app)
game = Game()

@app.route('/')
def display_page():
  isDebugMode = os.getenv('FLASK_DEBUG', 0) == 1
  return render_template('index.html', debug=isDebugMode)


@socketio.on('connection')
def handle_client_connection(json):
  Log.d('Received connection from client (' + request.sid + ') with data: ' + json['data'])

  # Add the player to the players list
  assert request.sid is not None
  game.add_player(request.sid)
  # Set the player as spectator by default
  game.set_spectator(request.sid)
  emit('update', {'guess_disable': game.is_guesser_set(),
  				  'choose_disable': game.is_chooser_set(),
  				  'gamestate': game.gamestate}, broadcast=True)


@socketio.on('disconnection')
def handle_client_disconnection():
  Log.d('Received disconnection from client (' + request.sid + ')')

  # Delete the player from the players list
  assert request.sid is not None
  game.remove_player(request.sid)

  emit('update', {'guess_disable': game.is_guesser(request.sid),
  				  'choose_disable': game.is_chooser(request.sid),
  				  'gamestate': game.gamestate}, broadcast=True)


@socketio.on('reset_titlescreen')
def reset_titlescreen_request(player_type):
  Log.l('Titlescreen has been reset')
  assert request.sid is not None

  emit('external_reset', {'type_enable': game.reset_players(request.sid)}, broadcast=True)

  if (player_type['reset_type'] == "chooser"):
  	game.set_chooser("PLAYER_NOT_CHOSEN","Anonymous")
  elif (player_type['reset_type'] == "guesser"):
  	game.set_guesser("PLAYER_NOT_CHOSEN","Anonymous")
  
  game.players[request.sid].make_spectator()
  

@socketio.on('become_chooser')
def become_chooser(name):
  # Set the new chooser
  assert request.sid is not None
  # game.reset_chooser()
  game.set_chooser(request.sid,name['username'])
  emit('chooser_feedback', {'chooser_confirmed': game.is_chooser_set(), 'choose_disable': True})
  emit('chooser_feedback', {'chooser_confirmed': False, 'choose_disable': True}, broadcast=True)

  Log.l('The new chooser is: ' + game.get_name(request.sid) + " (" + request.sid + ")")

  if game.players_ready():
  	emit('change_gamestate', {'gamestate': "loadingscreen"}, broadcast=True)
  	game.gamestate = "loadingscreen"
  	Log.l('The game is now in its loading phase')


@socketio.on('become_guesser')
def become_guesser(name):
  # Set the new guesser
  assert request.sid is not None
  # game.reset_guesser()
  game.set_guesser(request.sid,name['username'])
  emit('guesser_feedback', {'guesser_confirmed': game.is_guesser_set(), 'guess_disable': True})
  emit('guesser_feedback', {'guesser_confirmed': False, 'guess_disable': True}, broadcast=True)

  Log.l('The new guesser is: ' + game.get_name(request.sid) + " (" + request.sid + ")")

  if game.players_ready():
  	emit('change_gamestate', {'gamestate': "loadingscreen"}, broadcast=True)
  	game.gamestate = "loadingscreen"
  	Log.l('The game is now in its loading phase')


if __name__ == '__main__':
  socketio.run(app)

#@socketio.on('start_game')
#def start_game():
    #all players are set, change to corresponding user display_page
