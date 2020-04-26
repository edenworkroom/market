import React, {Component} from 'react';
import './App.css';
import {List, TabBar, WingBlank} from "antd-mobile";

import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import Market from "./component/market";
import Assets from "./component/assets";
import Trade from "./component/trade";
import OrderList from "./component/orders";
import BillList from "./component/bills";


class App extends Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Market}/>
                    <Route exact path="/market/" component={Market}/>
                    <Route exact path="/trade/" component={Trade}/>
                    <Route exact path="/asset/" component={Assets}/>
                    <Route exact path="/orders" component={OrderList}/>
                    <Route exact path="/bills/:token" component={BillList}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
