$(function () {
    const form = layui.form
    const layer = layui.layer
    form.verify({

        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须在1~6字符之间'
            }
        }
    })
    initUserinfo()
    // 初始化用户信息
    function initUserinfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('读取用户信息错误')
                }
                // console.log(res);

                // 调用form.val()方法快速赋值
                form.val('initUserinfo', res.data)
            }
        })
    }

    // 重置表单数据
    $('#btn_user').on('click', function (e) {
        // 阻止重置的默认行为
        e.preventDefault()

        // 再次调用赋值
        initUserinfo()
    })


    // 提交修改表单
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                // 调用父元素中的方法，重新渲染用户头像和用户信息
                window.parent.getUserinfo()
            }
        })
    })
})