import './App.less';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../_helpers/history';
import PATH from '../_constants/paths';
import AuthProvider from '../Components/AuthContext/AuthContext';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import Register from '../Screens/Register/Register';
import Login from '../Screens/Login/Login';
import CurrentHotspots from '../Screens/CurrentHotspots/CurrentHotspots';
import VaccineCenters from '../Screens/VaccineCenters/VaccineCenters';
import Support from '../Screens/Support/Support';
import CheckVaccStatus from '../Screens/CheckVaccStatus/CheckVaccStatus';
import MoreInfo from '../Screens/MoreInfo/MoreInfo';
import Homepage from '../Screens/Homepage/Homepage';
import TermsAndConditions from '../Screens/TermsAndConditions/TermsAndConditions';
import MarkCovidCase from '../Screens/MarkCovidCase/MarkCovidCase';
import ChangePassword from '../Screens/ChangePassword/ChangePassword';

function App() {
  return (
    <div className="App">
        <AuthProvider>
            <div id="navbar-wrapper">
                <Navbar />
            </div>
            
            <div id="body-wrapper">
                <Router history={history}>
                    <Switch>
                        <Route path={PATH.login}><Login /></Route>
                        <Route path={PATH.register}><Register /></Route>
                        <Route path={PATH.currentHotspots}><CurrentHotspots /></Route>
                        <Route path={PATH.vaccineCenters}><VaccineCenters /></Route>
                        <Route path={PATH.support}><Support /></Route> 
                        <Route path={PATH.checkvaccstatus}><CheckVaccStatus /></Route>
                        <Route path={PATH.moreinfo}> <MoreInfo/> </Route> 
                        <Route exact path={PATH.home}> <Homepage/> </Route>
                        <Route path={PATH.termsAndConditions}> <TermsAndConditions/> </Route>
                        <Route path={PATH.markCovidCase}> <MarkCovidCase/> </Route> 
                        <Route path={PATH.changePassword}> <ChangePassword/> </Route> 
                    </Switch>
                </Router> 
            </div>
        </AuthProvider>

        <div id="footer-wrapper">
            <Footer />
        </div>
    </div>
  );
}

export default App;
