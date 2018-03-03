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
  emit('client_count', {'count': game.count_players()}, broadcast=True)

@socketio.on('disconnect')
def handle_client_disconnection():
  Log.d('Received disconnection from client')

  # Delete the player from the players list
  assert request.sid is not None
  game.remove_player(request.sid)

  emit('client_count', {'count': game.count_players()}, broadcast=True)

@socketio.on('reset_titlescreen')
def reset_game_request():
  Log.l('Titlescreen has been reset')
  assert request.sid is not None
  game.reset(request.sid)
  emit('reset_titlescreen', broadcast=True)

@socketio.on('become_chooser')
def become_chooser(name):
  # Set the new chooser
  assert request.sid is not None
  # game.reset_chooser()
  game.set_chooser(request.sid,name['username'])
  emit('chooser_feedback', {'chooser_confirmed': game.is_chooser_set()})

  Log.l('The new chooser is: ' + game.get_name(request.sid) + " (" + request.sid + ")")
  # Also need to tell everyone else about new chooser (with name) and that the game was reset

@socketio.on('become_guesser')
def become_guesser(name):
  # Set the new guesser
  assert request.sid is not None
  # game.reset_guesser()
  game.set_guesser(request.sid,name['username'])
  emit('guesser_feedback', {'guesser_confirmed': game.is_guesser_set()})

  Log.l('The new guesser is: ' + game.get_name(request.sid) + " (" + request.sid + ")")
  # Also need to tell everyone else about new guesser (with name)

if __name__ == '__main__':
  socketio.run(app)

#@socketio.on('start_game')
#def start_game():
    #all players are set, change to corresponding user display_page
