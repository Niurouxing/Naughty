import { USER } from '../../core/manager.js';

/**
 * 渲染设置界面的当前值
 */
function renderSettings() {
    $('#naughty_enabled_switch').prop('checked', USER.settings.isEnabled);
    $('#naughty_demo_string_input').val(USER.settings.demoString);
}

/**
 * 绑定UI元素的事件监听
 */
function bindEvents() {
    // 插件总开关
    $('#naughty_enabled_switch').on('change', function() {
        USER.settings.isEnabled = $(this).is(':checked');
    });

    // 演示字符串输入框
    $('#naughty_demo_string_input').on('input', function() {
        USER.settings.demoString = $(this).val();
    });
}

/**
 * 加载设置的主函数
 */
export function loadSettings() {
    renderSettings();
    bindEvents();
    console.log("Naughty settings UI loaded and events bound.");
}