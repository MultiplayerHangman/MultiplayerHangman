from flask import Flask, request, render_template
from flask_socketio import SocketIO, emit
import os
from hangman import Hangman
clients = []


app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def hello():
  isDebugMode = os.getenv('FLASK_DEBUG', 0) == 1
  return render_template('index.html', debug=isDebugMode)

@socketio.on('connection')
def handle_client_connection(json):
  print('Received connection from client (' + request.sid + ') with data: ' + json['data'])
  
  clients.append(request.namespace)
  emit('client_count', {'count': len(clients)}, broadcast=True)

@socketio.on('disconnect')
def handle_client_disconnection():
  print('Received disconnection from client')

  clients.remove(request.namespace)
  emit('client_count', {'count': len(clients)}, broadcast=True)

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
