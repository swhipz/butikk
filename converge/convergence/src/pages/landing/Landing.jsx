import "./landing.css";

const Landing = () => {
return (
<>
<div className="landing-wrapper">
    <div className="hero">
        <div className="hero-left">
            <h1>
                Converge
            </h1>
            <h2>plain information</h2>
        </div>
        <div className="hero-right">
            <div className="hero-copy-text">UX Newsletter</div>
            <div className="button-cta">Subscribe</div>
        </div>
    </div>
    <div className="cards-wrapper">
        <div className="cards-outline">
            <div className="card-element">
                <div className="card-top">
                    <img src="." alt="card-image-1" />
                </div>
                <div className="card-bottom">
                    <h4>Industry Insights</h4>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat laborum omnis suscipit! Minima, debitis quis!</p>
                </div>
            </div>
        </div>
    </div>
    <div className="parallax-start">
        <div className="parallax-front-1"></div>
        <div className="parallax-front-2"></div>
    </div>
    <div className="return-to-to"></div>
</div>
</>

)
}
export default Landing;

