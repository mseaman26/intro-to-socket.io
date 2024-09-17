import { createContext , useState, useEffect} from "react";
import Auth from "./auth";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);

    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = Auth.getToken();
        
        if(savedToken && !Auth.isTokenExpired(savedToken)){
            setUser(Auth.getProfile());
            setToken(savedToken);
        }
    }, [])

    useEffect(() => {
        if(token && !Auth.isTokenExpired(token)){
            
            setUser(Auth.getProfile());
            setLoggedIn(Auth.loggedIn());
            Auth.login(token);

            


            
        }
    }, [token])

    return (
        <AuthContext.Provider value={{ user, setUser, loggedIn, token, setToken, }}>
            {children}
        </AuthContext.Provider>
    );
}

