(function($, win) {

    $.fn.distributeNav = function(opts) {
        var setting = {
            item: '.btn',
            center: '.center-btn',
            rotate: 0, //位置旋转角度
            isHide: false, //鼠标放在导航上是否隐藏其余导航
            trigger: 'click',
            selector: $.noop,
            open: $.noop,
            close: $.noop
        };

        opts = $.extend({}, setting, opts);

        return this.each(function() {
            var
                _this = this,
                item = $(opts.item, this),
                center = $(opts.center, this),
                ring = $(opts.ring, this),
                flag = true,
                visible = false,
                trigger = opts.trigger == 'click' ? true : false;

            close();

            if (trigger) {
                center.on('click', function() {
                    visible ? close() : open();
                });
                item.on('click', function() {
                    if (opts.isHide) {
                        onItem(this);
                    }
                    opts.selector(this);
                });
            } else {
                $(this).mouseleave(function() {
                    if (visible) {
                        close();
                    }
                });

                center.mouseenter(function() {
                    flag = false;
                    open();
                });


                item.hover(function() {
                    var that = this;
                    that.f = true;
                    setTimeout(function() {
                        if (that.f) {
                            if (opts.isHide) {
                                onItem(that);
                            }
                            opts.selector(that);
                        }
                    }, 200);
                }, function(evt) {
                    var that = this;
                    that.f = false;
                    if (opts.isHide) {
                        close();
                    }
                });
            }



            function getPosition(container, count) {
                var
                    baseRadians = (Math.PI / 180),
                    radians = baseRadians * (360 / count),
                    /* 等分后的弧度值 */
                    r = container.width() / 2,
                    /* 外圆半径 */
                    ox = r,
                    /* 圆心x坐标值 */
                    oy = r,
                    /* 圆心y坐标值 */
                    i = 0,
                    halfLen = count / 2,
                    position = [],
                    ar = baseRadians * opts.rotate;

                for (; i < count; i++) {
                    var
                        radVal = radians * i + ar,
                        sinVal = Math.sin(radVal),
                        cosVal = Math.cos(radVal),
                        l = Math.round(ox - r * sinVal),
                        t = Math.round(oy - r * cosVal);

                    position.push({
                        left: l,
                        top: t
                    });

                }
                return position;
            }

            function open() {
                var
                    count = item.length,
                    w = item.width() / 2,
                    h = item.height() / 2,
                    posArr = getPosition($(_this), count), //获取分散点坐标
                    i = 0;

                //显示按钮和圆环
                item.show();
                ring.show();


                setTimeout(function() {
                    for (; i < count; i++) { //循环分散点坐标 ，修改菜单位置 ，
                        item.eq(i).css({
                            left: posArr[i].left - w,
                            top: posArr[i].top - h
                        });
                    }
                    ring.css({
                        transform: 'scale(1)'
                    });
                });

                visible = true;

                opts.open(visible);
            }

            function close(not) {
                var
                    w = item.width() / 2,
                    h = item.width() / 2,
                    l = $(_this).width() / 2,
                    t = l;

                flag = true;
                //筛选出当前正在选择的菜单，设置其他菜位置居中  隐藏所有菜单列表
                item.not(not).css({
                    left: l - w,
                    top: t - h,
                    zIndex: 0
                });

                //缩放圆环
                ring.css({
                    transform: 'scale(0)'
                });

                //位置设置好之后，隐藏菜单和圆环
                setTimeout(function() {

                    //如果flag不是true 则视为正在执行open()方法，中断关闭方法
                    if (flag) {
                        item.not(not).hide();
                        ring.hide();

                        visible = false;

                        if (!!!not) {
                            opts.close(visible);
                        }
                    }
                }, 300);



            }

            function onItem(that) {
                var _this = $(that);

                //设置当前选中的菜单层级最高
                _this.css('zIndex', 1).siblings(opts.item).css('zIndex', 0);

                //触发close方法，隐藏其余菜单
                close(_this);
            }

            function scelctor() {

            }
        });
    };

})(jQuery, window);