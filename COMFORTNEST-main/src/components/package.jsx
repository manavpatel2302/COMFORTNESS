import {Link} from "react-router-dom";

const Package = () => {

    return(
        <div className="explore package">

            <div className="quote">
                <h1>Select Your Package</h1>
                <p>Enhance Your EXperience with the New Features!</p>
            </div>

            <div className="cities">

                <div className="city package_box">

                    <h2 id="subs">Basic</h2>
                    <h1>$29</h1>
                    <p>User/Month</p>

                    <ul>
                        <li>99.5% Uptime Guarantee</li>
                        <li>120GB CDN Bandwidth</li>
                        <li>5GB Cloud Storage</li>
                        <li id="cancel">Personal Help Support</li>
                        <li id="cancel">Enterprise SLA</li>
                    </ul>

                    <div className="subscribe_btn">

                        <button id="subs_btn">Subscribe</button>

                    </div>         

                </div>

                <div className="city package_box">
                    
                    <h2 id="subs">Standard</h2>
                    <h1>$49</h1>
                    <p>User/Month</p>

                    <ul>
                        <li>99.5% Uptime Guarantee</li>
                        <li>120GB CDN Bandwidth</li>
                        <li>5GB Cloud Storage</li>
                        <li>Personal Help Support</li>
                        <li id="cancel">Enterprise SLA</li>
                    </ul>

                    <div className="subscribe_btn">

                        <button id="subs_btn">Subscribe</button>

                    </div>

                </div>

                <div className="city package_box">  

                    <h2 id="subs">Premium</h2>
                    <h1>$79</h1>
                    <p>2 User/Month</p>

                    <ul>
                        <li>99.5% Uptime Guarantee</li>
                        <li>120GB CDN Bandwidth</li>
                        <li>5GB Cloud Storage</li>
                        <li>Personal Help Support</li>
                        <li>Enterprise SLA</li>
                    </ul>

                    <div className="subscribe_btn">

                        <button id="subs_btn">Subscribe</button>

                    </div>

                </div>
                
                
            </div>
        </div>
    );
};

export default Package;