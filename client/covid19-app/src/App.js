import './App.less';
import { Router, Route, Switch } from 'react-router-dom';
import history from './_helpers/history';
import PATH from './_constants/paths';
import AuthProvider from './Components/AuthContext/AuthContext';

import Login from './Screens/Login/Login';




function App() {
  return (
    <div className="App">
        <Router history={history}>
            <AuthProvider>
                <Switch>
                    <Route path={PATH.login}> <Login/> </Route>
                </Switch>
            </AuthProvider>
        </Router>   
    </div>
  );
}

export default App;
