import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import {logout} from './utils/services';
const Header = ()=>{

    const navigate= useNavigate();

    const handleLogout = (e)=>{
        e.preventDefault();
        logout();
        return navigate('/');
        
    }
    return(<div className="header">
        <div className="nav-conatiner">
        <nav>
            <div className="item"><a href="#" onClick={handleLogout} className="logout-link">התנתק</a>
            </div>
        </nav>
=======
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
>>>>>>> main
        </div>
    </div>)
}
export default Header;