# Multiplayer Hangman

A multiplayer hangman game using Python and Javascript :)


## Team members

- 🐹
- 🐼
- 🐵


## Initial Todo

*Client*

- [ ] Canvas for drawing the hangman
- [ ] Guess list: the phrase with underlines with letters filled in and the list of letters guessed
- [ ] Buttons for requesting to be the guesser or the chooser
- [ ] Button for resetting the game
- [ ] Way to enter the name of the player
- [ ] List of events that happened
- [ ] Way to enter a letter for a guess
- [ ] Design and layout the views

*Server*

- [ ] Logic for playing the game - construct with phrase and have a way to `guess` with a letter and find out if the letter was in the phrase, if it was a repeat, or if it's not in the phrase. There also needs to be a way to get the updated phrase returned to the client after the guess, as well as a way to know if the game has ended.
- [ ] Set guesser and phrase provider
- [ ] Set names for players
- [ ] Way to differentiate between players after getting WebSocket request
- [ ] Reset the game

*Other*

- [ ] Setup websocket connection between client and server


## Setup

Install the [GitHub desktop app](https://desktop.github.com)

Press the green "Clone or download" button on this page and then "Open in Desktop" to open the repository inside the app. Then you can download (copy) the repository to your computer.

Install `virtualenv`

```
sudo pip install virtualenv
```

Install [Flask](http://flask.pocoo.org/docs/0.12/installation/#installation)

```
. venv/bin/activate
pip install Flask
```


## Running

To start the server:

```
. venv/bin/activate
export FLASK_APP="server.py"
export FLASK_DEBUG=1
flask run
```

To open the webpage, go to:

```
http://localhost:5000
```

in a browser
