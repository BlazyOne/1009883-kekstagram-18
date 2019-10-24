'use strict';

(function () {
  var DATA_AMOUNT = 25;
  var DESCRIPTION_ARRAY = ['Мое Фото', 'Просто фотография', 'Очередное фото'];
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_COMMENTS = 0;
  var MAX_COMMENTS = 15;
  var AVATARS_AMOUNT = 6;
  var COMMENTS_MESSAGES = ['Всё отлично!', 'В целом всё неплохо.Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают.Как можно было поймать такой неудачный момент?!'];
  var COMMENTS_NAMES = ['Артем', 'Маша', 'Вася', 'Лера'];

  var getUrlArray = function (amount) {
    var urlArray = [];
    for (var i = 1; i <= amount; i++) {
      var url = 'photos/' + i + '.jpg';
      urlArray.push(url);
    }
    return urlArray;
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
    var number = window.util.getRandomInRange(MIN_COMMENTS, MAX_COMMENTS);
    for (var i = 0; i < number; i++) {
      var commentObject = {};
      commentObject.avatar = window.util.getRandomFromArray(avatars);
      commentObject.message = window.util.getRandomFromArray(COMMENTS_MESSAGES);
      commentObject.name = window.util.getRandomFromArray(COMMENTS_NAMES);

      commentsArray.push(commentObject);
    }
    return commentsArray;
  };

  var getMockArray = function (amount) {
    var arr = [];

    var urlArray = getUrlArray(amount);
    window.util.shuffle(urlArray);

    for (var i = 0; i < amount; i++) {
      var mockObject = {};
      mockObject.url = urlArray[i];
      mockObject.description = window.util.getRandomFromArray(DESCRIPTION_ARRAY);
      mockObject.likes = window.util.getRandomInRange(MIN_LIKES, MAX_LIKES);
      mockObject.comments = getCommentsArray();

      arr.push(mockObject);
    }

    return arr;
  };

  var mockArray = getMockArray(DATA_AMOUNT);

  window.data = {
    mockArray: mockArray
  };
})();
