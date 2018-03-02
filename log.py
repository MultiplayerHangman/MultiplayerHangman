#
# Used to log things so that they are more visible
#

BLUE = '\033[94m'
GREEN = '\033[92m'
RED = '\033[91m'
BOLD = '\033[1m'
RESET = '\033[0m'

class Log:

  # Print a debug message
  @staticmethod
  def d(msg):
    print(BLUE + msg + RESET)

  # Print a log message
  @staticmethod
  def l(msg):
    print(GREEN + BOLD + msg + RESET)

  # Print an error message
  @staticmethod
  def e(msg):
    print(RED + BOLD + msg + RESET)
