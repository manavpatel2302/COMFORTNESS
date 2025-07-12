import React, {useEffect} from 'react';
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import Award from './award';
import Home from './home';
import Property from './property';
import Explore from './explore';
import Package from './package';
import Footer from './footer';

const Homepage = () => {
  const location = useLocation();

  useEffect(() => {
    // Get the section from the query parameter
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get("section");

    if (section) {
          // Scroll to the section after the component mounts
          scroller.scrollTo(section, {
              smooth: true,
              offset: -70, 
              duration: 500,
          });
      }
    }, [location]); // Re-run when the location changes

  return (
    <div>
      <section id="home">
        <Home />
      </section>

      <section id="property">
        <Property />
      </section>

      <section id="award">
        <Award />
      </section>

      {/* <section id="explore">
        <Explore />
      </section> */}

      <section id="package">
        <Package />
      </section>

      <section id="footer">
        <Footer />
      </section>

    </div>
  )
}

export default Homepage;
