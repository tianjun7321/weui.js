import $ from '../util/util';
import tpl from './dialog.html';

const $body = $('body');
let _sington;

/**
 * dialog，弹窗，alert和confirm的父类
 *
 * @param {Object=} options 配置项
 * @param {string=} options.title 弹窗的标题
 * @param {string=} options.content 弹窗的内容
 * @param {string=} options.className 弹窗的自定义类名
 * @param {array=} options.buttons 按钮配置项
 *
 * @param {string} [options.buttons[].label=确定] 按钮的文字
 * @param {string} [options.buttons[].type=primary] 按钮的类型 [primary, default]
 * @param {function} [options.buttons[].onClick=$.noop] 按钮的回调
 *
 * @example
 * weui.dialog({
 *     title: 'dialog标题',
 *     content: 'dialog内容',
 *     className: 'custom-classname',
 *     buttons: [{
 *         label: '取消',
 *         type: 'default',
 *         onClick: function () { alert('取消') }
 *     }, {
 *         label: '确定',
 *         type: 'primary',
 *         onClick: function () { alert('确定') }
 *     }]
 * });
 */
function dialog(options = {}) {
    if(_sington) return _sington;

    const isAndroid = $.os.android;
    options = $.extend({
        title: null,
        content: '',
        className: '',
        buttons: [{
            label: '确定',
            type: 'primary',
            onClick: $.noop
        }],
        isAndroid: isAndroid
    }, options);

    const $dialogWrap = $($.render(tpl, options));
    const $dialog = $dialogWrap.find('.weui-dialog');
    const $mask = $dialogWrap.find('.weui-mask');

    function hide(callback = $.noop){
        $mask.addClass('weui-animate-fade-out');
        $dialog
            .addClass('weui-animate-fade-out')
            .on('animationend webkitAnimationEnd', function () {
                $dialogWrap.remove();
                _sington = false;
                callback();
            });
    }

    $body.append($dialogWrap);
    // 不能直接把.weui-animate-fade-in加到$dialog，会导致mask的z-index有问题
    $mask.addClass('weui-animate-fade-in');
    $dialog.addClass('weui-animate-fade-in');

    $dialogWrap.on('click', '.weui-dialog__btn', function (evt) {
        const index = $(this).index();
        hide(() => {
            options.buttons[index].onClick && options.buttons[index].onClick.call(this, evt);
        });
    });

    $dialogWrap.hide = hide;
    _sington = $dialogWrap;
    return $dialogWrap;
}
export default dialog;
