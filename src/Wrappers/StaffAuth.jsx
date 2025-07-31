import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';

const StaffAuth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        console.log(token)
        if(!token) {
            navigate('/staff/login');
        } else if(token.role === 'manager') {
            navigate('/manager');
        }
    }, [location])

    return (
        <>{children}</>
    )
}

export default StaffAuth