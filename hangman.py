class Hangman:

  def __init__(self, phrase):
    # Set the phrase to guess
    self.phrase = phrase

  # Guess the letter
  def guess(self, letter):
    print("Guessing the letter " + letter + " in " + self.phrase)

  # Get the phrase back with underlines for what has not yet been guessed
  # Ex. for "hello world", and guesses "e", return ["_e___ _____"]
  def getCurrentlyCorrectPhrase():
    return "_____ _____"
