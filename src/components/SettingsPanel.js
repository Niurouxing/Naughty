// src/components/SettingsPanel.js - 修正后
import React from 'react';
import { styles } from '../styles';

// *** 修改点：接收 translate prop ***
const SettingsPanel = ({ settings, onSettingsChange, translate }) => {
    return (
        <div style={styles.container}>
            {/* *** 修改点：使用 translate 函数 *** */}
            <h2 style={styles.title}>{translate('Plugin Settings')}</h2>
            <div style={styles.settingRow}>
                <label style={styles.label} htmlFor="enableInterceptor">
                    {translate('Enable System Note Interceptor')}
                </label>
                <input
                    type="checkbox"
                    id="enableInterceptor"
                    checked={settings.enableInterceptor}
                    onChange={(e) => onSettingsChange('enableInterceptor', e.target.checked)}
                />
            </div>
            <div style={styles.settingRow}>
                <label style={styles.label} htmlFor="systemNoteContent">
                    {translate('System Note Content')}
                </label>
                <input
                    type="text"
                    id="systemNoteContent"
                    style={styles.input}
                    value={settings.systemNoteContent}
                    onChange={(e) => onSettingsChange('systemNoteContent', e.target.value)}
                    disabled={!settings.enableInterceptor}
                />
            </div>
        </div>
    );
};

export default SettingsPanel;