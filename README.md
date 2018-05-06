# Multiplayer Hangman

![](https://github.com/MultiplayerHangman/MultiplayerHangman/raw/master/Resources/screenshot.png)

A multiplayer hangman game using Python and Javascript. For [Side Project Club](https://www.facebook.com/sideprojectclub/) in Winter 2018 at the University of Waterloo.

Video demo: [https://www.youtube.com/watch?v=hay36VJ2_Xw](https://www.youtube.com/watch?v=hay36VJ2_Xw)


## Team members

- Teresa (@TeresaTXCA)
- Eric (@Exxliang)
- Alex (@alextwin)


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

⚠️ When you change JS/CSS, make sure to **refresh while holding the Shift button**! Otherwise the files may be cached by the browser and **you will not see the updates**.


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


## Game flow

![](https://github.com/MultiplayerHangman/MultiplayerHangman/raw/master/Resources/gameflow.png)
