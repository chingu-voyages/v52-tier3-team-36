import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth, login, logout, register } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [curUser, setCurUser] = useState();
    const navigate = useNavigate();

    const getAuthenticated = async () =>{
        try{
            const success = await isAuth();
            setCurUser(success)
            setIsAuthenticated(true)
        } catch(error){
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const loginUser = async (formData) => {
        const success = await login(formData);
        if(success) {
            setIsAuthenticated(true);
            navigate('/');
        } 
    }

    const logoutUser = async () => {
        const success = await logout();
        if(success) {
            setIsAuthenticated(false)
            navigate('/')
        }
    }
    // If the URL chnages, check if user is authenticated
    useEffect(() => {
        getAuthenticated();   
    }, [window.location.pathname])
    return(
    <AuthContext.Provider value={{isAuthenticated, loading, loginUser, logoutUser, curUser}}>
        {children}
    </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)