var syntax        = 'sass'; // Syntax: sass or scss;

var gulp           = require('gulp'), // Подключаем Gulp
		gutil          = require('gulp-util' ), //Вывод уведомления в консоль, так как в gulp нет встроенного лога
		sass           = require('gulp-sass'), //Подключаем Sass пакет
		browserSync    = require('browser-sync'), // Подключаем автообновление через Browser Sync
		concat         = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
		uglify         = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
		cleanCSS       = require('gulp-clean-css'), // Минификация CSS
		htmlmin       = require('gulp-htmlmin'); //Минификация HTML
		rename         = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
		del            = require('del'), // Подключаем библиотеку для удаления файлов и папок
		imagemin       = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
		cache          = require('gulp-cache'), // Подключаем библиотеку кеширования
		autoprefixer   = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
		notify         = require("gulp-notify"), // Водит ошибки при сборке Gulp в виде системных сообщений
		ftp            = require('vinyl-ftp'), // Диплой на хостинг через FTP
		rsync          = require('gulp-rsync'); // Диплой на хостинг через SSH

	gulp.task('browser-sync', function() {
		browserSync({
			server: {
				baseDir: 'app'
			},
			notify: false,
			// tunnel: true,
			// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
		});
	});

// Пользовательские скрипты проекта

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery/jquery-3.2.1.min.js',
		'app/libs/uikit3/dist/js/uikit.min.js',
		'app/libs/uikit3/dist/js/uikit-icons.min.js',
		'app/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
	//.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(concat('style.min.css'))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});







gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
});



gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin())) // Cache Images
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

  var buildHtml = gulp.src('app/*.html') // Берём все файлы HTML
    .pipe(htmlmin({collapseWhitespace: true})) //Сжимаем их как следует
    .pipe(gulp.dest('dist')) // И переносим в продакшен

	var buildCss = gulp.src([
		'app/css/style.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildFiles = gulp.src([
		//'app/*.php',
		//'app/*.xml',
		'app/*.txt',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	//var buildFonts = gulp.src([
		//'app/fonts/**/*',
		//]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'yousite.com',
		user:      'ftp-user',
		password:  'password',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/www/yousite.com/'));
 //Документация: https://pinchukov.net/blog/vinyl-ftp.html
});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'user123@yousite.com',
		destination: 'www/yousite.com/',
		// include: ['*.htaccess'], // Скрытые файлы, которые необходимо включить в деплой
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}));
	//Документация: https://pinchukov.net/blog/gulp-rsync.html
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);