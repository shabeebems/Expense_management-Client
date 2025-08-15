import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const Auth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if(token) {
            navigate('/home');
        }
    }, [location])

    return (
        <>{children}</>
    )
}

export default Auth