'use strict';

(function () {
  var bigPictureElement = document.querySelector('.big-picture');
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
    bigPictureElement.querySelector('.big-picture__img img').setAttribute('src', photoData.url);
    bigPictureElement.querySelector('.likes-count').textContent = photoData.likes;
    bigPictureElement.querySelector('.comments-count').textContent = photoData.comments.length;
    bigPictureElement.querySelector('.social__caption').textContent = photoData.description;

    window.util.clearElementContent(commentsListElement);

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photoData.comments.length; i++) {
      fragment.appendChild(renderComment(photoData.comments[i]));
    }
    commentsListElement.appendChild(fragment);
  };

  bigPictureCommentsCounterElement.classList.add('visually-hidden');
  commentsLoaderElement.classList.add('visually-hidden');
  // bigPictureElement.classList.remove('hidden');
  fillBigPicture(window.data.mockArray[0]);
})();
