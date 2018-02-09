class Hangman:

  def __init__(self, phrase):
    # Set the phrase to guess
    self.phrase = phrase
    self.numChars = len(self.phrase)
    self.underlinePhrase = ""
    
    for x in range(0, self.numChars):
        if self.phrase[x] == " ":
            self.underlinePhrase = self.underlinePhrase + " "
        else:
            self.underlinePhrase = self.underlinePhrase + "_"
            
            
  # Guess the letter
  def guess(self, letter):
    print("Guessing the letter " + letter + " in " + self.phrase)

  # Get the phrase back with underlines for what has not yet been guessed
  # Ex. for "hello world", and guesses "e", return ["_e___ _____"]
  def getCurrentlyCorrectPhrase(self):
    return self.underlinePhrase

if __name__ == '__main__':
  hm = Hangman(input("Enter phrase to guess: "))
  while (True):
    hm.guess(input("Enter letter: "))
    print(hm.getCurrentlyCorrectPhrase())
