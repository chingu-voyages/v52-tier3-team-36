import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuth, login, logout } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [curUser, setCurUser] = useState();
    const navigate = useNavigate();

    const getAuthenticated = async () =>{
        try{
            const response = await isAuth();
            if(response){
                setCurUser(response)
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
                setCurUser()
            }
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

    // If the URL chnages, check if user is authenticated
    useEffect(() => {
        getAuthenticated();   
    }, [window.location.pathname])
    return(
    <AuthContext.Provider value={{isAuthenticated, loading, loginUser, curUser}}>
        {children}
    </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)