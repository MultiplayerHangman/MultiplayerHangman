class TitleScreen {
  constructor() {
    const becomeChooserButton = $('#become-chooser');
    const becomeGuesserButton = $('#become-guesser');
    const submitButton = $('#submit');
  }

  enableChooserButton(enabled) {
    becomeGuesserButton.prop('disabled', !enabled);
  }

  test() {
    console.log('Hello world!');
  }
}
