1) Инициализируем новый проект gulp в папке вашего проекта в bash окне командой npm init, ответим на все вопросы как положено.
2) Установим gulp в вашем проекте: npm i gulp --save-dev


Требуемые пакеты Gulp:

gulp-sass - подключаем Sass пакет,
gulp-util - вывод уведомления в консоль, так как в gulp нет встроенного лога
browser-sync - подключаем Browser Sync
gulp-concat - подключаем gulp-concat (для конкатенации файлов)
gulp-uglify - подключаем gulp-uglifyjs (для сжатия JS)
gulp-clean-css - минификация CSS
gulp-rename - подключаем библиотеку для переименования файлов
gulp-notify - водит ошибки при сборке Gulp в виде системных сообщений
gulp-rsync - диплой на хостинг
gulp-imagemin - подключаем библиотеку для работы с изображениями
gulp-cache - подключаем библиотеку кеширования
del - подключаем библиотеку для удаления файлов и папок
imagemin-pngquant - подключаем библиотеку для работы с png
gulp-autoprefixer - подключаем библиотеку для автоматического добавления префиксов

Установка требуемых пакетов Gulp:

npm i gulp-sass --save-dev
npm i gulp-util --save-dev
npm i browser-sync --save-dev
npm i gulp-concat --save-dev
npm i gulp-uglify --save-dev
npm i gulp-clean-css --save-dev
npm i gulp-rename --save-dev
npm i gulp-notify --save-dev
npm i gulp-rsync --save-dev
npm i gulp-imagemin --save-dev
npm i gulp-cache --save-dev
npm i del --save-dev
npm i imagemin-pngquant --save-dev
npm i gulp-autoprefixer --save-dev


-----------
Полезное:

npm i gulp-update  - обновление gulp

npm outdated - проверить наличие обновлений для компонентов gulp

npm update --save   -  обновить пакеты gulp до последней версии

npm update browser-sync --save-dev  -  Обновление конкретного пакета, в данном случае browser-sync.



