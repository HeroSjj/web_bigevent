$(function () {

    const form = layui.form
    const layer = layui.layer
    // 验证表单正则
    form.verify({
        // 密码在6到12位之间
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],

        // 新密码不能和原密码一样
        samePwd: function (value) {
            if (value === $('[name="oldPwd"]').val()) {
                return '新旧密码不能相同'
            }
        },

        // 确认密码要和新密码一样
        rePwd: function (value) {
            if (value !== $('[name="newPwd"]').val()) {
                return '两次密码不同'
            }
        }
    })

    // 表单提交修改密码

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败')
                }

                layer.msg('修改密码成功')

                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})