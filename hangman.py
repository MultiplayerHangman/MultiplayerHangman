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
    self.numLives = 9

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
    self.userGuess = letter.upper()
    self.usedLetters.append(self.userGuess)

    if self.inPhrase(self.userGuess) == False:
        self.numLives = self.numLives - 1

    for x in range(0, self.numChars):
      if self.phrase[x].upper() == self.userGuess.upper():
        self.underlinePhrase = self.underlinePhrase[:(2*x)] + self.phrase[x] + self.underlinePhrase[(2*x)+1:]

  def inPhrase(self, letter):
    for x in range(0, self.numChars):
      if self.phrase[x].upper() == letter:
        return True
    return False

  # Get the phrase back with underlines for what has not yet been guessed
  # Ex. for "hello world", and guesses "e", return ["_e___ _____"]
  def getCurrentlyDiscoveredPhrase(self):
    return self.underlinePhrase
  
  # Checks if the phrase has been successfully completed
  def isCompleted(self):
    for x in range(0, len(self.underlinePhrase)):
      if self.underlinePhrase[x] == "_":
        return False
    return True

  # Return letters used
  def getUsedLetters(self):
    return self.usedLetters

  def getNumLives(self):
    return self.numLives

# Used to test the class
if __name__ == '__main__':
  hm = Hangman(raw_input("Enter phrase to guess: "))
  while (True):
    lettersUsed = hm.getUsedLetters()
    numLives = hm.getNumLives()
    if numLives == 0:
        Log.d("Game Over")
        break
    elif hm.isCompleted() == True:
        Log.d("You win!")
        break

    repeatLetter = False
    print "Used letters: ",
    for x in range(0, len(lettersUsed)):
        print lettersUsed[x],

    print
    Log.d("Lives remaining: " + str(numLives))
    guessedLetter = raw_input("Enter letter: ")
    for x in range(0, len(lettersUsed)):
        if guessedLetter.upper() == lettersUsed[x].upper():
            repeatLetter = True
            break
    if repeatLetter == True:
        Log.d("This letter has been used already")
        continue
    else:
        hm.guess(guessedLetter)
    Log.d(hm.getCurrentlyDiscoveredPhrase())

