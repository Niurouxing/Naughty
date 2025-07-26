// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 假设你有一个设置文件来控制拦截器是否启用
import { getSettings, MODULE_NAME } from './settings'; 

/* global SillyTavern, SlashCommandParser, SlashCommand */

// ============================================================================
// == 自定义生成拦截器 (Custom Generation Interceptor)
// ============================================================================

// 这个函数必须定义在全局作用域中，名称与 manifest.json 中的一致
globalThis.customGenerationInterceptor = async function(chat, contextSize, abort, type) {
    console.log('[Interceptor] Fired! Generation type:', type);
    
    // 从插件设置中获取拦截器是否启用
    const settings = getSettings();
    if (!settings.enableInterceptor) {
        console.log('[Interceptor] Interceptor is disabled in settings. Skipping.');
        return; // 如果未启用，则直接返回，让SillyTavern继续原生流程
    }

    // 1. *** 阻断原生生成流程 ***
    abort(true);
    console.log('[Interceptor] Aborted native SillyTavern generation.');

    // 2. *** 执行自定义生成流程 (演示) ***
    console.log('[Interceptor] Starting custom generation process...');

    // *** 修正点 1: 只解构我们确定存在的API ***
    // 我们从 getContext() 中只获取确认可用的函数。
    // 根据SillyTavern的实现，addOneMessage 是一个较为稳定和基础的API。
    const { addOneMessage, chat: currentChat, characters, characterId } = SillyTavern.getContext();

    // 由于 spinner 函数不可靠，我们在这里可以打印一条 "Thinking..." 消息到控制台来模拟状态
    console.log('[Interceptor] Custom logic is "thinking"...');
    
    // 模拟异步操作，比如API调用
    await new Promise(resolve => setTimeout(resolve, 1500)); // 模拟1.5秒的延迟

    // 这是我们自定义的固定回复
    const customResponseText = "这是由我的React插件完全接管并生成的固定回复！";
    
    console.log('[Interceptor] Custom generation complete. Response:', customResponseText);

    // 3. *** 将结果“送回”SillyTavern ***
    
    // a) 移除SillyTavern可能已经添加的临时"Thinking..."消息
    // SillyTavern 在调用拦截器之前可能已经向UI添加了一个临时的“正在思考”消息。
    // 如果存在，我们需要先将其移除。
    if (currentChat.length > 0 && currentChat[currentChat.length - 1].is_system) {
        if (currentChat[currentChat.length - 1].mes.includes('Thinking...')) {
             currentChat.pop();
        }
    }
    
    // b) 构造AI消息对象
    const aiMessage = {
        is_user: false,
        name: characters[characterId].name, // 使用当前角色的名字
        mes: customResponseText,
        send_date: Date.now(),
        is_system: false,
    };
    
    // c) *** 修正点 2: 使用我们正确解构出来的函数 ***
    // `addOneMessage` 是一个异步函数，它会处理消息的添加、UI的更新和保存。
    await addOneMessage(aiMessage);

    // (移除了 hideSpinner 调用)
    
    console.log('[Interceptor] Custom response has been added to the chat.');
};

// 2. 注册 Slash Command (使用更可靠的等待机制)

/**
 * 等待SillyTavern的API加载完成
 * @param {Function} callback 当API准备好时要执行的回调函数
 */
function waitForApi(callback) {
    const interval = setInterval(() => {
        // SlashCommandParser 是由SillyTavern的核心脚本加载到全局的
        if (window.SlashCommandParser && window.SlashCommand) {
            clearInterval(interval);
            callback();
        }
    }, 100); // 每100毫秒检查一次
}

// 等待API准备好后，再执行注册逻辑
waitForApi(() => {
    console.log('Slash command API is ready. Registering /demoplugin-info');
    try {
        SlashCommandParser.addCommandObject(SlashCommand.fromProps({
            name: 'demoplugin-info',
            callback: () => {
                const settings = getSettings();
                // 将设置对象格式化为字符串返回
                return `Enhanced Demo Plugin Status:\n- Interceptor Enabled: ${settings.enableInterceptor}\n- Note Content: "${settings.systemNoteContent}"`;
            },
            aliases: ['demo-info'],
            returns: 'the current status of the demo plugin settings',
            helpString: 'Displays the current settings of the Enhanced Demo Plugin.',
        }));
    } catch (error) {
        console.error('Failed to register slash command:', error);
    }
});


// 3. 渲染React UI
const rootContainer = document.getElementById('extensions_settings');
if (rootContainer) {
    const existingRoot = document.getElementById('enhanced-demo-extension-root');
    if (!existingRoot) {
        const rootElement = document.createElement('div');
        rootElement.id = 'enhanced-demo-extension-root';
        rootContainer.appendChild(rootElement);

        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
}