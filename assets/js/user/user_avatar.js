const layer = layui.layer

// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)


// 点击上传
$('#btn_shangchuan').on('click', function () {
    $('#file').click()

    $('#file').on('change', function (e) {
        // console.log(e.target.files);
        // 获取用户选择的文件
        const filelist = e.target.files

        // 先判断是否拿到新文件
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        //1 拿到用户选择的文件
        const file = e.target.files[0]
        // 2根据选择的文件，创建一个对应的 URL 地址：
        const imgUrl = URL.createObjectURL(file)
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

    })

    // 点击确定更换图片
    $('#btn_queding').on('click', function () {
        const dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 
        $.ajax({
            url: '/my/update/avatar',
            type: 'POST',
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更改图片失败')
                }

                layer.msg('更换头像成功')
                // 则调用父页面，里面的方法重新渲染头像
                window.parent.getUserinfo()
            }
        })

    })
})