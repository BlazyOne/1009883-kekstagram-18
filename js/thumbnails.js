'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesElement = document.querySelector('.pictures');

  var renderPhoto = function (photoObject) {
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__img').setAttribute('src', photoObject.url);
    photoElement.querySelector('.picture__likes').textContent = photoObject.likes;
    photoElement.querySelector('.picture__comments').textContent = photoObject.comments.length;

    photoElement.addEventListener('click', function () {
      window.picture.showBigPicture(photoObject);
    });

    return photoElement;
  };

  var fillPhotos = function (photosData) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photosData.length; i++) {
      fragment.appendChild(renderPhoto(photosData[i]));
    }
    picturesElement.appendChild(fragment);
  };

  fillPhotos(window.data.mockArray);
})();
