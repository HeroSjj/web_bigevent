// 入口函数
$(function () {
    getUserinfo()

    const layer = layui.layer
    // 点击退出弹出询问框，然后确定退出后跳转页面
    $('#btnLogout').on('click', function () {
        // 提示用户是否退出
        layer.confirm('确认退出登陆？', { icon: 3, title: '提示' }, function (index) {
            //do something

            // 先清除本地的token
            localStorage.removeItem('token')

            // 在切换到登陆页面
            location.href = '/login.html'

            // 关闭confirm询问框
            layer.close(index);
        });
    })


})
// 发起ajax请求获取用户基本信息
function getUserinfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return console.log('获取失败');
            }
            // 调用一个函数
            renderAvtar(res.data)

        },

        // 无论成功还是失败，最终都会调用一个complete回调函数
        // complete: function (res) {
        //     // console.log('执行了complete回调函数');
        //     console.log(res);

        //     // 在complete回调函数中，可以使用res.responseJSON来获取返回的值
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {

        //         // 清除本地的token
        //         localStorage.removeItem('token')

        //         // 跳转到登陆页面
        //         location.href = '/login.html'
        //     }
        // }

    })
}
// 渲染用户头像
function renderAvtar(user) {
    // 获取用户名称
    let mingzi = user.nickname || user.username
    // 渲染名称
    $('#welcome').html(`你好 ${mingzi}`)

    // 渲染头像
    // 判断获取的头像是否为空
    if (user.user_pic !== null) {
        // 不为空，则调用.attr()方法修改src属性
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let sou = mingzi[0].toUpperCase()
        $('.avatar').html(sou).show()
    }
}