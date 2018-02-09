class Hangman:

  def __init__(self, phrase):
    # Set the phrase to guess
    self.phrase = phrase

  # Guess the letter
  def guess(self, letter):
    print("Guessing the letter " + letter + " in " + self.phrase)

  # Get the phrase back with underlines for what has not yet been guessed
  # Ex. for "hello world", and guesses "e", return ["_e___ _____"]
  def getCurrentlyCorrectPhrase(self):
    return "_____ _____"

if __name__ == '__main__':
  hm = Hangman(raw_input("Enter phrase to guess: "))
  while (True):
    hm.guess(raw_input("Enter letter: "))
    hm.getCurrentlyCorrectPhrase()
