import { Outlet, Link } from "react-router-dom";
import './header.css'


const Header = () => {
    return(
        <>
        <div className="header-container">
        <header>
            <div className="header-logo">
                Item Browser
            </div>
        <nav> 
            <ul className="header-ul">
                
                <li>
                    <Link to="/">Home</Link>
                </li>
                
                <li>
                    <Link to="/items">Items</Link>
                </li>
                
                <li>
                    <Link to="/c
                    heckout">Checkout</Link>
                </li>
            
            </ul>
        </nav>
        </header>
        </div>

        <Outlet />
        </>
    )
}
export default Header;