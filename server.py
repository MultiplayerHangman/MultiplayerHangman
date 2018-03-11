from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os
from game import Game, GameState
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
  emit('change_gamestate', {'gamestate': game.game_state})
  emit('update_titlescreen', {'guess_disable': game.is_guesser_set(),
                              'choose_disable': game.is_chooser_set()})
  emit('update_gamescreen', {'guesser_name': game.get_name(game.guesser),
                             'chooser_name': game.get_name(game.chooser),
                             'round': game.round})
  emit('discovered_phrase', {'discovered_phrase': game.hangman.underlinePhrase,
                             'phrase_completed': game.is_completed(),
                             'letters_used': game.letters_guessed,
                             'misses': game.phrase_misses})


@socketio.on('disconnect')
def handle_client_disconnection():
  Log.d('Received disconnection from client (' + request.sid + ')')

  # Delete the player from the players list
  assert request.sid is not None
  game.remove_player(request.sid)

  emit('change_gamestate', {'gamestate': game.game_state})
  emit('update_titlescreen', {'guess_disable': game.is_guesser_set(),
                              'choose_disable': game.is_chooser_set()}, broadcast=True)
  emit('update_gamescreen', {'guesser_name': game.get_name(game.guesser),
                             'chooser_name': game.get_name(game.chooser),
                             'round': game.round}, broadcast=True)



@socketio.on('reset_titlescreen')
def reset_titlescreen_request(player_type):
  Log.l('Titlescreen has been reset')
  assert request.sid is not None

  emit('external_reset', {'type_enable': game.reset_type(request.sid)}, broadcast=True)
  emit('external_reset', {'type_enable': game.reset_opposite_type(request.sid)})

  if (player_type['reset_type'] == "chooser"):
    game.reset_chooser()
  elif (player_type['reset_type'] == "guesser"):
    game.reset_guesser()
  game.reset_name(request.sid)

  game.players[request.sid].make_spectator()


@socketio.on('become_chooser')
def become_chooser(name):
  # Set the new chooser
  assert request.sid is not None
  # game.reset_chooser()
  game.set_chooser(request.sid,name['username'])
  emit('chooser_feedback', {'chooser_confirmed': game.is_chooser_set()}, broadcast=True)

  Log.l('The new chooser is: ' + game.get_name(request.sid) + " (" + request.sid + ")")

  if game.players_ready():
    game.game_state = GameState.LOADING_SCREEN
    emit('change_gamestate', {'gamestate': game.game_state}, broadcast=True)
    Log.l('The game is now in its loading phase')


@socketio.on('become_guesser')
def become_guesser(name):
  # Set the new guesser
  assert request.sid is not None
  # game.reset_guesser()
  game.set_guesser(request.sid,name['username'])
  emit('guesser_feedback', {'guesser_confirmed': game.is_guesser_set()}, broadcast=True)

  Log.l('The new guesser is: ' + game.get_name(request.sid) + " (" + request.sid + ")")

  if game.players_ready():
    game.gamestate = GameState.LOADING_SCREEN
    emit('change_gamestate', {'gamestate': game.game_state}, broadcast=True)
    Log.l('The game is now in its loading phase')


@socketio.on('submit_secret_phrase')
def phrase_submit(phrase):
  game.set_phrase(phrase['secret'])

  game.game_state = GameState.GAME_SCREEN
  game.round = 1

  emit('change_gamestate', {'gamestate': game.game_state}, broadcast=True)
  emit('update_gamescreen', {'guesser_name': game.get_name(game.guesser),
                             'chooser_name': game.get_name(game.chooser),
                             'round': game.round}, broadcast=True)
  emit('discovered_phrase', {'discovered_phrase': game.hangman.underlinePhrase,
                             'phrase_completed': False,
                             'letters_used': game.letters_guessed,
                             'misses': game.phrase_misses}, broadcast=True)

  Log.l('Secret phrase has been chosen')


@socketio.on('guess_letter')
def current_phrase(phrase):
  if game.hangman.inPhrase(phrase['letter']) == False:
    game.phrase_misses += 1
  game.hit_constrain(game.phrase_misses)
  emit('discovered_phrase', {'discovered_phrase': game.guess_letter(phrase['letter']),
                             'phrase_completed': game.is_completed(),
                             'letters_used': game.letters_guessed,
                             'misses': game.phrase_misses}, broadcast=True)

  Log.l('A letter has been guessed')


if __name__ == '__main__':
  socketio.run(app)


#@socketio.on('start_game')
#def start_game():
    #all players are set, change to corresponding user display_page
