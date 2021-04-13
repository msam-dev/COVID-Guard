import './App.less';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../_helpers/history';
import PATH from '../_constants/paths';
import AuthProvider from '../Components/AuthContext/AuthContext';
import Navbar from '../Components/Navbar/Navbar';
import Login from '../Screens/Login/Login';
import Footer from '../Components/Footer/Footer';


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
                        <Route path={PATH.login}> <Login/> </Route>
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
