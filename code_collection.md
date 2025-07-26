### index.js
```
import { APP, USER, EDITOR, SYSTEM } from './core/manager.js';
import { loadSettings } from './scripts/settings/userExtensionSetting.js';

console.log("______________________ Naughty Plugin: Loading ______________________");

/**
 * Naughty Interceptor Function
 * 
 * This function is registered via manifest.json's "generate_interceptor".
 * SillyTavern will call it right before making an LLM request.
 * 
 * @param {Array} chat - The chat history array that will be used for the prompt. Mutable.
 * @param {Number} contextSize - The current token count.
 * @param {Function} abort - A function to call to stop the generation. Call with `true` to stop subsequent interceptors.
 * @param {String} type - The type of generation trigger (e.g., 'send', 'regenerate').
 */
globalThis.naughtyInterceptor = async function(chat, contextSize, abort, type) {
    const settings = USER.settings;

    // 如果插件被禁用，则直接返回，让SillyTavern继续正常流程
    if (!settings.isEnabled) {
        return;
    }

    console.log(`[Naughty] Intercepting generation of type: ${type}`);

    // 1. 中止SillyTavern的原始生成流程
    // The `true` argument prevents other interceptors from running after this one.
    abort(true);
    
    // 2. 伪造一个AI回复
    // 这是最直接的方式，手动将一条消息添加到聊天记录中
    const context = APP.getContext();
    const characterName = context.characters[context.characterId].name;
    const demoMessage = {
        is_user: false,
        name: characterName,
        mes: settings.demoString,
        is_system: false,
        send_date: Date.now(),
        extra: {},
    };

    // 使用SillyTavern的API来添加消息并更新UI
    // Note: In older versions, you might need to push to context.chat and call context.updateChat()
    // but addOneMessage is a more modern and robust way.
    context.addOneMessage(demoMessage);

    console.log(`[Naughty] Generation aborted and replaced with demo message.`);
};


// 主初始化函数
jQuery(async () => {
    // 注入设置UI
    try {
        const settingsHtml = await SYSTEM.getTemplate('settings');
        // 将设置界面添加到SillyTavern的扩展设置区域
        $('#extensions_settings').append(settingsHtml);
        loadSettings();
    } catch (error) {
        console.error("[Naughty] Failed to load settings UI.", error);
    }
    
    console.log("______________________ Naughty Plugin: Loaded Successfully ______________________");
});
```

### core/manager.js
```
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
```

### data/pluginSetting.js
```
export const defaultSettings = {
    isEnabled: true,
    demoString: "This message was intercepted and replaced by the Naughty plugin.",
};
```

### scripts/settings/userExtensionSetting.js
```
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
```
