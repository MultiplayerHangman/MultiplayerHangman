from flask import Flask, render_template
from flask_socketio import SocketIO
from hangman import Hangman

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def hello():
  return render_template('index.html')

@socketio.on('connection')
def handle_client_connection(json):
  print('Received connection from client with data: ' + str(json))

if __name__ == '__main__':
    socketio.run(app)
