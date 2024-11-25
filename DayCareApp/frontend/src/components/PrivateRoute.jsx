import { useAuth } from "../contexts/useAuth"
import { useNavigate } from "react-router-dom";

export const PrivateRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    if(loading) {
        return (<h1>Loading...</h1>)
    }
    if (isAuthenticated){
        return children
    } else {
        navigate('/auth/login')
    }
}