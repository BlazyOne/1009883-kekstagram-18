'use strict';

var ESC_KEYCODE = 27;
var DATA_AMOUNT = 25;
var DESCRIPTION_ARRAY = ['Мое Фото', 'Просто фотография', 'Очередное фото'];
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 0;
var MAX_COMMENTS = 15;
var AVATARS_AMOUNT = 6;
var COMMENTS_MESSAGES = ['Всё отлично!', 'В целом всё неплохо.Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают.Как можно было поймать такой неудачный момент?!'];
var COMMENTS_NAMES = ['Артем', 'Маша', 'Вася', 'Лера'];
var SCALE_MIN = 25;
var SCALE_MAX = 100;
var SCALE_STEP = 25;
var EFFECT_MIN = 0;
var EFFECT_MAX = 100;

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesElement = document.querySelector('.pictures');

var bigPictureElement = document.querySelector('.big-picture');
var commentsListElement = bigPictureElement.querySelector('.social__comments');
var commentElement = commentsListElement.querySelector('.social__comment');
var bigPictureCommentsCounterElement = bigPictureElement.querySelector('.social__comment-count');
var commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

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

var hashtagsInputElement = uploadOverlayElement.querySelector('.text__hashtags');
var descriptionInputElement = uploadOverlayElement.querySelector('.text__description');

var getRandomFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getRandomInRange = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var getUrlArray = function (amount) {
  var urlArray = [];
  for (var i = 1; i <= amount; i++) {
    var url = 'photos/' + i + '.jpg';
    urlArray.push(url);
  }
  return urlArray;
};

// Fisher-Yates shuffle
var shuffle = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));

    var t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
};

var getAvatarsArray = function (amount) {
  var avatarsArray = [];
  for (var i = 1; i <= amount; i++) {
    var avatarUrl = 'img/avatar-' + i + '.svg';
    avatarsArray.push(avatarUrl);
  }
  return avatarsArray;
};

var getCommentsArray = function () {
  var commentsArray = [];
  var avatars = getAvatarsArray(AVATARS_AMOUNT);
  var number = getRandomInRange(MIN_COMMENTS, MAX_COMMENTS);
  for (var i = 0; i < number; i++) {
    var commentObject = {};
    commentObject.avatar = getRandomFromArray(avatars);
    commentObject.message = getRandomFromArray(COMMENTS_MESSAGES);
    commentObject.name = getRandomFromArray(COMMENTS_NAMES);

    commentsArray.push(commentObject);
  }
  return commentsArray;
};

var getMockArray = function (amount) {
  var arr = [];

  var urlArray = getUrlArray(amount);
  shuffle(urlArray);

  for (var i = 0; i < amount; i++) {
    var mockObject = {};
    mockObject.url = urlArray[i];
    mockObject.description = getRandomFromArray(DESCRIPTION_ARRAY);
    mockObject.likes = getRandomInRange(MIN_LIKES, MAX_LIKES);
    mockObject.comments = getCommentsArray();

    arr.push(mockObject);
  }

  return arr;
};

var renderPhoto = function (photoObject) {
  var photoElement = pictureTemplate.cloneNode(true);

  photoElement.querySelector('.picture__img').setAttribute('src', photoObject.url);
  photoElement.querySelector('.picture__likes').textContent = photoObject.likes;
  photoElement.querySelector('.picture__comments').textContent = photoObject.comments.length;

  return photoElement;
};

var fillPhotos = function (photosData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photosData.length; i++) {
    fragment.appendChild(renderPhoto(photosData[i]));
  }
  picturesElement.appendChild(fragment);
};

var clearElementContent = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var renderComment = function (commentObject) {
  var comment = commentElement.cloneNode(true);

  comment.querySelector('.social__picture').setAttribute('src', commentObject.avatar);
  comment.querySelector('.social__picture').setAttribute('alt', commentObject.name);
  comment.querySelector('.social__text').textContent = commentObject.message;

  return comment;
};

var fillBigPicture = function (photoData) {
  bigPictureElement.querySelector('.big-picture__img img').setAttribute('src', photoData.url);
  bigPictureElement.querySelector('.likes-count').textContent = photoData.likes;
  bigPictureElement.querySelector('.comments-count').textContent = photoData.comments.length;
  bigPictureElement.querySelector('.social__caption').textContent = photoData.description;

  clearElementContent(commentsListElement);

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photoData.comments.length; i++) {
    fragment.appendChild(renderComment(photoData.comments[i]));
  }
  commentsListElement.appendChild(fragment);
};

var onUploadEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideUploadOverlay();
  }
};

var showUploadOverlay = function () {
  uploadOverlayElement.classList.remove('hidden');
  document.addEventListener('keydown', onUploadEscPress);
  setScaleNumber(SCALE_MAX);
  renderScale();
  setEffectNumber(EFFECT_MAX);
  renderEffect();
};

var hideUploadOverlay = function () {
  clearValue(uploadFileElement);
  uploadOverlayElement.classList.add('hidden');
  document.removeEventListener('keydown', onUploadEscPress);
  uploadOverlayElement.querySelector('#effect-none').checked = true;
  setEffectNumber(EFFECT_MAX);
};

var clearValue = function (element) {
  element.value = null;
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

var getEffectNumber = function () {
  return effectLevelValueElement.value;
};

var setEffectNumber = function (value) {
  effectLevelValueElement.value = value;
};

var clearEffectStyles = function () {
  previewImageElement.classList.remove('effects__preview--chrome');
  previewImageElement.classList.remove('effects__preview--sepia');
  previewImageElement.classList.remove('effects__preview--marvin');
  previewImageElement.classList.remove('effects__preview--phobos');
  previewImageElement.classList.remove('effects__preview--heat');
};

var renderEffect = function () {
  var effectNumber = getEffectNumber();

  if (uploadOverlayElement.querySelector('#effect-none').checked) {
    effectLevelElement.classList.add('hidden');
    clearEffectStyles();
    previewImageElement.style.filter = '';
  } else {
    effectLevelElement.classList.remove('hidden');
  }

  if (uploadOverlayElement.querySelector('#effect-chrome').checked) {
    clearEffectStyles();
    previewImageElement.classList.add('effects__preview--chrome');
    var chromeNumber = effectNumber / 100;
    previewImageElement.style.filter = 'grayscale(' + chromeNumber + ')';
  } else if (uploadOverlayElement.querySelector('#effect-sepia').checked) {
    clearEffectStyles();
    previewImageElement.classList.add('effects__preview--sepia');
    var sepiaNumber = effectNumber / 100;
    previewImageElement.style.filter = 'sepia(' + sepiaNumber + ')';
  } else if (uploadOverlayElement.querySelector('#effect-marvin').checked) {
    clearEffectStyles();
    previewImageElement.classList.add('effects__preview--marvin');
    var marvinNumber = effectNumber;
    previewImageElement.style.filter = 'invert(' + marvinNumber + '%)';
  } else if (uploadOverlayElement.querySelector('#effect-phobos').checked) {
    clearEffectStyles();
    previewImageElement.classList.add('effects__preview--phobos');
    var phobosNumber = effectNumber * 3 / 100;
    previewImageElement.style.filter = 'blur(' + phobosNumber + 'px)';
  } else if (uploadOverlayElement.querySelector('#effect-heat').checked) {
    clearEffectStyles();
    previewImageElement.classList.add('effects__preview--heat');
    var heatNumber = effectNumber * 3 / 100;
    previewImageElement.style.filter = 'brightness(' + heatNumber + ')';
  }

  effectLevelPinElement.style.left = effectNumber + '%';
  effectLevelDepthElement.style.width = effectNumber + '%';
};

var setEffectsRadioListeners = function () {
  var effectRadiosElements = uploadOverlayElement.querySelectorAll('input[name="effect"]');

  for (var i = 0; i < effectRadiosElements.length; i++) {
    effectRadiosElements[i].addEventListener('change', function () {
      setEffectNumber(EFFECT_MAX);
      renderEffect();
    });
  }
};

var onEffectLineMouseUp = function (evt) {
  var rectEffectLine = effectLevelLine.getBoundingClientRect();
  var value = (evt.clientX - rectEffectLine.left) * 100 / rectEffectLine.width;
  if (value < EFFECT_MIN) {
    value = EFFECT_MIN;
  } else if (value > EFFECT_MAX) {
    value = EFFECT_MAX;
  }
  setEffectNumber(value);
  renderEffect();
};

var findSameInArray = function (arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        return true;
      }
    }
  }
  return false;
};

var checkHashtagValidity = function () {
  var hashtagString = hashtagsInputElement.value;
  hashtagString = hashtagString.toLowerCase();
  var hashtagArray = hashtagString.split(' ');

  for (var i = 0; i < hashtagArray.length; i++) {
    if (hashtagArray[i].indexOf(',') > -1 || hashtagArray[i].indexOf(';') > -1) {
      hashtagsInputElement.setCustomValidity('Хэштеги должны разделяться пробелами');
      return 0;
    } else if (hashtagArray[i][0] !== '#') {
      hashtagsInputElement.setCustomValidity('хэш-тег должен начинаться с символа #');
      return 0;
    } else if (hashtagArray[i].length === 1) {
      hashtagsInputElement.setCustomValidity('хеш-тег не может состоять только из одной решётки');
      return 0;
    } else if (findSameInArray(hashtagArray)) {
      hashtagsInputElement.setCustomValidity('один и тот же хэш-тег не может быть использован дважды');
      return 0;
    } else if (hashtagArray.length > 5) {
      hashtagsInputElement.setCustomValidity('нельзя указать больше пяти хэш-тегов');
      return 0;
    } else if (hashtagArray[i].length > 20) {
      hashtagsInputElement.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
      return 0;
    } else {
      hashtagsInputElement.setCustomValidity('');
    }
  }

  return 0;
};

var checkDescriptionValidity = function () {
  if (descriptionInputElement.value.length > 140) {
    descriptionInputElement.setCustomValidity('длина комментария не может составлять больше 140 символов');
  } else {
    descriptionInputElement.setCustomValidity('');
  }
};

var mockArray = getMockArray(DATA_AMOUNT);
fillPhotos(mockArray);

bigPictureCommentsCounterElement.classList.add('visually-hidden');
commentsLoaderElement.classList.add('visually-hidden');
// bigPictureElement.classList.remove('hidden');
fillBigPicture(mockArray[0]);

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

effectLevelLine.addEventListener('mouseup', onEffectLineMouseUp);

hashtagsInputElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.stopPropagation();
  }
});

descriptionInputElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.stopPropagation();
  }
});

hashtagsInputElement.addEventListener('input', function () {
  checkHashtagValidity();
});

descriptionInputElement.addEventListener('input', function () {
  checkDescriptionValidity();
});
