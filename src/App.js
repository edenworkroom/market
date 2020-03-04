import React, {Component} from 'react';
import './App.css';
import {List, TabBar, WingBlank} from "antd-mobile";

import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Market from "./component/market";
import Assets from "./component/assets";
import Trade from "./component/trade";
import OrderList from "./component/orders";


class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Market}/>
                    <Route exact path="/market/:pk" component={Market}/>
                    <Route exact path="/trade/:pk/:standard/:token" component={Trade}/>
                    <Route exact path="/trade/:pk" component={Trade}/>
                    <Route exact path="/asset/:pk" component={Assets}/>
                    <Route exact path="/orders/:standard/:token/:pk/:mainPKr" component={OrderList}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
