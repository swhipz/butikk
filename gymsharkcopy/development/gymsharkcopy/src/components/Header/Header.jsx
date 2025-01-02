import './header.css';

const Header = () => {
    return(
        <>
        <div className="greybar"></div>
        <header>
        <div className="logo"><img id="logo" src="https://i.pinimg.com/originals/45/4f/47/454f470e67f2f7f59cc3b0dd37818ca8.png" alt="" /></div>
        <div className="wrap"><span className="nav">WOMEN</span><span className="nav">MEN</span><span className="nav">ACCESSORIES</span></div>
        <ul>
            <li><img src="https://www.svgrepo.com/show/522443/search.svg" alt="" /></li>
            <li><img src="https://www.svgrepo.com/show/348144/favourite.svg" alt="" /></li>
            <li><img src="https://www.svgrepo.com/show/521024/user-5.svg" alt="" /></li>
            <li><img src="https://www.svgrepo.com/show/506559/shopping-bag.svg" alt="" /></li>
        </ul>
        </header>
        <div className="greybar" style={{height: "60px"}}></div>
        </>
    );
}
export default Header;