import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';

const AdminAuth = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('token'));
        if(!token) {
            navigate('/admin/login');
        } else if(token.role === 'User') {
            navigate('/user');
        }
    }, [location])

    return (
        <>{children}</>
    )
}

export default AdminAuth