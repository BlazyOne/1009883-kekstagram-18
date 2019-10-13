'use strict';

(function () {
  var PICTURES_DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var PICTURES_DOWNLOAD_TYPE = 'GET';
  var RANDOM_AMOUNT = 10;

  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var picturesElement = document.querySelector('.pictures');
  var filterButtonElements = document.querySelectorAll('.img-filters__button');
  var filterPopularElement = document.querySelector('#filter-popular');
  var filterRandomElement = document.querySelector('#filter-random');
  var filterDiscussedElement = document.querySelector('#filter-discussed');

  var thumbnailsData = [];
  var sortType;

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

  var onPicturesDownloadError = function (errorMessage) {
    var errorElement = window.util.createLoadErrorElement();
    var errorTitle = errorElement.querySelector('.error__title');

    errorTitle.textContent = 'Ошибка загрузки файла изображений. ' + errorMessage;
  };

  var onPicturesDownloadSuccess = function (data) {
    thumbnailsData = data;
    fillPhotos(data);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  var clearThumbnails = function () {
    var thumbnailsElements = document.querySelectorAll('.picture');
    thumbnailsElements.forEach(function (element) {
      element.remove();
    });
  };

  var updateThumbnails = function () {
    clearThumbnails();
    var dataCopy = thumbnailsData.slice();
    if (sortType === 'random') {
      window.util.shuffle(dataCopy);
      dataCopy.length = RANDOM_AMOUNT;
    } else if (sortType === 'discussed') {
      dataCopy.sort(function (left, right) {
        return right.comments.length - left.comments.length;
      });
    }
    fillPhotos(dataCopy);
  };

  var debounceUpdateThumbnails = window.util.debounce(updateThumbnails);

  var clearFilterButtonsStyle = function () {
    filterButtonElements.forEach(function (element) {
      element.classList.remove('img-filters__button--active');
    });
  };

  var onFilterButtonClick = function (evt) {
    debounceUpdateThumbnails();
    clearFilterButtonsStyle();
    evt.target.classList.add('img-filters__button--active');
  };

  window.backend.load(PICTURES_DOWNLOAD_URL, PICTURES_DOWNLOAD_TYPE, onPicturesDownloadSuccess, onPicturesDownloadError);

  filterPopularElement.addEventListener('click', function (evt) {
    sortType = 'popular';
    onFilterButtonClick(evt);
  });

  filterRandomElement.addEventListener('click', function (evt) {
    sortType = 'random';
    onFilterButtonClick(evt);
  });

  filterDiscussedElement.addEventListener('click', function (evt) {
    sortType = 'discussed';
    onFilterButtonClick(evt);
  });
})();
