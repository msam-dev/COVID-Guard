import './App.less';
import { Router, Route, Switch } from 'react-router-dom';
import history from './_helpers/history';
import Path from './_constants/paths';
import Login from './Screens/Login/Login';



function App() {
  return (
    <div className="App">
        <Router history={history}>
            <Switch>
                <Route path={Path.login}> <Login/> </Route> 
            </Switch>
        </Router>         
    </div>
  );
}

export default App;
