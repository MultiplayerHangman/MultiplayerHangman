from flask import Flask, request, render_template
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
  print('Received connection from client (' + request.sid + ') with data: ' + str(json))

if __name__ == '__main__':
  socketio.run(app)
