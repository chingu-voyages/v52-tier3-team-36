import { createContext, useContext, useEffect, useState } from "react";
import { isAuth, login } from "../services/authService";

const AuthContext = createContext();
// Create authentication context
export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [curUser, setCurUser] = useState();
    // Send request to backend to verify user and set the curUser state to the returned user
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
    // Send request to backend API for user login
    const loginUser = async (formData) => {
        const success = await login(formData);
        if(success) {
            setIsAuthenticated(true);
            return true
        } else {
            return false
        }
    }

    // If the URL changes, check if user is authenticated
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