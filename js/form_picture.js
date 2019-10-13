'use strict';

(function () {
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;
  var EFFECT = {
    effectNumber: {
      min: 0,
      max: 100
    },
    chrome: {
      min: 0,
      max: 1
    },
    sepia: {
      min: 0,
      max: 1
    },
    marvin: {
      min: 0,
      max: 100
    },
    phobos: {
      min: 0,
      max: 3
    },
    heat: {
      min: 1,
      max: 3
    }
  };
  var EFFECTS_STYLE_PREFIX = 'effects__preview--';
  var IMG_UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var IMG_UPLOAD_TYPE = 'POST';

  var uploadFormElement = document.querySelector('.img-upload__form');
  var uploadFileElement = document.querySelector('#upload-file');
  var uploadOverlayElement = document.querySelector('.img-upload__overlay');
  var uploadCancelElement = uploadOverlayElement.querySelector('#upload-cancel');

  var scaleControlValueElement = uploadOverlayElement.querySelector('.scale__control--value');
  var scaleControlSmaller = uploadOverlayElement.querySelector('.scale__control--smaller');
  var scaleControlBigger = uploadOverlayElement.querySelector('.scale__control--bigger');
  var effectLevelValueElement = uploadOverlayElement.querySelector('.effect-level__value');
  var effectLevelElement = uploadOverlayElement.querySelector('.img-upload__effect-level');
  var previewImageElement = uploadOverlayElement.querySelector('.img-upload__preview img');
  var effectLevelPinElement = uploadOverlayElement.querySelector('.effect-level__pin');
  var effectLevelDepthElement = uploadOverlayElement.querySelector('.effect-level__depth');
  var effectLevelLine = uploadOverlayElement.querySelector('.effect-level__line');

  var onUploadEscPress = function (evt) {
    window.util.isEscEvent(evt, hideUploadOverlay);
  };

  var showUploadOverlay = function () {
    uploadOverlayElement.classList.remove('hidden');
    document.addEventListener('keydown', onUploadEscPress);
    setScaleNumber(SCALE_MAX);
    renderScale();
    setEffectNumber(EFFECT.effectNumber.max);
    renderEffects();
  };

  var hideUploadOverlay = function () {
    window.util.clearValue(uploadFileElement);
    uploadOverlayElement.classList.add('hidden');
    document.removeEventListener('keydown', onUploadEscPress);
    uploadOverlayElement.querySelector('#effect-none').checked = true;
    setEffectNumber(EFFECT.effectNumber.max);
  };

  var getScaleNumber = function () {
    var value = scaleControlValueElement.value;
    value = value.substring(0, value.length - 1);
    value = Number(value);
    return value;
  };

  var setScaleNumber = function (value) {
    scaleControlValueElement.value = value + '%';
  };

  var setScaleSmaller = function () {
    var value = getScaleNumber();
    value -= SCALE_STEP;
    if (value < SCALE_MIN) {
      value = SCALE_MIN;
    }
    setScaleNumber(value);
  };

  var setScaleBigger = function () {
    var value = getScaleNumber();
    value += SCALE_STEP;
    if (value > SCALE_MAX) {
      value = SCALE_MAX;
    }
    setScaleNumber(value);
  };

  var renderScale = function () {
    var scaleNumber = getScaleNumber() / 100;
    previewImageElement.style.transform = 'scale(' + scaleNumber + ')';
  };

  var setEffectNumber = function (value) {
    if (value > EFFECT.effectNumber.max) {
      value = EFFECT.effectNumber.max;
    } else if (value < EFFECT.effectNumber.min) {
      value = EFFECT.effectNumber.min;
    }
    effectLevelValueElement.value = Math.round(value);
  };

  var getEffectStyleNumber = function (effectNumberValue, styleNumberMin, styleNumberMax) {
    return styleNumberMin + (styleNumberMax - styleNumberMin) * (effectNumberValue - EFFECT.effectNumber.min) / (EFFECT.effectNumber.max - EFFECT.effectNumber.min);
  };

  var clearEffectStyles = function () {
    previewImageElement.classList.remove('effects__preview--chrome', 'effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat');
  };

  var renderEffects = function () {
    var effectNumber = effectLevelValueElement.value;
    clearEffectStyles();

    var effectName = uploadOverlayElement.querySelector('input[name=effect]:checked').value;

    if (effectName !== 'none') {
      effectLevelElement.classList.remove('hidden');
      previewImageElement.classList.add(EFFECTS_STYLE_PREFIX + effectName);
    }

    switch (effectName) {
      case 'none':
        effectLevelElement.classList.add('hidden');
        previewImageElement.style.filter = '';
        break;
      case 'chrome':
        previewImageElement.style.filter = 'grayscale(' + getEffectStyleNumber(effectNumber, EFFECT.chrome.min, EFFECT.chrome.max) + ')';
        break;
      case 'sepia':
        previewImageElement.style.filter = 'sepia(' + getEffectStyleNumber(effectNumber, EFFECT.sepia.min, EFFECT.sepia.max) + ')';
        break;
      case 'marvin':
        previewImageElement.style.filter = 'invert(' + getEffectStyleNumber(effectNumber, EFFECT.marvin.min, EFFECT.marvin.max) + '%)';
        break;
      case 'phobos':
        previewImageElement.style.filter = 'blur(' + getEffectStyleNumber(effectNumber, EFFECT.phobos.min, EFFECT.phobos.max) + 'px)';
        break;
      case 'heat':
        previewImageElement.style.filter = 'brightness(' + getEffectStyleNumber(effectNumber, EFFECT.heat.min, EFFECT.heat.max) + ')';
        break;
    }

    effectLevelPinElement.style.left = effectNumber + '%';
    effectLevelDepthElement.style.width = effectNumber + '%';
  };

  var setEffectsRadioListeners = function () {
    var effectRadiosElements = uploadOverlayElement.querySelectorAll('input[name="effect"]');

    for (var i = 0; i < effectRadiosElements.length; i++) {
      effectRadiosElements[i].addEventListener('change', function () {
        setEffectNumber(EFFECT.effectNumber.max);
        renderEffects();
      });
    }
  };

  var onPictureUploadError = function (errorMessage) {
    var errorElement = window.util.createLoadErrorElement();
    var errorTitle = errorElement.querySelector('.error__title');

    errorTitle.textContent = 'Ошибка загрузки нового изображения. ' + errorMessage;
  };

  var onPictureUploadSuccess = function () {
    hideUploadOverlay();
    window.util.createLoadSuccessElement();
  };

  window.formPicture = {
    uploadOverlayElement: uploadOverlayElement
  };

  uploadFileElement.addEventListener('change', function () {
    showUploadOverlay();
  });

  uploadCancelElement.addEventListener('click', function () {
    hideUploadOverlay();
  });

  scaleControlSmaller.addEventListener('click', function () {
    setScaleSmaller();
    renderScale();
  });

  scaleControlBigger.addEventListener('click', function () {
    setScaleBigger();
    renderScale();
  });

  setEffectsRadioListeners();

  effectLevelPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var rectEffectLine = effectLevelLine.getBoundingClientRect();

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var value;
      if (moveEvt.clientX >= rectEffectLine.left && moveEvt.clientX <= rectEffectLine.right) {
        value = EFFECT.effectNumber.min + (moveEvt.clientX - rectEffectLine.left) * (EFFECT.effectNumber.max - EFFECT.effectNumber.min) / rectEffectLine.width;
        setEffectNumber(value);
        renderEffects();
        effectLevelPinElement.style.left = (moveEvt.clientX - rectEffectLine.left) + 'px';
        effectLevelDepthElement.style.width = (moveEvt.clientX - rectEffectLine.left) + 'px';
      } else if (moveEvt.clientX > rectEffectLine.right) {
        value = EFFECT.effectNumber.max;
        setEffectNumber(value);
        renderEffects();
        effectLevelPinElement.style.left = rectEffectLine.width + 'px';
        effectLevelDepthElement.style.width = rectEffectLine.width + 'px';
      } else if (moveEvt.clientX < rectEffectLine.left) {
        value = EFFECT.effectNumber.min;
        setEffectNumber(value);
        renderEffects();
        effectLevelPinElement.style.left = 0 + 'px';
        effectLevelDepthElement.style.width = 0 + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  uploadFormElement.addEventListener('submit', function (evt) {
    window.backend.load(IMG_UPLOAD_URL, IMG_UPLOAD_TYPE, onPictureUploadSuccess, onPictureUploadError, new FormData(uploadFormElement));
    evt.preventDefault();
  });
})();
