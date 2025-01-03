import CTAMEN from '../CTA/CTAMEN';
import CTAWOMEN from '../CTA/CTAWOMEN';
import './mainhero.css';
import bg from "./Screenshot 2025-01-03 004657.png";
const Mainhero = () => {
    return(
        <>
        <div className="heroWrapper">
            <div className="background-gradient">
                <div className="bg-overlay">
                <div className="text">
                    <h1 className="title">NEW YEAR. <br /> WHICH YOU?</h1>
                    <p>For lifting, running and just-about-everything, the starter packs <br /> to make 2025 the year of the gym.</p>
                   <div className="ctas"> <CTAMEN/>
                    <CTAWOMEN/>
                    </div>
                </div>
                <div className="people"></div>
                </div>


            </div>
        </div>
        </>
    )
}
export default Mainhero;