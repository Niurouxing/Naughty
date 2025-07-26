// src/settings.js
/* global SillyTavern */

// 为你的插件定义一个独一无二的标识符
export const MODULE_NAME = 'enhanced_demo_extension';

// 定义默认设置
export const defaultSettings = {
    enableInterceptor: true, 
    systemNoteContent: "This note was added by the default interceptor.",
};

// 获取或初始化设置的函数
export function getSettings() {
    const { extensionSettings } = SillyTavern.getContext();
    if (!extensionSettings[MODULE_NAME]) {
        extensionSettings[MODULE_NAME] = { ...defaultSettings };
    }
    // 确保所有默认键都存在（在插件更新后很有用）
    return { ...defaultSettings, ...extensionSettings[MODULE_NAME] };
}