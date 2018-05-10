Шаблон для быстрого старта ваших веб-проектов v1.0

Построен на:
  - framework UIKit3 
  - gulp
  - sass

Официальная документация по framework UIKit3: https://getuikit.com/docs/introduction

Для работы с данным стартовым шаблоном требуется Gulp, и знаение Sass!

-----------
Используемые пакеты Gulp:

  - gulp-sass - подключаем Sass пакет,
  - gulp-util - вывод уведомления в консоль, так как в gulp нет встроенного лога,
  - browser-sync - подключаем Browser Sync,
  - gulp-concat - подключаем gulp-concat (для конкатенации файлов),
  - gulp-uglify - подключаем gulp-uglifyjs (для сжатия JS),
  - gulp-clean-css - минификация CSS,
  - gulp-rename - подключаем библиотеку для переименования файлов
  - gulp-notify - водит ошибки при сборке Gulp в виде системных сообщений,
  - gulp-rsync - диплой на хостинг,
  - gulp-imagemin - подключаем библиотеку для работы с изображениями,
  - gulp-cache - подключаем библиотеку кеширования,
  - del - подключаем библиотеку для удаления файлов и папок,
  - imagemin-pngquant - подключаем библиотеку для работы с png,
  - gulp-autoprefixer - подключаем библиотеку для автоматического добавления префиксов,

-----------
Установка требуемых пакетов Gulp:

$ npm i gulp-sass --save-dev
$ npm i gulp-util --save-dev
$ npm i browser-sync --save-dev
$ npm i gulp-concat --save-dev
$ npm i gulp-uglify --save-dev
$ npm i gulp-clean-css --save-dev
$ npm i gulp-rename --save-dev
$ npm i gulp-notify --save-dev
$ npm i gulp-rsync --save-dev
$ npm i gulp-imagemin --save-dev
$ npm i gulp-cache --save-dev
$ npm i del --save-dev
$ npm i imagemin-pngquant --save-dev
$ npm i gulp-autoprefixer --save-dev


-----------
Полезная информация:

$ npm i gulp-update  - обновление gulp

$ npm outdated - проверить наличие обновлений для компонентов gulp

$ npm update --save   -  обновить пакеты gulp до последней версии

$ npm update browser-sync --save-dev  -  Обновление конкретного пакета, в данном случае browser-sync.

------------

Если у вас имеются вопросы и предложения, буду рад ответить: pinchukov.net

