$(function () {
    const layer = layui.layer
    const form = layui.form
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                // 调用函数
                xuanranList(res.data)
            }
        })
    }


    // 渲染表格
    function xuanranList(ress) {
        let arr = ''
        ress.forEach(function (item) {
            arr += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.alias}</td>
                        <td>
                        <button type="button" class="layui-btn layui-btn-xs btn-bianji" data-id=${item.Id}>编辑</button>
                        <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-shanchu" data-ids=${item.Id}>删除</button>
                        </td>
                    </tr>`
        })
        $('tbody').html(arr)
    }

    let tianjiatanchu = null
    // 点击添加跳出一个弹窗口
    $('#btn_addlei').on('click', function () {
        tianjiatanchu = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '添加文章分类',
            content: $('.tanchukuang').html()
        });
        // console.log($('.tanchukuang').html());


    })
    // 通过代理的形式给表单添加提交事件
    $('body').on('submit', '#form_meiyuan', function (e) {
        e.preventDefault()

        // console.log($(this).serialize());
        $.ajax({
            url: '/my/article/addcates',
            type: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加失败')
                }
                // 从新渲染表格
                initArtCateList()
                layer.msg('添加成功了')
                // 关闭当前弹窗
                layer.close(tianjiatanchu)
            }
        })
    })

    // 通过代理的形式给表单添加编辑事件
    let xiugaitanchu = null
    $('tbody').on('click', '.btn-bianji', function () {
        // console.log('ok');

        // 点击跳出一个框
        xiugaitanchu = layer.open({
            area: ['500px', '250px'],
            type: 1,
            title: '修改文章分类',
            content: $('.tanchukuang_xiugai').html()
        });


        // 拿到对用的id
        let id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {

                    return layer.msg('获取失败')
                }
                // layer.msg('获取成功')

                form.val('form_xiugai', res.data)
            }
        })
    })

    // 通过代理给修改元素绑定一个submit的事件
    $('body').on('submit', '#form_xiugai', function (e) {
        e.preventDefault()

        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败')
                }
                layer.msg('修改成功')
                // 关闭弹窗
                layer.close(xiugaitanchu)
                // 从新渲染表格
                initArtCateList()
            }
        })
    })


    // 通过代理给每一个元素添加删除事件
    $('tbody').on('click', '.btn-shanchu', function () {
        // 拿到对用的id
        let id = $(this).attr('data-ids')
        layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, function (index) {
            //do something

            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')

                    // 关闭提示框
                    layer.close(index);
                    // 重新渲染表格
                    initArtCateList()
                }
            })


        });

    })
})