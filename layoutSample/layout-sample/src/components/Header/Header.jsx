import './header.css'

const Header = () => {
    return(
        <>
        <div className="header-container">
        <header>
            <div className="header-logo">
                Item Browser
            </div>
            <ul className="header-ul">
                <li>
                    Home
                </li>
                <li>
                   Items
                </li>
                <li>
                    Checkout
                </li>
            </ul>
        </header>
        </div>
        </>
    )
}
export default Header;