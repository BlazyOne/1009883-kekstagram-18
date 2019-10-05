'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.util = {
    ESC_KEYCODE: ESC_KEYCODE,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    getRandomFromArray: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    },
    getRandomInRange: function (min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    },
    // Fisher-Yates shuffle
    shuffle: function (arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));

        var t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
    },
    clearElementContent: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    findSameInArray: function (arr) {
      var foundSame = false;
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i] === arr[j]) {
            foundSame = true;
          }
        }
      }
      return foundSame;
    },
    clearValue: function (element) {
      element.value = null;
    },
    createLoadErrorElement: function () {
      var errorElement = document.querySelector('#error').content.querySelector('.error');
      document.querySelector('main').append(errorElement);
      return errorElement;
    }
  };
})();
