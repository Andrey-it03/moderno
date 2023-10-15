const {src, dest, watch, parallel, series} = require('gulp'); 

const scss        = require('gulp-sass')(require('sass')); // Перевод псевдоклассов
const concat      = require('gulp-concat');            // Можно еще конкатенировать(сжимать) файлы и переименовать файлы
const uglify      = require('gulp-uglify-es').default; // Плагин для сжатия файлов js
const browserSync = require('browser-sync').create(); // Плагин обновления браузера
const autoprefixer= require('gulp-autoprefixer');
const clean       = require('gulp-clean');
const avif        = require('gulp-avif');
const webp        = require('gulp-webp');
const imagemin    = require('gulp-imagemin');
const newer      = require('gulp-newer');
const svgSprite  = require('gulp-svg-sprite');
const ttf2woff2    = require('gulp-ttf2woff2');
const fonter     = require('gulp-fonter');
const include    = require('gulp-include');


function styles() {
    return src('app/scss/style.scss')  
        .pipe(autoprefixer({ovverideBrowserslist: ['last 10 version']})) // Подежривание прфиксов более старых версии
        .pipe(concat('style.min.css'))  // Изменение имени файла
        .pipe(scss({outputStyle: 'compressed' })) // Сжатие файла можно прописать expanded будет отображатся обычный css
        .pipe(dest('app/css')) // Вывод измененого файла
        .pipe(browserSync.stream()) // Автоматическое обновление в браузере
}
function libs(){
    return src(
        'node_modules/normalize.css/normalize.css',
        
    )
    .pipe(autoprefixer({ovverideBrowserslist: ['last 10 version']}))
    .pipe(concat('libs.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts(){
    return src([
        'app/js/main.js',
        'node_modules/mixitup/dist/mixitup.js'
    ]) 
    .pipe(concat('main.min.js')) // Изменение имени файла, обьединения фаила
    .pipe(uglify())              // Сжатие js файлов
    .pipe(dest('app/js'))        // Вывод измененого файла
    .pipe(browserSync.stream()) // Автоматическое обновление в браузере
}

function fonts(){
    return src('app/fonts/src/*.*')
    .pipe(fonter({
        formats: ['woff', 'ttf']  // Перевод всех форматов шрифтов 
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())  //  Работает только с форматом ttf
    .pipe(dest('app/fonts'))
}

function pages(){
    return src('app/pages/*.html')
    .pipe(include({
        includePaths: 'app/components'
    }))
    .pipe(dest('app'))
    .pipe(browserSync.stream())
}

function images(){
    return src('app/images/src/*/*.*', '!app/images/src/*.svg') // Конвертация всех форматов, кроме svg
    .pipe(newer('app/images')) // Проверка на существование картинки
    
    .pipe(avif({quality : 50 })) // Сжатие картинки

    .pipe(newer('app/images')) // Проверка на существование картинки
    .pipe(src(
        'app/images/src/*/*.*',
        'app/images/home_page/content/*.*'
        ))
    .pipe(webp())

    .pipe(newer('app/images')) // Проверка на существование картинки
    .pipe(src('app/images/src/*/*.*'))
    .pipe(imagemin())

    .pipe(dest('app/images')) //Минимизация картинок
}

function sprite(){
    return src('app/images/*.svg')
    .pipe(svgSprite({
        mode : {
            stack: {
                sprite: '../sprite.svg',
                example: true
            }
        }
    }))
    .pipe(dest('app/images'))
}

function watching(){
    browserSync.init({
                server: {
                    baseDir:"app/"
                }
            });
    watch(['app/scss/style.scss'], styles) //Изменение фала в настоящие время
    watch(['app/scss/*.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/images/src'], images) //Изменение фала в настоящие время
    watch(['app/components/*', 'app/pages/*'], pages)
    watch(['app/**/*.html']).on('change', browserSync.reload)  
}

// function browsersync(){   // Обновление в браузере
//     browserSync.init({
//         server: {
//             baseDir:"app/"
//         }
//     });
// }

function cleanDist(){ // Удаление файлов в папке dist при редактировании
    return src('dist')
    .pipe(clean())
}


function building(){
    return src([
        'app/css/style.min.css',
        'app/images/*.*',
        '!app/images/*.svg',
        '!app/images/stack',
        'app/images/dist/sprite.svg',
        'app/fonts/*.*',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base : 'app'}) // сохранить структуру при переносе файлов
    .pipe(dest('dist'))
}


// Запуск изменении в файлах
exports.styles = styles;
exports.scripts = scripts;
// exports.browsersync = browsersync; 
exports.images = images;
exports.sprite  = sprite;
exports.building = building;
exports.watching = watching;
exports.fonts = fonts;
exports.pages = pages;
exports.libs = libs;
exports.build = series(cleanDist, building);              // Последовательное удаление и запись

exports.default = parallel(styles, scripts, images, pages, libs,/*browsersync,*/watching); //Обновление всех файлов одновременно через, команду gulp