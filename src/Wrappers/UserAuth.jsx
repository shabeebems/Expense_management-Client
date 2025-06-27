import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';

const UserAuth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if(!token) {
            navigate('/user/login');
        } else if(token.role === 'Admin') {
            navigate('/admin');
        }
    }, [location])

    return (
        <>{children}</>
    )
}

export default UserAuth