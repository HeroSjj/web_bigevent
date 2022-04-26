// 注意每次调用。get,.post和$.sjax()的
// 时候都会先调用ajaxPrefilter 这个函数
// 在这个函数中可以拿到ajax的配置对象
$.ajaxPrefilter(function (option) {
    // 在发起真正的ajax之前，拼接根目录
    option.url = 'http://www.liulongbin.top:3007' + option.url

    // 统一为有权限的接口，设置headers
    // 需要判断一下
    if (option.url.indexOf('/my') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 全局统一挂载complete 回调函数
    option.complete = function (res) {
        // console.log('执行了complete回调函数');
        console.log(res);

        // 在complete回调函数中，可以使用res.responseJSON来获取返回的值
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {

            // 清除本地的token
            localStorage.removeItem('token')

            // 跳转到登陆页面
            location.href = '/login.html'
        }
    }
})