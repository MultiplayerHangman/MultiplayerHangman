define(['require', 'jquery'], function (require, $) {

  'use strict';

  class Button {

    constructor(selector) {
      this.btn = $(selector); // Reference to the DOM object
    }

    // Choose whether to enable or disable a button
    enable(shouldEnable) {
      this.btn.css('background-color', shouldEnable ? 'transparent' : 'rgb(100,100,100)');
      this.btn.prop('disabled', !shouldEnable);
    }

    //
    // Expose jQuery functions
    //
    // This is required to keep the "this" reference to jQuery
    // If we do ex. "this.click = this.btn.click" above, then the "this.on" inside jQuery
    // will refer to the Button's "this" instead of the jQuery "this"
    //
    click(callback) { return this.btn.click(callback); };
    hide() { return this.btn.hide(); };
    show() { return this.btn.show(); };

  }

  return Button;

});
