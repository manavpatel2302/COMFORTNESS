import {Link} from "react-router-dom";

const Award = () => {

    return(
        <div className="hero">

            <div className="award">
                
                <div className="award_heading">
                    <p id="label">Our Award</p>
                    <h1>Over 1,24,000+ Happy User Bieng With Us Still They Love Our Services</h1> <br/>
                    <hr />

                    <div className="award_icon">
                        <img id="award_img" src="./images/award.jpeg" />
                        <p>Global winner 2023 for best service provider</p>
                    </div>

                    <div className="rating">
                        <img src="./images/star.png" className="star"></img>
                        <img src="./images/star.png" className="star"></img>
                        <img src="./images/star.png" className="star"></img>
                        <img src="./images/star.png" className="star"></img>
                        <img src="./images/star.png" className="star"></img>
                        
                    </div>
                    
                </div>

            </div>

        </div>
    );
};

export default Award;