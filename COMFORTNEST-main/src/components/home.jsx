
const Home = () => {

    return(
        <div className="main">

             <div className="back">

                <div className="heading">
                    <h1> SEARCH YOUR <br/> NEXT HOME</h1> 
                    <p>Find new & featured property located in your local city</p>

                    <div className="search_box">

                        <div className="discription">

                            <div className="box"> 
                                <label htmlFor="city">Location</label> 
                                <select id="city" name="city">
                                    <option value="Ahmedabad">Ahmedabad</option>
                                    <option value="Ahmedabad">Surat</option>
                                    <option value="Ahmedabad">Mumbai</option>
                                    <option value="Ahmedabad">Dehli</option>
                                    <option value="Ahmedabad">Banglore</option>
                                </select>
                            </div>
                            <div className="box">
                                <label htmlFor="property">Property Type</label> 
                                <select id="property_type" name="property">
                                    <option value="Villa">Villa</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Family House">Family House</option>
                                    <option value="Office/Studio">Office/Studio</option>
                                    <option value="All">Show All</option>
                                </select>
                            </div>
                            <div className="box">
                                <label htmlFor="price">Price Range</label> 
                                <select id="price" name="price">
                                    <option value="under 25 Lakh">Under 25 lakh</option>
                                    <option value="25 to 50 Lakh">25 to 50 lakh</option>
                                    <option value="50 to 75 Lakh">50 to 75 lakh</option>
                                    <option value="75 to 99 Lakh">75 to 99 lakh</option>
                                    <option value="Above 1 crorr">Above 1 crore</option>
                                </select>
                            </div>
                            <div className="box">
                            <label htmlFor="condition">Property Condition:</label>
                            <select id="condition" name="condition">
                                <option value="new">New</option>
                                <option value="renovated">Renovated</option>
                                <option value="old">Old</option>
                            </select>
                            </div>
                            <div className="box">
                                <button id="search_btn">Search</button>
                            </div>

                        </div>
                    
                    </div>

                </div>


             </div>



        </div>
    );
};


export default Home;