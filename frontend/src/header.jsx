import { useNavigate } from "react-router-dom";
import { logout } from './utils/services';

const Header = () => {

    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        return navigate('/');

    }
    return (<div className="header">
        <div className="nav-conatiner">
            <nav>
                <div className="item"><a href="#" onClick={handleLogout} className="logout-link">התנתק</a>
                </div>
            </nav>
        </div>
    </div>)
}
export default Header;