#
# A hangman game in progress
# Keeps track of the phrase to guess and what has been guessed
#

from log import Log

class Hangman:

  def __init__(self, phrase):
    # Set the phrase to guess
    self.phrase = phrase
    self.numChars = len(self.phrase)
    self.underlinePhrase = ""
    self.usedLetters = []

    for x in range(0, self.numChars - 1):
      if self.phrase[x] == " ":
        self.underlinePhrase = self.underlinePhrase + "  "
      else:
        self.underlinePhrase = self.underlinePhrase + "_ "

    if self.phrase[self.numChars - 1] == " ":
      self.underlinePhrase = self.underlinePhrase + " "
    else:
      self.underlinePhrase = self.underlinePhrase + "_"

  # Guess the letter
  def guess(self, letter):
    Log.d("Guessing the letter " + letter + " in " + self.phrase)
    self.userGuess = letter
    self.usedLetters.append(self.userGuess)

    for x in range(0, self.numChars):
      if self.phrase[x] == self.userGuess:
        self.underlinePhrase = self.underlinePhrase[:(2*x)] + self.userGuess + self.underlinePhrase[(2*x)+1:]

  def inPhrase(self, letter):
    for x in range(0, len(self.underlinePhrase)):
      if self.underlinePhrase[x] == letter:
        return True
    return False

  # Get the phrase back with underlines for what has not yet been guessed
  # Ex. for "hello world", and guesses "e", return ["_e___ _____"]
  def getCurrentlyDiscoveredPhrase(self):
    return self.underlinePhrase
  
  # Checks if the phrase has been successfully completed
  def isCompleted(self):
    for x in range(0, self.numChars):
      if self.underlinePhrase[x] == "_":
        return False
    return True

  # Return letters used
  def getUsedLetters(self):
    return self.usedLetters


# Used to test the class
if __name__ == '__main__':
  hm = Hangman(input("Enter phrase to guess: "))
  while (True):
    hm.guess(input("Enter letter: "))
    Log.d(hm.getCurrentlyCorrectPhrase())
