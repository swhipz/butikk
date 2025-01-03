import './packs.css';
import rightArrow from "./right-arrow-svgrepo-com.svg"
const Packs = () => {

    return(
        <>
        <div className="packWrapper">
            <div className="carousel">
                    <div className="packTitle">NEW YEAR. WHICH YOU?</div>
                <div className="arwsWrap">
                    <div className="arrows"><img src={rightArrow} alt="" style={{transform:"rotate(180deg)"}} /></div>
                    <div className="arrows"><img src={rightArrow} alt="" /></div>
                </div>
            <div className="cardCont">
                <div className="card">
                    
                </div>
            </div>
            </div>
        </div>
        </>
    )

}
export default Packs;