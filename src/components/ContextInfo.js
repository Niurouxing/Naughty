// src/components/ContextInfo.js - 修正后
/* global SillyTavern */
import React from 'react';
import { styles } from '../styles';

// *** 修改点：接收 translate prop ***
const ContextInfo = ({ translate }) => {
    const context = SillyTavern.getContext();
    const characterName = context.characters[context.characterId]?.name ?? 'N/A';

    return (
        <div style={styles.container}>
            {/* *** 修改点：使用 translate 函数 *** */}
            <h2 style={styles.title}>{translate('SillyTavern Context')}</h2>
            <ul style={styles.infoList}>
                <li style={styles.infoItem}><strong>{translate('Current Character')}:</strong> {characterName}</li>
                <li style={styles.infoItem}><strong>Username:</strong> {context.name1}</li>
                <li style={styles.infoItem}><strong>Total Characters:</strong> {context.characters.length}</li>
                <li style={styles.infoItem}><strong>Total Chats:</strong> {context.chat.length}</li>
            </ul>
        </div>
    );
};

export default ContextInfo;