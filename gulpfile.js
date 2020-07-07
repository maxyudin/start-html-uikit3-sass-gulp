let syntax    = 'sсss'; // Syntax: sass or scss;

let gulp         = require('gulp'),
	gutil        = require('gulp-util' ), //вывод уведомлений в консоль
	sass         = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat       = require('gulp-concat'), // конкатенация файлов
	uglify       = require('gulp-uglify'), // сжатие JS
	cleanCSS     = require('gulp-clean-css'), // Минификация CSS
	htmlmin      = require('gulp-htmlmin'), // Минификация HTML
	rename       = require('gulp-rename'), // переименование файлов
	del          = require('del'), // удаление файлов и каталогов
	imagemin     = require('gulp-imagemin'), // работа с изображениями
	cache        = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'), // автоматическое добавление префиксов
	notify       = require("gulp-notify"), // Вывод системных сообщений
	ftp          = require('vinyl-ftp'), // Диплой на хостинг через FTP
	rsync        = require('gulp-rsync'); // синхронизация файлов и каталогов

let styles = () => {
	return gulp.src('./app/sass/**/*.sass')
		.pipe(sass({outputStyle: 'expanded'}).on("error", notify.onError()))
		//.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('./app/css'))
		.pipe(browserSync.stream())
};

let scripts = () => {
	return gulp.src([
		'app/libs/jquery/jquery-3.2.1.min.js',
		'app/libs/uikit3/dist/js/uikit.min.js',
		'app/libs/uikit3/dist/js/uikit-icons.min.js',
		'app/js/common.js',
	])
	.pipe(concat('scripts.min.js'))
	.pipe(gulp.dest('./app/js'))
	.pipe(browserSync.reload({ stream: true }))
};

let html = () => {
	return gulp.src('./app/*.html')
	.pipe(browserSync.reload({ stream: true }))
};

let clean = () => {
	return del(['./dist/'])
};

let imgmin = () => {
	return gulp.src('./app/img/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./dist/img'))
};


// ==================== файлы для продакшна
let buildHtml = () => {
	return gulp.src('./app/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))//Сжимаем их как следует
	.pipe(gulp.dest('./dist'))
};

let buildCss = () => {
	return gulp.src('./app/css/style.min.css')
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('./dist/css'))
};

let buildFiles = () => {
	return gulp.src([
		//'./app/*.php',
		//'./app/*.xml',
		'./app/*.txt',
		'./app/.htaccess',
	]).pipe(gulp.dest('./dist'))
};

let buildJs = () => {
	return gulp.src('./app/js/scripts.min.js')
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'))
};
// ==================== END

// ==================== Отслеживание изменений в файлах
let watch = () => {
	browserSync.init({
		server: {
			baseDir: './app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
  gulp.watch('./app/'+syntax+'/**/*.'+syntax+'', styles);
  gulp.watch(['./app/libs/**/*.js', './app/js/common.js'], scripts);
  gulp.watch('./app/*.html', html);
};

// ==================== объявление задач
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('clean', clean);
gulp.task('imgmin', imgmin);
gulp.task('buildHtml', buildHtml);
gulp.task('buildCss', buildCss);
gulp.task('buildFiles', buildFiles);
gulp.task('buildJs', buildJs);

// ==================== сборка проекта в папку dist
gulp.task('build', gulp.series(clean,
	gulp.parallel(buildHtml, buildCss, buildJs, buildFiles, imgmin))
);

gulp.task('default', gulp.series(watch, browserSync));
gulp.task('watch', gulp.series(watch, browserSync));




gulp.task('deploy', () => {
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


gulp.task('rsync', () => {
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

gulp.task('clearcache', () => { return cache.clearAll(); }); // Если нужно почистить кешь!
