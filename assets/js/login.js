(function () {
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    let form = layui.form
    // 从layui中获取layer对象
    let layer = layui.layer

    // 自定义正则验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            const pwd = $('.reg-box [name="password"]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }

        }
    })


    // 监听注册post事件
    $('#form_reg').on('submit', function (e) {
        // 清除默认提交事件
        e.preventDefault()
        let date = {
            username: $('.reg-box [name="username"]').val(), password: $('.reg-box [name="password"]').val()
        }
        // 发起ajax的请求
        $.post('/api/reguser', date, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // console.log('注册成功了');
            layer.msg('注册成功了,去登陆');
            // 模拟人的点击行为
            $('#link_login').click()
        })
    })

    // 监听登陆页面提交
    $('#link_login').submit(function (e) {
        // 阻止默认提交
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            type: 'POST',
            // 快速获取表单的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登陆成功')
                // 将登陆成功获得的token的值,保存到localStorage本地内存中
                // console.log(res.token);
                localStorage.setItem('token', res.token)
                // 跳转到个人中心页面
                location.href = '/index.html'
            }
        })
    })
}());