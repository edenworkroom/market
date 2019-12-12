import React, {Component} from 'react';
import './App.css';
import {List, TabBar, WingBlank} from "antd-mobile";

import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Market from "./component/market";
import Asset from "./component/asset";
import Trade from "./component/trade";


class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Market}/>
                    <Route exact path="/market" component={Market}/>
                    {/*<Route exact path="/market/:standard" component={Market}/>*/}
                    <Route exact path="/trade" component={Trade}/>
                    <Route exact path="/trade/:standard/:token" component={Trade}/>
                    <Route exact path="/asset" component={Asset}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
