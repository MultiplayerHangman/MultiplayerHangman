#
# Used to log things so that they are more visible
#

import os

BLUE = '\033[94m'
GREEN = '\033[92m'
RED = '\033[91m'
BOLD = '\033[1m'
RESET = '\033[0m'

def is_windows():
  # Windows Command Prompt does not seem to parse the formatting code
  # so we need to disable printing those on Windows
  return os.name == 'nt'

class Log:

  # Print a debug message
  @staticmethod
  def d(msg):
    if is_windows():
      print(msg)
    else:
      print(BLUE + msg + RESET)

  # Print a log message
  @staticmethod
  def l(msg):
    if is_windows():
      print(msg)
    else:
      print(GREEN + BOLD + msg + RESET)

  # Print an error message
  @staticmethod
  def e(msg):
    if is_windows():
      print(msg)
    else:
      print(RED + BOLD + msg + RESET)
