/*
* DEPENDENCIAS GULP
*/
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    jshint = require('gulp-jshint'),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    wiredep = require('wiredep').stream,
    nib=require('nib'),
    imagemin = require('gulp-imagemin'),
    rimraf = require('gulp-rimraf'),
    uglify = require('gulp-uglify');

/*
* Configuración Servidor de Desarrollo
*/
gulp.task('dev', function () {
    browserSync.init({
        server: {
            baseDir: "./source",
            hostname: '0.0.0.0',
            livereload: true,
        },
        files: ["source/**/**/**/**/*.*"],
        //browser: 'google-chrome',
        port: 8001,
    });

});


//Verificar cambios en el html
gulp.task('html', function () {
    gulp.src('./source/**/**/*.html')
        .pipe(browserSync.stream());
});

// Preprocesa archivos Stylus a CSS
gulp.task('css', function () {
    gulp.src('./source/app/**/*.styl')
        .pipe(stylus({
            use: nib(),
        }))
        .pipe(gulp.dest('./source/app/'))
        .pipe(browserSync.stream());
});

// Preprocesa archivos jade a html
gulp.task('jadeTohtml', function () {
    gulp.src('./source/app/**/*.jade')
        .pipe(jade({
          pretty: true
        }))
        .pipe(gulp.dest('./source/app/'))
        .pipe(browserSync.stream());
});


//Encuentra error JS
gulp.task('js', function () {
    return gulp.src('./source/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(browserSync.stream());
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function () {
    var sources = gulp.src(['./source/app/**/*.js', './source/app/**/*.css']);
    return gulp.src('index.html', { cwd: './source' })
        .pipe(inject(sources, {
            read: false,
            ignorePath: '/source'
        }))
        .pipe(gulp.dest('./source'))
       // .pipe(browserSync.stream());
});




//Ejecuta tareas si se realiza algún cambio
gulp.task('watch', [ 'html', 'css','jadeTohtml','js','inject','imagenes'], function () {
    gulp.watch(['source/**/**/*.html', 'source/**/**.html', 'source/*.html'], ['html']);
    gulp.watch('source/app/**/*.styl', ['css', 'inject']);
    gulp.watch('source/app/**/*.jade', ['jadeTohtml']);
    gulp.watch('source/app/**/*.js', ['js', 'inject']);

});





//Servidor desarrollo
gulp.task('default', ['inject', 'dev', 'watch']);
//gulp.task('desarrollo', ['dev', 'inject', 'watch']);


/*
* Servidor de Producción
*/
gulp.task('build', function () {
    browserSync.init({
        server: {
            baseDir: "./dist",
            hostname: '0.0.0.0',
            livereload: true,
        },
        //files: ["source/**/*.*"],
        //browser: 'google-chrome',
        port: 8080,
    });

});

gulp.task('imagenes', function () {
    return gulp.src(['source/images/*.*'])
        .pipe(imagemin({
          progressive: true
        }))
        .pipe(gulp.dest('dist/images/'))
        .pipe(browserSync.stream());
});


//Servidor Producción
gulp.task('produccion', ['build']);
