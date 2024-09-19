import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/authContext';


const Login = () => {
    const navigate = useNavigate();
    // Get user and setUser from AuthContext
    const { user, setToken } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if(data.message){
                    return setError(data.message);
                }
                const newToken = data.token;
                setToken(newToken);
            })
            .catch(err => {
                console.log(err);
                setError('Error signing up. Please try again.');
            });
    };

    // if user is logged in, redirect to home page
    useEffect(() => {
        if (user) {
            navigate('/');
        }else{
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        // Optionally show a spinner or placeholder while loading
        return <div>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
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
                    Login
                </button>
            </form>
            <div style={styles.linkContainer}>
                <p>Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link></p>
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

export default Login;
