// src/App.js - 修正后
/* global SillyTavern */
import React, { useState } from 'react';
import { getSettings, MODULE_NAME } from './settings';
import ContextInfo from './components/ContextInfo';
import SettingsPanel from './components/SettingsPanel';
import EventMonitor from './components/EventMonitor';

function App() {
    const [settings, setSettings] = useState(getSettings());
    // *** 修改点：获取 translate 而不是 t ***
    const { extensionSettings, saveSettingsDebounced, translate } = SillyTavern.getContext();

    const handleSettingsChange = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        extensionSettings[MODULE_NAME] = newSettings;
        saveSettingsDebounced();
    };

    return (
        <div>
            {/* *** 修改点：使用 translate 函数 *** */}
            <h1>{translate('Enhanced Demo Extension')}</h1>
            <SettingsPanel
                settings={settings}
                onSettingsChange={handleSettingsChange}
                // *** 修改点：传递 translate prop ***
                translate={translate}
            />
            <ContextInfo translate={translate} />
            <EventMonitor translate={translate} />
        </div>
    );
}

export default App;