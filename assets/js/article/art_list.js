$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    //定义一个美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义一个补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询参数对象
    // 将来查询的时候去将请求对象提交到服务器
    let q = {
        pagenum: 1,  //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //	文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    initTable()

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败')
                }
                // 获取成功
                let arr = template('tpl-table', res)
                $('tbody').html(arr)
                // console.log($('tbody').html());
                // console.log(res);
                // console.log(new Date().toLocaleString());

                // 调用分页方法
                renderPage(res.total)
            }
        })
    }


    // 初始化分类模块
    initCate()
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表信息失败')
                }
                // console.log(res.data);
                let fenlei = template('tpl-cate', res)
                $('[name="city-id"]').html(fenlei)

                //    通过 layui 重新渲染表单的ＵＩ结构
                form.render()

                // xuanranlist(res.data)
            }
        })
    }

    // 给表单添加 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单元素
        let cate_id = $('[name="city-id"]').val()
        let state = $('[name="state"]').val()
        // 重新给q赋值
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    // 分类列表渲染
    /* function xuanranlist(data) {
        let arr = `<option value="">所有分类</option>`
        data.forEach(function (item) {
            arr += `<option value="${item.Id}">${item.name}</option>`
        })
        // console.log(arr);
        $('[name="city-id"]').html(arr)
    } */


    // 定义分页的方法
    function renderPage(total) {
        // console.log(total);

        // 调用 laypage.render 方法来去渲染分页
        laypage.render({
            elem: 'pageBox',//指向存放分页的容器
            count: total, //数据总数。一般通过服务端得到
            limit: q.pagesize, //每页显示的条数。
            curr: q.pagenum, //起始页
            limits: [2, 3, 5, 10],
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

            // 当分页被切换时触发,触发jump
            // 触发 jump 有两种
            // 1.当点击分页节触发
            // 2.当调用 laypage.render 方法就会触发jump
            jump: function (obj, first) {
                // 通过 first 的值来判断是通过哪个方式触发 jump 的
                // 通过调用 laypage.render 方式触发，则 first 的值为 true ; 否则为undifild

                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                // 根据最新的q,来获取列表数据
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除功能
    $('tbody').on('click', '.btn-delete', function (e) {
        let newid = $(this).attr('data-id')
        // 获取删除按钮的个数
        let len = $('.btn-delete').length
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
            //do something

            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + newid,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index);

                    // 当数据删除完以后，我们要判断当前页面是否还有数据
                    // 如果当前页面没有数据了，则页码值减一在执行渲染
                    // 如果页面删除按钮,只有一个了，那么就让页码值减一
                    if (len === 1) {
                        // 页面码的最小值是 1，如果等于一了就不能再减了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable()
                }
            })

        });
    })

    // 编辑功能
    $('tbody').on('click', '.btn-bianji', function (e) {
        e.preventDefault()
        let newid = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + newid,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章信息失败')
                }
                // console.log(res.data);
                $('#chushimokuai').hide()
                $('#bianjimokuai').show()
                // 快速填充表单数据
                form.val('layui-forms', res.data)
                // form.render()
                wenzhangBianJi(res.data)
            }

        })
    })

    // 编辑文章的函数
    function wenzhangBianJi(data) {
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
        $('#layui-forms').on('submit', function (e) {
            e.preventDefault()

            // 基于form表单，快速创建一个 formData对象
            let fd = new FormData($(this)[0])
            // 将文章的发布状态添加的formData对象中
            fd.append('state', art_sate)
            fd.append('Id', data.Id)
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
                url: '/my/article/edit',
                data: fd,
                // 注意如果是向服务器提交的是 formData 格式
                // 则一定要加上以下两个属性
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('编辑失败')
                    }
                    layer.msg('编辑成功')
                    // console.log('发布成功');
                    location.href = './art_list.html'
                }
            })
        }

    }
})