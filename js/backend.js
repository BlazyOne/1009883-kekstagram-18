'use strict';

(function () {
  var LOAD_TIMEOUT = 10000; // 10s
  var SUCCESS_STATUS_NUMBER = 200;

  window.backend = {
    load: function (url, type, onLoad, onError, data) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS_STATUS_NUMBER) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = LOAD_TIMEOUT;

      xhr.open(type, url);
      if (data) {
        xhr.send(data);
      } else {
        xhr.send();
      }
    }
  };
})();
