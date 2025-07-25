// src/components/EventMonitor.js 
/* global SillyTavern */
import React, { useState, useEffect } from 'react';
import { styles } from '../styles';

const EventMonitor = ({ translate }) => {
    const [lastEvent, setLastEvent] = useState(null);

    useEffect(() => {
        const { eventSource, event_types } = SillyTavern.getContext();

        const handleChatChange = () => {
            console.log('Event received: CHAT_CHANGED');
            setLastEvent(`${translate('Chat has changed!')} (${new Date().toLocaleTimeString()})`);
        };

        eventSource.on(event_types.CHAT_CHANGED, handleChatChange);

        return () => {
            eventSource.off(event_types.CHAT_CHANGED, handleChatChange);
        };
    }, [translate]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{translate('Event Monitor')}</h2>
            {lastEvent ? (
                <p style={styles.eventNotice}>{lastEvent}</p>
            ) : (
                <p>Waiting for chat events...</p>
            )}
        </div>
    );
};

export default EventMonitor;