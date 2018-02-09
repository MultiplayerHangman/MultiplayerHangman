# Setup

**Step 1**: Install the [GitHub desktop app](https://desktop.github.com)

**Step 2**: Press the green "Clone or download" button at the top of this page and then "Open in Desktop" to open the repository inside the app. Then you can clone (download) the repository to your computer.

**Step 3**: After you clone the repository, open up the Terminal (Mac) or Command Prompt (Windows) and go to where you copied the project

*On Mac*

```
cd ~/Documents/GitHub/MultiplayerHangman
```

*On Windows*

```
cd \Documents\GitHub\MultiplayerHangman
```

`cd` is `change directory`

*If you want a very basic overview of the Terminal, you can check [this](http://blog.teamtreehouse.com/introduction-to-the-mac-os-x-command-line)*

**Step 4**: Install `virtualenv`

```
sudo pip install virtualenv
```

If you get an error about not having `pip`, you can install it following the instructions [here](https://pip.pypa.io/en/stable/installing/)

**Step 5**: Create the virtual environment

```
virtualenv venv
```

The [virtual environment](https://virtualenv.pypa.io/en/stable/) is used so that different Python projects can use different libaries without problems.

**Step 6**: Install [Flask](http://flask.pocoo.org/docs/0.12/installation/#installation)

*On Mac*

```
. venv/bin/activate
pip install -r requirements.txt
```

*On Windows*

```
venv\Scripts\activate
pip install -r requirements.txt
```

**Step 7**: Celebrate 🎉

Try running the project by following the [README](https://github.com/MultiplayerHangman/MultiplayerHangman/blob/master/README.md)!
