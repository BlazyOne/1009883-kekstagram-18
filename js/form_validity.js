'use strict';

(function () {
  var HASHTAG_MAX_NUMBER = 5;
  var HASHTAG_MAX_LENGTH = 20;
  var DESCRIPTION_MAX_LENGTH = 140;

  var hashtagsInputElement = window.formPicture.uploadOverlayElement.querySelector('.text__hashtags');
  var descriptionInputElement = window.formPicture.uploadOverlayElement.querySelector('.text__description');

  var checkHashtagValidity = function () {
    var hashtagString = hashtagsInputElement.value;
    hashtagString = hashtagString.toLowerCase();
    var hashtagArray = hashtagString.split(' ');
    var validityMessage = '';

    for (var i = 0; i < hashtagArray.length; i++) {
      if ((hashtagArray[i].indexOf(',') > -1 || hashtagArray[i].indexOf(';') > -1) && !isSpaces) {
        validityMessage += 'Хэштеги должны разделяться пробелами. ';
        var isSpaces = true;
      }
      if (hashtagArray[i][0] !== '#' && !isNoHashSign) {
        validityMessage += 'Хэш-тег должен начинаться с символа #. ';
        var isNoHashSign = true;
      }
      if (hashtagArray[i].length === 1 && !isOneCharacterLength) {
        validityMessage += 'Хеш-тег не может состоять только из одной решётки. ';
        var isOneCharacterLength = true;
      }
      if (window.util.findSameInArray(hashtagArray) && !isSameInArray) {
        validityMessage += 'Один и тот же хэш-тег не может быть использован дважды. ';
        var isSameInArray = true;
      }
      if (hashtagArray.length > HASHTAG_MAX_NUMBER && !isMoreThanMaxHashtagNumber) {
        validityMessage += 'Нельзя указать больше ' + HASHTAG_MAX_NUMBER + ' хэш-тегов. ';
        var isMoreThanMaxHashtagNumber = true;
      }
      if (hashtagArray[i].length > HASHTAG_MAX_LENGTH && !isMoreThanMaxHashtagLength) {
        validityMessage += 'Максимальная длина одного хэш-тега ' + HASHTAG_MAX_LENGTH + ' символов, включая решётку. ';
        var isMoreThanMaxHashtagLength = true;
      }
    }

    hashtagsInputElement.setCustomValidity(validityMessage);
  };

  var checkDescriptionValidity = function () {
    if (descriptionInputElement.value.length > DESCRIPTION_MAX_LENGTH) {
      descriptionInputElement.setCustomValidity('длина комментария не может составлять больше 140 символов');
    } else {
      descriptionInputElement.setCustomValidity('');
    }
  };

  hashtagsInputElement.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, function () {
      evt.stopPropagation();
    });
  });

  descriptionInputElement.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, function () {
      evt.stopPropagation();
    });
  });

  hashtagsInputElement.addEventListener('input', function () {
    checkHashtagValidity();
  });

  descriptionInputElement.addEventListener('input', function () {
    checkDescriptionValidity();
  });
})();
