import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';



const Signup = () => {
    const { setToken } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
            .then(res => res.json())
            .then(data => {
                const newToken = data.token;
                setToken(newToken);
                navigate('/');
            })
            .catch(err => {
                console.error(err);
                setError('Error signing up. Please try again.');
            });
    };

    return (
        <div style={styles.container}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Username (display name)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseLeave={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Sign Up
                </button>
            </form>
            <div style={styles.linkContainer}>
                <p>Already have an account? <Link to="/login" style={styles.link}>Log In</Link></p>
            </div>
            <h1>{error}</h1>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd'
    },
    button: {
        padding: '10px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    buttonHover: {
        backgroundColor: '#0056b3'
    },
    linkContainer: {
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '14px'
    },
    link: {
        color: '#007bff',
        textDecoration: 'none'
    }
};

export default Signup;
