'use strict';

(function () {
  var PICTURES_DOWNLOAD_URL = 'https://javascript.pages.academy/kekstagram/data';
  var PICTURES_DOWNLOAD_TYPE = 'GET';
  var RANDOM_AMOUNT = 10;

  var pictureTemplateElement = document.querySelector('#picture').content.querySelector('.picture');
  var picturesElement = document.querySelector('.pictures');
  var filterButtonElements = document.querySelectorAll('.img-filters__button');
  var filterPopularElement = document.querySelector('#filter-popular');
  var filterRandomElement = document.querySelector('#filter-random');
  var filterDiscussedElement = document.querySelector('#filter-discussed');

  var thumbnailsData = [];
  var FilterButtonsId = {
    POPULAR_ID: 'filter-popular',
    RANDOM_ID: 'filter-random',
    DISCUSSED_ID: 'filter-discussed'
  };

  var renderPhoto = function (photoObject) {
    var photoElement = pictureTemplateElement.cloneNode(true);

    photoElement.querySelector('.picture__img').setAttribute('src', photoObject.url);
    photoElement.querySelector('.picture__likes').textContent = photoObject.likes;
    photoElement.querySelector('.picture__comments').textContent = photoObject.comments.length;

    photoElement.addEventListener('click', function () {
      window.image.showBigPicture(photoObject);
    });

    return photoElement;
  };

  var fillPhotos = function (photosData) {
    var fragment = document.createDocumentFragment();
    photosData.forEach(function (it) {
      fragment.appendChild(renderPhoto(it));
    });
    picturesElement.appendChild(fragment);
  };

  var onPicturesDownloadError = function (errorMessage) {
    var errorElement = window.util.createLoadErrorElement();
    var errorTitleElement = errorElement.querySelector('.error__title');

    errorTitleElement.textContent = 'Ошибка загрузки файла изображений. ' + errorMessage;
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

  var updateThumbnails = function (evt) {
    clearThumbnails();
    var dataCopy = thumbnailsData.slice();
    switch (evt.target.id) {
      case FilterButtonsId.RANDOM_ID:
        window.util.shuffle(dataCopy);
        dataCopy = dataCopy.slice(0, RANDOM_AMOUNT);
        break;
      case FilterButtonsId.DISCUSSED_ID:
        dataCopy.sort(function (left, right) {
          return right.comments.length - left.comments.length;
        });
        break;
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
    debounceUpdateThumbnails(evt);
    clearFilterButtonsStyle();
    evt.target.classList.add('img-filters__button--active');
  };

  window.backend.load(PICTURES_DOWNLOAD_URL, PICTURES_DOWNLOAD_TYPE, onPicturesDownloadSuccess, onPicturesDownloadError);

  filterPopularElement.addEventListener('click', function (evt) {
    onFilterButtonClick(evt);
  });

  filterRandomElement.addEventListener('click', function (evt) {
    onFilterButtonClick(evt);
  });

  filterDiscussedElement.addEventListener('click', function (evt) {
    onFilterButtonClick(evt);
  });
})();
