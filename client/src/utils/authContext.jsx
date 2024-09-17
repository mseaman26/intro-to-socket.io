import { createContext , useState, useEffect} from "react";
import Auth from "./auth";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);

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
            console.log('context token useeffect');
            //using the function form of setUser to avoid stale closure
            setUser(() => Auth.getProfile());
            Auth.login(token);

            


            
        }
    }, [token])

    //TODO: delete this useeffect
    useEffect(() => {
        console.log('user useeffect: ', user?.data?.username);
        
    }, [user])
    //TODO: and this one
    useEffect(() => {
        console.log('token useeffect: ', token);
    }, [token])

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, }}>
            {children}
        </AuthContext.Provider>
    );
}

