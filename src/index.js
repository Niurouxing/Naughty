// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getSettings } from './settings';

/* global SillyTavern, SlashCommandParser, SlashCommand */

// 1. 注册 Prompt Interceptor (这部分通常没有时序问题，因为getContext是早期可用的)
// 这个函数必须在全局作用域中定义，名称与 manifest.json 中的一致
globalThis.enhancedDemoInterceptor = async function(chat, contextSize, abort, type) {
    const settings = getSettings();

    if (settings.enableInterceptor && settings.systemNoteContent) {
        console.log('Enhanced Demo Interceptor is running!');
        const systemNote = {
            is_user: false,
            name: "System Note",
            send_date: Date.now(),
            mes: settings.systemNoteContent,
        };
        // 在最后一条消息前插入系统笔记
        if (chat.length > 0) {
            chat.splice(chat.length - 1, 0, systemNote);
        }
    }
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
    // 确保只添加一次UI
    const existingRoot = document.getElementById('enhanced-demo-extension-root');
    if (!existingRoot) {
        const rootElement = document.createElement('div');
        rootElement.id = 'enhanced-demo-extension-root'; // 给根元素一个ID防止重复渲染
        rootContainer.appendChild(rootElement);

        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
}