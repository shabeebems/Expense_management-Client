import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';

const Protected = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if(!token) {
            navigate('/login');
        }
    }, [location])

    return (
        <>{children}</>
    )
}

export default Protected