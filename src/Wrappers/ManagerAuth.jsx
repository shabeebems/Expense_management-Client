import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';

const ManagerAuth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        
        if(!token) {
            navigate('/manager/login');
        } else if(token.role === 'staff') {
            navigate('/staff');
        }
    }, [location])

    return (
        <>{children}</>
    )
}

export default ManagerAuth