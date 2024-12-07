import { useAuth } from "../contexts/useAuth"
import { useNavigate } from "react-router-dom";
// Wrapper component to make sure there is a user logged in, otherwise return to homepage
export const PrivateRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    if(loading) {
        return (<h1>Loading...</h1>)
    }
    if (isAuthenticated){
        return children
    } else {
        navigate('/')
    }
}