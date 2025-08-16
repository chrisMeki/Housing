import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PropertyMapping from "./pages/PropertyMapping"
import HousingRegistration from  "./pages/HousingRegistration"
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import PropertySearch from "./pages/SearchProperties";
import PropertyListings from "./pages/PropertyListings";
import Profile from "./pages/UserProfile";
import HousingLandingPage from "./pages/Landingpage";
import LoginPage from "./pages/signup";
import CreateAccountPage from "./pages/createaccount";
import LogoutPage from "./pages/logoutpage";


function App() {
  return (
    <Router>
      <Routes>
         
         <Route path='/login' element={<LoginPage/>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/signup' element={<CreateAccountPage/>} />
         <Route path='/' element={<HousingLandingPage/>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/mapping' element={<PropertyMapping/>}/>
        <Route path='/registrations' element={<HousingRegistration/>}/>
        <Route path='/reports' element={<Reports/>}/>
        <Route path='/analytics' element={<Analytics/>}/>
        <Route path='/search' element={<PropertySearch/>}/>
        <Route path='/listings' element={<PropertyListings/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/logout' element={<LogoutPage/>}/>

       
        {/* Add a default redirect to dashboard */}
        <Route path='/' element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;