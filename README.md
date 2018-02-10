# Multiplayer Hangman

```
  ______
 |      |
 |  ¯\_(ツ)_/¯
 |      |
 |     / \
 |
---------------
```

A multiplayer hangman game using Python and Javascript :)


## Team members

- 🐹 (@TeresaTXCA)
- Eric (@Exxliang)
- Alex (@alextwin)


## Initial Todo

*Client* (Javascript, HTML, CSS)

- [ ] Canvas for drawing the hangman - @alextwin
- [ ] Guess list: the phrase with underlines with letters filled in and the list of letters guessed
- [ ] Buttons for requesting to be the guesser or the chooser
- [ ] Button for resetting the game
- [ ] Way to enter the name of the player
- [ ] List of events that happened
- [ ] Way to enter a letter for a guess
- [ ] Design and layout the views

⚠️ When you change JS/CSS, make sure to **refresh while holding the Shift button**! Otherwise the files may be cached by the browser and **you will not see the updates**.

*Server* (Python)

- [ ] Logic for playing the game - construct with phrase and have a way to `guess` with a letter and find out if the letter was in the phrase, if it was a repeat, or if it's not in the phrase. There also needs to be a way to get the updated phrase returned to the client after the guess, as well as a way to know if the game has ended.
- [ ] Set guesser and phrase provider
- [ ] Set names for players
- [ ] Way to differentiate between players after getting WebSocket request
- [ ] Reset the game

*Other*

- [ ] Setup websocket connection between client and server


## Running

For setup instructions, go to [SETUP](https://github.com/MultiplayerHangman/MultiplayerHangman/blob/master/SETUP.md)

In a new Terminal/Command Prompt,

**Step 1**: Get to the project folder

*On Mac*

```
cd ~/Documents/GitHub/MultiplayerHangman
```

*On Windows*

```
cd Documents\GitHub\MultiplayerHangman
```

**Step 2**: Start the server

*On Mac*

```
. venv/bin/activate
export FLASK_APP="server.py"
export FLASK_DEBUG=1
flask run
```

*On Windows*

```
venv\Scripts\activate
set FLASK_APP=server.py
set FLASK_DEBUG=1
flask run
```

**Step 3**: Open the webpage

In a browser, go to:

```
http://localhost:5000
```


## Project files

These are the files you need to change when you want to make changes.

```
MultiplayerHangman/      (project folder)
|
├── server.py            (Python server)
├── static/
|   └── js/
|       └── hangman.js   (Javascript loaded on website)
|   └── css/
|       └── hangman.css  (CSS loaded on website)
└── templates/
    └── index.html       (HTML loaded on website)
```
