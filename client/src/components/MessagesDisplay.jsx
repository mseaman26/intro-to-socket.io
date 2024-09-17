import React, { useEffect, useRef } from 'react';

const MessagesDisplay = ({ messages }) => {
    const messageContainerRef = useRef(null);

    // Scroll to the bottom when new messages are added
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]); // Runs whenever messages array changes

    return (
        <div style={styles.messageDisplayContainer} ref={messageContainerRef}>
            {messages.length === 0 ? (
                <p style={styles.noMessages}>No messages yet</p>
            ) : (
                messages.map((msg, index) => (
                    <p key={index} style={styles.message}>{msg}</p>
                ))
            )}
        </div>
    );
}

export default MessagesDisplay;

const styles = {
    messageDisplayContainer: {
        width: '80%',
        height: '40vh',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        overflowY: 'auto',
        marginBottom: '20px',
        textAlign: 'left',
    },
    noMessages: {
        color: '#888',
        fontSize: '1rem',
    },
    message: {
        fontSize: '1rem',
        padding: '5px 0',
        borderBottom: '1px solid #ddd',
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '10px',
    },
};
