// 注意每次调用。get,.post和$.sjax()的
// 时候都会先调用ajaxPrefilter 这个函数
// 在这个函数中可以拿到ajax的配置对象
$.ajaxPrefilter(function (option) {
    option.url = 'http://www.liulongbin.top:3007' + option.url
})