'use strict';

var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var picturesElement = document.querySelector('.pictures');

var bigPictureElement = document.querySelector('.big-picture');
var commentsListElement = bigPictureElement.querySelector('.social__comments');
var commentElement = commentsListElement.querySelector('.social__comment');
var bigPictureCommentsCounter = bigPictureElement.querySelector('.social__comment-count');
var commentsLoader = bigPictureElement.querySelector('.comments-loader');

var DATA_AMOUNT = 25;
var DESCRIPTION_ARRAY = ['Мое Фото', 'Просто фотография', 'Очередное фото'];
var MIN_LIKES = 15;
var MAX_LIKES = 200;
var MIN_COMMENTS = 0;
var MAX_COMMENTS = 15;
var AVATARS_AMOUNT = 6;
var COMMENTS_MESSAGES = ['Всё отлично!', 'В целом всё неплохо.Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают.Как можно было поймать такой неудачный момент?!'];
var COMMENTS_NAMES = ['Артем', 'Маша', 'Вася', 'Лера'];

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

var mockArray = getMockArray(DATA_AMOUNT);
fillPhotos(mockArray);

bigPictureCommentsCounter.classList.add('visually-hidden');
commentsLoader.classList.add('visually-hidden');
bigPictureElement.classList.remove('hidden');
fillBigPicture(mockArray[0]);
