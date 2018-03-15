define(['require', 'jquery'], function (require, $) {

  'use strict';

  function Button(selector) {
    this.btn = $(selector); // Reference to the DOM object
  }

  // Choose whether to enable or disable a button
  Button.prototype.enable = function(shouldEnable) {
    this.btn.css('background-color', shouldEnable ? 'transparent' : 'rgb(100,100,100)');
    this.btn.prop('disabled', !shouldEnable);
  };

  //
  // Expose jQuery functions
  //
  // This is required to keep the "this" reference to jQuery
  // If we do ex. "this.click = this.btn.click" above, then the "this.on" inside jQuery
  // will refer to the Button's "this" instead of the jQuery "this"
  //
  Button.prototype.click = function(callback) { return this.btn.click(callback); };
  Button.prototype.hide = function() { return this.btn.hide(); };
  Button.prototype.show = function() { return this.btn.show(); };

  return Button;

});
