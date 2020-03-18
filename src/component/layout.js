import React, {Component} from 'react';
import {TabBar} from "antd-mobile";
import {createHashHistory} from 'history'

import tabbar_banlance from '../icon/tabbar_banlance.png'
import tabbar_banlance_light from '../icon/tabbar_banlance_light.png'
import tabbar_markets from '../icon/tabbar_markets.png'
import tabbar_markets_light from '../icon/tabbar_markets_light.png'
import tabbar_trade from '../icon/tabbar_trade.png'
import tabbar_trade_light from '../icon/tabbar_trade_light.png'
import language from './language'
import mAbi from "./abi";
import {showPK} from "./common";
import Market from "./market";
import Trade from "./trade";
import Assets from "./assets";
import OrderList from "./orders";

export class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'market',
        };
    }

    componentDidMount() {
        let self = this;
        let pk = localStorage.getItem("PK");
        if (!pk) {
            mAbi.init
                .then(() => {
                    mAbi.accountList(function (accounts) {
                        self.setState({pk: accounts[0].pk});
                        localStorage.setItem("PK", accounts[0].pk);
                    });

                })
        }
    }

    renderContent(pageText) {
        console.log("renderContent: ", pageText);
        if (pageText === "market") {
            return (<Market layout={this.setLayout.bind(this)}/>)
        } else if (pageText === "trade") {
            let token = localStorage.getItem("TOKEN");
            let standard = localStorage.getItem("STANDARD");
            return (<Trade layout={this.setLayout} token={token}/>);
        } else if (pageText === "assets") {
            return (<Assets layout={this.setLayout}/>)
        } else {
            return (<OrderList/>)
        }
    }

    setLayout(pageText) {
        if (pageText === "market") {
            this.setState({selectedTab: 'market'})
        } else if (pageText === "trade") {
            this.setState({selectedTab: 'trade'})
        } else if (pageText === "assets") {
            this.setState({selectedTab: 'assets'})
        } else {

        }
    }

    render() {
        console.log("render layout")
        return (
            <div style={{position: 'fixed', width: '100%', height: '100%', bottom: '0'}}>
                <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white">
                    <TabBar.Item title={language.e().tabBar.price} key="market"
                                 selected={this.state.selectedTab === 'market'}
                                 icon={<img src={tabbar_markets} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={tabbar_markets_light}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     this.setState({selectedTab: 'market'})
                                 }}
                    >
                        {this.renderContent('market')}
                    </TabBar.Item>
                    <TabBar.Item title={language.e().tabBar.trade}
                                 key="trade"
                                 selected={this.state.selectedTab === 'trade'}
                                 icon={<img src={tabbar_trade} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={tabbar_trade_light} style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     this.setState({selectedTab: 'trade'})
                                 }}
                    >
                        {this.renderContent('trade')}
                    </TabBar.Item>
                    <TabBar.Item title={language.e().tabBar.assets}
                                 key="asset"
                                 selected={this.state.selectedTab === 'assets'}
                                 icon={<img src={tabbar_banlance} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={tabbar_banlance_light}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     this.setState({selectedTab: 'assets'})
                                 }}
                    >
                        {this.renderContent('assets')}
                    </TabBar.Item>
                </TabBar>
            </div>)
    }
}