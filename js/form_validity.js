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
    var hashtags = hashtagString.split(' ');
    var validityMessage = '';
    var isSpaces = false;
    var isNoHashSign = false;
    var isOneCharacterLength = false;
    var isSameInArray = false;
    var isMoreThanMaxHashtagNumber = false;
    var isMoreThanMaxHashtagLength = false;

    hashtags.forEach(function (it) {
      if ((it.indexOf(',') > -1 || it.indexOf(';') > -1) && !isSpaces) {
        validityMessage += 'Хэштеги должны разделяться пробелами. ';
        isSpaces = true;
      }
      if (it[0] !== '#' && !isNoHashSign && it[0]) {
        validityMessage += 'Хэш-тег должен начинаться с символа #. ';
        isNoHashSign = true;
      }
      if (it.length === 1 && !isOneCharacterLength) {
        validityMessage += 'Хеш-тег не может состоять только из одной решётки. ';
        isOneCharacterLength = true;
      }
      if (window.util.findSameInArray(hashtags) && !isSameInArray) {
        validityMessage += 'Один и тот же хэш-тег не может быть использован дважды. ';
        isSameInArray = true;
      }
      if (hashtags.length > HASHTAG_MAX_NUMBER && !isMoreThanMaxHashtagNumber) {
        validityMessage += 'Нельзя указать больше ' + HASHTAG_MAX_NUMBER + ' хэш-тегов. ';
        isMoreThanMaxHashtagNumber = true;
      }
      if (it.length > HASHTAG_MAX_LENGTH && !isMoreThanMaxHashtagLength) {
        validityMessage += 'Максимальная длина одного хэш-тега ' + HASHTAG_MAX_LENGTH + ' символов, включая решётку. ';
        isMoreThanMaxHashtagLength = true;
      }
    });

    if (validityMessage) {
      hashtagsInputElement.style.outline = '1px solid red';
    } else {
      hashtagsInputElement.style.outline = '';
    }

    hashtagsInputElement.setCustomValidity(validityMessage);
  };

  var checkDescriptionValidity = function () {
    if (descriptionInputElement.value.length > DESCRIPTION_MAX_LENGTH) {
      descriptionInputElement.setCustomValidity('длина комментария не может составлять больше 140 символов');
      descriptionInputElement.style.outline = '1px solid red';
    } else {
      descriptionInputElement.setCustomValidity('');
      descriptionInputElement.style.outline = '';
    }
  };

  window.formValidity = {
    hashtagsInputElement: hashtagsInputElement,
    descriptionInputElement: descriptionInputElement
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
