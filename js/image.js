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
    var commentCopyElement = commentElement.cloneNode(true);

    commentCopyElement.querySelector('.social__picture').setAttribute('src', commentObject.avatar);
    commentCopyElement.querySelector('.social__picture').setAttribute('alt', commentObject.name);
    commentCopyElement.querySelector('.social__text').textContent = commentObject.message;

    return commentCopyElement;
  };

  var fillBigPicture = function (photoData) {
    var totalCommentsCounter = 0;
    var loadCommentsPortion = function () {
      if (totalCommentsCounter < photoData.comments.length) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < COMMENTS_PORTION_AMOUNT && totalCommentsCounter < photoData.comments.length; i++, totalCommentsCounter++) {
          fragment.appendChild(renderComment(photoData.comments[totalCommentsCounter]));
        }
        commentsListElement.appendChild(fragment);
      }
      if (totalCommentsCounter >= photoData.comments.length) {
        commentsLoaderElement.classList.add('hidden');
      }
      bigPictureCommentsCounterElement.textContent = totalCommentsCounter + ' из ' + photoData.comments.length + ' комментариев';
    };

    window.image.loadCommentsPortion = loadCommentsPortion;

    bigPictureElement.querySelector('.big-picture__img img').setAttribute('src', photoData.url);
    bigPictureElement.querySelector('.likes-count').textContent = photoData.likes;
    bigPictureElement.querySelector('.social__caption').textContent = photoData.description;
    commentsLoaderElement.classList.remove('hidden');

    window.util.clearElementContent(commentsListElement);

    loadCommentsPortion();
    commentsLoaderElement.addEventListener('click', window.image.loadCommentsPortion);
  };

  var onBigPictureEscPress = function (evt) {
    window.util.isEscEvent(evt, hideBigPicture);
  };

  var showBigPicture = function (photoData) {
    fillBigPicture(photoData);
    bigPictureElement.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureEscPress);
    document.body.classList.add('modal-open');
  };

  var hideBigPicture = function () {
    bigPictureElement.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
    commentsLoaderElement.removeEventListener('click', window.image.loadCommentsPortion);
    document.body.classList.remove('modal-open');
  };

  window.image = {
    showBigPicture: showBigPicture,
    bigPictureElement: bigPictureElement
  };

  bigPictureCancelElement.addEventListener('click', hideBigPicture);
})();
