# Multiplayer Hangman

A multiplayer hangman game using Python and Javascript :)


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
