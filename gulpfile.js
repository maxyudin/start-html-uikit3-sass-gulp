var syntax        = 'sass'; // Syntax: sass or scss;

var gulp          = require('gulp'), // Подключаем Gulp
		gutil         = require('gulp-util' ), //Вывод уведомления в консоль, так как в gulp нет встроенного лога
		sass          = require('gulp-sass'), //Подключаем Sass пакет,
		browsersync   = require('browser-sync'), // Подключаем Browser Sync
		concat        = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
		uglify        = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
		cleancss      = require('gulp-clean-css'), // Минификация CSS
		rename        = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
		notify        = require("gulp-notify"), // Водит ошибки при сборке Gulp в виде системных сообщений
		rsync         = require('gulp-rsync'), // Диплой на хостинг
		imagemin      = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
		cache         = require('gulp-cache'), // Подключаем библиотеку кеширования
		del           = require('del'), // Подключаем библиотеку для удаления файлов и папок
		pngquant      = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
		autoprefixer  = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления префиксов




gulp.task('browser-sync', function() {
	browsersync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	})
});


gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	//.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(concat('style.min.css'))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browsersync.reload( {stream: true} ))
});


gulp.task('js', function() {
	return gulp.src([
		'app/libs/jquery/jquery-3.2.1.min.js',
		'app/libs/uikit3/dist/js/uikit.min.js',
		'app/libs/uikit3/dist/js/uikit-icons.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browsersync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'user123@mydomain.com',
		destination: 'www/mydomain.com/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);  // Наблюдение за sass файлами в папке sass
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);  // Наблюдение за JS файлами в папке js
	gulp.watch('app/*.html', browsersync.reload)  // Наблюдение за HTML файлами в корне проекта
});



//BUILD DIST//
gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});


gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});


gulp.task('build', ['clean', 'img', 'sass', 'js'], function() {

    var buildCss = gulp.src([ // Переносим CSS стили в продакшен
        'app/css/style.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

     //var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    //.pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'))

    //var buildPhp = gulp.src('app/*.php') // Переносим .php в продакшен
    //.pipe(gulp.dest('dist'))

    var buildHtaccess = gulp.src('app/.htaccess') // Переносим .htaccess в продакшен
    .pipe(gulp.dest('dist'))
    
    //var buildXml = gulp.src('app/*.xml') // Переносим .xml в продакшен
    //.pipe(gulp.dest('dist'));

    var buildTxt = gulp.src('app/*.txt') // Переносим .txt в продакшен
    .pipe(gulp.dest('dist'));

});


gulp.task('clear', function () {
    return cache.clearAll();
});



gulp.task('default', ['watch']);