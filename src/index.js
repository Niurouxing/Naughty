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