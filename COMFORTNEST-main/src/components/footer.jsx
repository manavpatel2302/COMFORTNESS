const Footer = () => {

    return(

        <div className="data">

             <div className="support">

                <div className="contactus">

                    <div className="question">

                        <h1>Do You Have Any Question?</h1>
                        <p>We're here to help you anytime! </p> <br/>

                        <h6>We are just one click away..</h6>

                    </div>

                    <div className="ask">

                        <button id="ask_btn">Contact Us</button>

                    </div>

                    

                </div>

            </div>
    
             <div className="footer_container">

                 <div className="footer">

                    <div className="section1">

                        <div className="footer_logo">
                            <img id="logo1" src="./images/logonew.png" alt="logo"></img>
                            <h3> COMFORTNEST </h3>
                        </div>

                        
                        <h2>Do You Need Help With Anything?</h2>
                        <p>Receive updates, hot deals, tutorials, discounts sent straignt in your inbox every month</p>

                    <div className="email">

                        <input type="email" id="email" placeholder=" Enter Your Email Address"></input>
                        <button id="submit">Subscribe</button>
                
                    </div>

                </div>

                <div className="section2">

                    <div className="list">

                        <h3>LAYOUTS</h3>

                        <ul>
                            <li>Home Page</li>
                            <li>About Page</li>
                            <li>Awward Page</li>
                            <li>Property Page</li>
                            <li>Contactus Page</li>
                            <li>Footer Page</li>
                        </ul>

                    </div>

                    <div className="list">

                        <h3>SECTIONS</h3>

                        <ul>
                            <li>Header</li>
                            <li>Feature</li>
                            <li>Attractive</li>
                            <li>Testimonials</li>
                            <li>Videos</li>
                            <li>Footers</li>
                        </ul>

                    </div>

                    <div className="list">

                        <h3>COMPONY</h3>

                        <ul>
                            <li>About</li>
                            <li>Blog</li>
                            <li>Pricing</li>
                            <li>Affiliate</li>
                            <li>Login</li>
                            <li>Changelog</li>
                        </ul>

                    </div>

                </div>


            </div>

            <div className="copyright">

                <img id="copyright_icon" src="./images/copyright.png"></img>
                <p>2024 COMFORTNEST, Developed by Jeet Vyas</p>

            </div>
    
         </div>

         </div>

    );
};

export default Footer;

