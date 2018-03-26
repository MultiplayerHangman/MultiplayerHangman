from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os
from game import Game, GameState
from log import Log

app = Flask(__name__)
socketio = SocketIO(app)
game = Game()


#
# Messages sent from server to client
#

# Change the users' screen
def change_game_state(game_state=None, broadcast=False):
  if game_state is not None:
    game.game_state = game_state
  emit('change_gamestate', {'gamestate': game.game_state}, broadcast=broadcast)

# Enable/disable buttons on the title screen
def update_title_screen(broadcast=False):
  emit(
    'update_titlescreen',
    {'guess_disable': game.is_guesser_set(), 'choose_disable': game.is_chooser_set()},
    broadcast=broadcast)

# Update the props of the games creen
def update_game_screen(broadcast=False):
  emit(
    'update_gamescreen',
    {'guesser_name': game.get_name(game.guesser),
     'chooser_name': game.get_name(game.chooser),
     'guesser_score': game.get_score(game.guesser),
     'chooser_score': game.get_score(game.chooser),
     'round': game.round},
    broadcast=broadcast)

# Update the hangman game's game state after a guess
def discovered_phrase(broadcast=False):
  emit(
    'discovered_phrase',
    {'discovered_phrase': game.get_currently_discovered_phrase(),
     'phrase_completed': game.is_completed(),
     'letters_used': game.letters_guessed,
     'misses': game.phrase_misses},
    broadcast=broadcast)

# Reset the user's choice (guesser/chooser) from the title screen
# type_enable is whether players are able to choose the 
def reset_player(player_type, broadcast=False):
  emit(
    'external_reset',
    {'type_enable': player_type},
    broadcast=broadcast)

# Tell clients whether or not the chooser was chosen
def chooser_feedback(chooser_confirmed, broadcast=False):
  emit('chooser_feedback', {'chooser_confirmed': game.is_chooser_set()}, broadcast=broadcast)

# Tell clients whether or not the guesser was chosen
def guesser_feedback(guesser_confirmed, broadcast=False):
  emit('guesser_feedback', {'guesser_confirmed': game.is_guesser_set()}, broadcast=broadcast)


#
# Socket events
#

@socketio.on('connection')
def handle_client_connection(json):
  Log.d('Received connection from client (' + request.sid + ') with data: ' + json['data'])

  # Add the player to the players list
  assert request.sid is not None
  game.add_player(request.sid)
  # Set the player as spectator by default
  game.set_spectator(request.sid)

  # Send the state information required for a connecting client to first render the page
  change_game_state()
  update_title_screen()
  update_game_screen()
  discovered_phrase()


@socketio.on('disconnect')
def handle_client_disconnection():
  Log.d('Received disconnection from client (' + request.sid + ')')

  # Delete the player from the players list
  assert request.sid is not None
  game.remove_player(request.sid)

  # Tell the other clients that the player left
  change_game_state(broadcast=True)
  update_title_screen(broadcast=True)
  update_game_screen(broadcast=True)

  # TODO: We probably want to handle some case here if the chooser/guesser
  # leaves mid-game


@socketio.on('reset_titlescreen')
def reset_titlescreen_request(player_type):
  Log.l('Titlescreen has been reset')
  assert request.sid is not None

  reset_player(player_type=game.get_player_type(request.sid), broadcast=True)
  reset_player(player_type=game.get_opposite_player_type(request.sid))

  if (player_type['reset_type'] == 'chooser'):
    game.reset_chooser()
  elif (player_type['reset_type'] == 'guesser'):
    game.reset_guesser()
  game.reset_name(request.sid)

  game.players[request.sid].make_spectator()


@socketio.on('become_chooser')
def become_chooser(name):
  # Set the new chooser
  assert request.sid is not None
  assert name is not None
  assert 'username' in name
  # game.reset_chooser()
  game.set_chooser(request.sid, name['username'])
  chooser_feedback(game.is_chooser_set(), broadcast=True)

  Log.l('The new chooser is: ' + game.get_name(request.sid) + ' (' + request.sid + ')')

  if game.players_ready():
    change_game_state(GameState.LOADING_SCREEN, broadcast=True)
    Log.l('The game is now in its loading phase')


@socketio.on('become_guesser')
def become_guesser(name):
  # Set the new guesser
  assert request.sid is not None
  assert name is not None
  assert 'username' in name
  game.set_guesser(request.sid, name['username'])
  guesser_feedback(game.is_guesser_set(), broadcast=True)

  Log.l('The new guesser is: ' + game.get_name(request.sid) + ' (' + request.sid + ')')

  if game.players_ready():
    change_game_state(GameState.LOADING_SCREEN, broadcast=True)
    Log.l('The game is now in its loading phase')


@socketio.on('submit_secret_phrase')
def phrase_submit(phrase):
  # Update the new phrase
  assert phrase is not None
  assert 'secret' in phrase
  game.set_phrase(phrase['secret'])

  game.round += 1

  change_game_state(GameState.GAME_SCREEN, broadcast=True)
  update_game_screen(broadcast=True)
  discovered_phrase(broadcast=True)

  Log.l('Secret phrase has been chosen')


@socketio.on('guess_letter')
def current_phrase(phrase):
  assert phrase is not None
  assert 'letter' in phrase

  if game.hangman.inPhrase(phrase['letter']) == False:
    game.phrase_misses += 1
  game.hit_constrain(game.phrase_misses)
  game.guess_letter(phrase['letter'])
  discovered_phrase(broadcast=True)

  Log.l('A letter has been guessed: ' + phrase['letter'])


@socketio.on('prepare_next_round')
def prepare_next_round(json):
  assert game.is_completed()
  game.swap_players()
  game.prepare_next_round()
  change_game_state(GameState.LOADING_SCREEN, broadcast=True)
  update_game_screen(broadcast=True)


@socketio.on('reset_game')
def reset(json):
  game.reset()
  emit('reset_game', {}, broadcast=True)
  # change_game_state(GameState.TITLE_SCREEN, broadcast=True)
  update_title_screen(broadcast=True)



#
# HTTP requests
#

@app.route('/')
def display_page():
  isDebugMode = os.getenv('FLASK_DEBUG', 0) == 1
  return render_template('index.html', debug=isDebugMode)


#
# Main
#

if __name__ == '__main__':
  Log.e('DO NOT RUN THE SERVER THIS WAY')
  Log.e('Use \'flask start\' or run \'./start\' (see README.md)')
  socketio.run(app)
