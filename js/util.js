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
    getRandomFromArray: function (data) {
      return data[Math.floor(Math.random() * data.length)];
    },
    getRandomInRange: function (min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    },
    // Fisher-Yates shuffle
    shuffle: function (data) {
      for (var i = data.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));

        var temp = data[i];
        data[i] = data[j];
        data[j] = temp;
      }
    },
    clearElementContent: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },
    findSameInArray: function (data) {
      var foundSame = false;
      for (var i = 0; i < data.length; i++) {
        for (var j = i + 1; j < data.length; j++) {
          if (data[i] === data[j]) {
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
      var errorInnerElement = errorElement.querySelector('.error__inner');
      var errorTitleElement = errorElement.querySelector('.error__title');
      var errorButtonElements = errorElement.querySelectorAll('.error__button');

      var onErrorElementEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          errorElement.remove();
          document.removeEventListener('keydown', onErrorElementEscPress);
        });
      };

      errorElement.style.zIndex = '3';
      errorTitleElement.style.lineHeight = '1.5';
      document.querySelector('main').append(errorElement);

      for (var i = 0; i < errorButtonElements.length; i++) {
        errorButtonElements[i].addEventListener('click', function () {
          errorElement.remove();
        });
      }
      document.addEventListener('keydown', onErrorElementEscPress);
      errorInnerElement.addEventListener('click', function (evt) {
        evt.stopPropagation();
      });
      errorElement.addEventListener('click', function () {
        errorElement.remove();
      });

      return errorElement;
    },
    createLoadSuccessElement: function () {
      var successElement = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
      var successInnerElement = successElement.querySelector('.success__inner');
      var successTitleElement = successElement.querySelector('.success__title');
      var successButtonElements = successElement.querySelectorAll('.success__button');

      var onSuccessElementEscPress = function (evt) {
        window.util.isEscEvent(evt, function () {
          successElement.remove();
          document.removeEventListener('keydown', onSuccessElementEscPress);
        });
      };

      successElement.style.zIndex = '3';
      successTitleElement.style.lineHeight = '1.5';
      document.querySelector('main').append(successElement);

      for (var i = 0; i < successButtonElements.length; i++) {
        successButtonElements[i].addEventListener('click', function () {
          successElement.remove();
        });
      }
      document.addEventListener('keydown', onSuccessElementEscPress);
      successInnerElement.addEventListener('click', function (evt) {
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
