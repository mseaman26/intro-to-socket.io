import React, { useContext } from 'react';
import { AuthContext } from '../utils/authContext.jsx';
import Auth from '../utils/auth'; // Make sure you have a logout method in Auth

const Home = () => {
    const { user, setUser } = useContext(AuthContext);

    const handleLogout = () => {
        Auth.logout(); // Ensure your Auth utility handles logout
        setUser(null); // Clear user state
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Home</h1>
            <p style={styles.welcomeMessage}>Welcome to the home page, {user ? user.username : 'Guest'}</p>
            <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

// Styles object
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
    heading: {
        fontSize: '2rem',
        marginBottom: '10px',
    },
    welcomeMessage: {
        fontSize: '1.25rem',
        marginBottom: '20px',
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
