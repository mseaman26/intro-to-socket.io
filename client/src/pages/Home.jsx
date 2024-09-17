import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../utils/authContext.jsx';
import Auth from '../utils/auth'; 
import MessagesDisplay from '../components/MessagesDisplay.jsx';

const Home = () => {
    const { user, setUser, socket } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const handleLogout = () => {
        Auth.logout(); 
        setUser(null); 
    };

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() !== '') {
            setMessage(''); 
            socket.emit('message', message);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on('message', (data) => {
                setMessages((prior) => [...prior, `${data.from}: ${data.message}`]);
            });
        }
        return () => {
            if (socket) {
                socket.off('message');
            }
        };
    }, [socket])

    return (
        <div style={styles.container}>
            

            <h1 style={styles.heading}>Home</h1>
            <p style={styles.welcomeMessage}>
                Welcome to the home page, {user ? user.data.username : ''}
            </p>
           <MessagesDisplay messages={messages} />

            <form style={styles.messageContainer} onSubmit={handleSendMessage} >
                <input 
                    type="text" 
                    value={message} 
                    onChange={handleMessageChange} 
                    placeholder="Type your message" 
                    style={styles.messageInput} 
                />
                <button 
                    style={styles.sendButton}
                    type='submit'
                >
                    Send
                </button>
            </form>

            <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    messageDisplayContainer: {
        width: '80%',
        height: '30vh',
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
    welcomeMessage: {
        fontSize: '1.25rem',
        marginBottom: '20px',
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '20px',
    },
    messageInput: {
        padding: '10px',
        fontSize: '16px',
        width: '250px',
        marginRight: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    sendButton: {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    logoutButton: {
        padding: '10px 20px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Home;
