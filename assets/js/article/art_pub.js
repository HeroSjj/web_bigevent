$(function () {
    const layer = layui.layer
    const form = layui.form

    // 获取表单分类函数
    initCate()
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取初始化表单分类失败')
                }
                // console.log('ok');
                // 渲染下拉列表
                let newStr = template('tpl-cate', res)
                $('[name="cate_id"]').html(newStr)

                //// 记住一定要重新 layui 加载渲染
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //给选择封面按钮添加点击事件
    $('#xuangzhefengmian').on('click', function () {
        $('#wenFile').click()
    })
    // 给 wenFile 添加change事件
    $('#wenFile').on('change', function (e) {
        // 拿到用户选择的文件
        let files = e.target.files

        // 在判断是否拿到新文件
        if (files.length === 0) {
            return
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        let newImgURL = URL.createObjectURL(files[0])

        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 定义一个变量为默认发布
    let art_sate = '已发布'

    // 给存为草稿按钮，添加点击事件
    $('#btnSava').on('click', function () {
        art_sate = '草稿'
    })

    // 为表单添加 submit 事件
    $('#layui-form').on('submit', function (e) {
        e.preventDefault()

        // 基于form表单，快速创建一个 formData对象
        let fd = new FormData($(this)[0])
        // 将文章的发布状态添加的formData对象中
        fd.append('state', art_sate)
        //循环打印看一下结果
        // fd.forEach(function (item, k) {
        //     console.log(k, item);
        // })

        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 把文件添加到 fd 中
                fd.append('cover_img', blob)
                // 最后发起ajax请求添加新文章
                publishArticle(fd)
            })
    })
    // 封装一个ajax 发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意如果是向服务器提交的是 formData 格式
            // 则一定要加上以下两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败')
                }
                // console.log('发布成功');
                location.href = './art_list.html'
            }
        })
    }
})