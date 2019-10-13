'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

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
      var errorElement = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
      var errorInner = errorElement.querySelector('.error__inner');
      var errorTitle = errorElement.querySelector('.error__title');
      var errorButtons = errorElement.querySelectorAll('.error__button');

      var onErrorElementEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          errorElement.remove();
          document.removeEventListener('keydown', onErrorElementEscPress);
        });
      };

      errorElement.style.zIndex = '3';
      errorTitle.style.lineHeight = '1.5';
      document.querySelector('main').append(errorElement);

      for (var i = 0; i < errorButtons.length; i++) {
        errorButtons[i].addEventListener('click', function () {
          errorElement.remove();
        });
      }
      document.addEventListener('keydown', onErrorElementEscPress);
      errorInner.addEventListener('click', function (evt) {
        evt.stopPropagation();
      });
      errorElement.addEventListener('click', function () {
        errorElement.remove();
      });

      return errorElement;
    },
    createLoadSuccessElement: function () {
      var successElement = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
      var successInner = successElement.querySelector('.success__inner');
      var successTitle = successElement.querySelector('.success__title');
      var successButtons = successElement.querySelectorAll('.success__button');

      var onSuccessElementEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          successElement.remove();
          document.removeEventListener('keydown', onSuccessElementEscPress);
        });
      };

      successElement.style.zIndex = '3';
      successTitle.style.lineHeight = '1.5';
      document.querySelector('main').append(successElement);

      for (var i = 0; i < successButtons.length; i++) {
        successButtons[i].addEventListener('click', function () {
          successElement.remove();
        });
      }
      document.addEventListener('keydown', onSuccessElementEscPress);
      successInner.addEventListener('click', function (evt) {
        evt.stopPropagation();
      });
      successElement.addEventListener('click', function () {
        successElement.remove();
      });

      return successElement;
    },
    debounce: function (cb) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          clearTimeout(lastTimeout);
        }
        lastTimeout = setTimeout(function () {
          cb.apply(null, parameters);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
