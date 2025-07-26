// src/core/manager.js (Corrected Version)

// 导入SillyTavern的核心功能
// 从 /script.js 导入通用功能
import { eventSource, event_types,saveSettingsDebounced,  } from '/script.js';
// 从 /scripts/extensions.js 导入插件专用功能
import { getContext, extension_settings, renderExtensionTemplateAsync } from '/scripts/extensions.js';
import { Popup, POPUP_TYPE, callGenericPopup } from '/scripts/popup.js';

// 导入插件的默认设置
import { defaultSettings } from '../data/pluginSetting.js';

// 应用管理器 (APP): 封装SillyTavern原生API
export const APP = {
    getContext,
    eventSource,
    event_types,
    renderExtensionTemplateAsync,
};

// 用户数据管理器 (USER): 专门处理插件设置的读取和保存
export const USER = {
    // 使用Proxy来优雅地处理设置的获取和回退
    settings: new Proxy({}, {
        get(_, property) {
            const settings = extension_settings.naughty_settings;
            if (settings && property in settings) {
                return settings[property];
            }
            // 如果用户设置中不存在，则从默认设置中获取
            return defaultSettings[property];
        },
        set(_, property, value) {
            if (!extension_settings.naughty_settings) {
                extension_settings.naughty_settings = {};
            }
            extension_settings.naughty_settings[property] = value;
            // 使用SillyTavern提供的带防抖的保存函数
            saveSettingsDebounced();
            return true;
        },
    }),
    saveSettings: saveSettingsDebounced,
};

// 编辑器/UI管理器 (EDITOR): 封装UI操作，如弹窗
export const EDITOR = {
    Popup,
    POPUP_TYPE,
    callGenericPopup,
};

// 系统工具管理器 (SYSTEM): 封装系统级操作，如加载HTML模板
export const SYSTEM = {
    getTemplate: (name) => {
        // --- 修改开始 ---
        // 我们需要提供从 /public/extensions/ 目录开始的完整相对路径
        // 我们的插件位于 /public/extensions/third-party/naughty/
        // 因此，模板目录的正确路径是 'third-party/naughty/assets/templates'
        return APP.renderExtensionTemplateAsync('third-party/naughty/assets/templates', name);
        // --- 修改结束 ---
    },
};