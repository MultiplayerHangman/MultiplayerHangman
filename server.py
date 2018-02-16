from flask import Flask, render_template
from flask_socketio import SocketIO
import os
from hangman import Hangman

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def hello():
  isDebugMode = os.getenv('FLASK_DEBUG', 0) == 1
  return render_template('index.html', debug=isDebugMode)

@socketio.on('connection')
def handle_client_connection(json):
  print('Received connection from client with data: ' + str(json))

@socketio.on('Reset')
def reset_game():
  print('reset game')

@socketio.on('Become Chooser')
def become_chooser():
  print('become chooser')

@socketio.on('Become Guesser')
def become_guesser():
  print('become guesser')


if __name__ == '__main__':
  socketio.run(app)
