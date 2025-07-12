import './index.css'
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/nav.jsx";
import Homepage from "./components/Homepage.jsx";
import AddProperty from './components/AddProperty.jsx';
import PropertyPage from './components/PropertyPage.jsx';
import PropertyDetails from './components/PropertyDetails.jsx';
import EditProperty from './components/EditProperty.jsx';
import UserProfilePage from './components/UserProfilePage.jsx';
import MyPropertiesPage from './components/MyPropertiesPage.jsx';
import ShortlistedPropertiesPage from './components/ShortlistedPropertiesPage.jsx';
import OwnerDetail from './components/OwnerDetail.jsx';
import Properties from './components/Properties.jsx';

const App = () => {
  return (
      <Router>
          <div className="website">
              <Nav />
              <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/add-property" element={<AddProperty />} />
                  <Route path="/properties" element={<PropertyPage />} />
                  <Route path='/property/:id' element={<PropertyDetails />} />
                  <Route path="/edit-property/:id" element={<EditProperty />} />
                  <Route path="/user/profile" element={<UserProfilePage />} />
                  <Route path="/user/my-properties" element={<MyPropertiesPage />} />
                  <Route path="/user/shortlisted-properties" element={<ShortlistedPropertiesPage />} />
                  <Route path="/property/:id/ownerdetails" element={<OwnerDetail />} />
                  <Route path="/properties/category" element={<Properties />} />
              </Routes>
          </div>
      </Router>
  );
};

export default App;