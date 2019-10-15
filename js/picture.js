'use strict';

(function () {
  var COMMENTS_PORTION_AMOUNT = 5;

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCancelElement = bigPictureElement.querySelector('#picture-cancel');
  var commentsListElement = bigPictureElement.querySelector('.social__comments');
  var commentElement = commentsListElement.querySelector('.social__comment');
  var bigPictureCommentsCounterElement = bigPictureElement.querySelector('.social__comment-count');
  var commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

  var renderComment = function (commentObject) {
    var comment = commentElement.cloneNode(true);

    comment.querySelector('.social__picture').setAttribute('src', commentObject.avatar);
    comment.querySelector('.social__picture').setAttribute('alt', commentObject.name);
    comment.querySelector('.social__text').textContent = commentObject.message;

    return comment;
  };

  var fillBigPicture = function (photoData) {
    var j = 0;
    var loadCommentsPortion = function () {
      if (j < photoData.comments.length) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < COMMENTS_PORTION_AMOUNT && j < photoData.comments.length; i++, j++) {
          fragment.appendChild(renderComment(photoData.comments[j]));
        }
        commentsListElement.appendChild(fragment);
      }
      if (j >= photoData.comments.length) {
        commentsLoaderElement.classList.add('hidden');
      }
      bigPictureCommentsCounterElement.textContent = j + ' из ' + photoData.comments.length + ' комментариев';
    };

    var removeListeners = function () {
      commentsLoaderElement.removeEventListener('click', loadCommentsPortion);
      document.removeEventListener('keydown', onEscPress);
    };

    var onEscPress = function (evt) {
      window.util.isEscEvent(evt, removeListeners);
    };

    bigPictureElement.querySelector('.big-picture__img img').setAttribute('src', photoData.url);
    bigPictureElement.querySelector('.likes-count').textContent = photoData.likes;
    bigPictureElement.querySelector('.social__caption').textContent = photoData.description;
    commentsLoaderElement.classList.remove('hidden');

    window.util.clearElementContent(commentsListElement);

    loadCommentsPortion();
    commentsLoaderElement.addEventListener('click', loadCommentsPortion);

    bigPictureCancelElement.addEventListener('click', removeListeners);
    document.addEventListener('keydown', onEscPress);
  };

  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, hideBigPicture);
  };

  var showBigPicture = function (photoData) {
    fillBigPicture(photoData);
    bigPictureElement.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  var hideBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  window.picture = {
    showBigPicture: showBigPicture,
    bigPictureElement: bigPictureElement
  };

  // bigPictureCommentsCounterElement.classList.add('visually-hidden');
  // commentsLoaderElement.classList.add('visually-hidden');
  bigPictureCancelElement.addEventListener('click', hideBigPicture);
})();
