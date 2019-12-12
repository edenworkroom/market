import React, {Component} from 'react';
import {TabBar} from "antd-mobile";
import {createHashHistory} from 'history'

import tabbar_banlance from '../icon/tabbar_banlance.png'
import tabbar_banlance_light from '../icon/tabbar_banlance_light.png'
import tabbar_markets from '../icon/tabbar_markets.png'
import tabbar_markets_light from '../icon/tabbar_markets_light.png'
import tabbar_trade from '../icon/tabbar_trade.png'
import tabbar_trade_light from '../icon/tabbar_trade_light.png'

class MTabbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: props.selectedTab
        }
    }

    render() {
        return (
            <div style={{
                position: 'fixed',
                width: '100%',
                bottom: '0',
                zIndex: '999',
            }}>
                <TabBar unselectedTintColor="#949494" tintColor="#33A3F4" barTintColor="white">
                    <TabBar.Item title="行情" key="market"
                                 selected={this.state.selectedTab === 'market'}
                                 icon={<img src={tabbar_markets} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={tabbar_markets_light}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     createHashHistory().push("/market")
                                 }}
                    >

                    </TabBar.Item>
                    <TabBar.Item title="交易"
                                 key="trade"
                                 selected={this.state.selectedTab === 'trade'}
                                 icon={<img src={tabbar_trade} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={tabbar_trade_light} style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     createHashHistory().push("/trade")
                                 }}
                    >

                    </TabBar.Item>
                    <TabBar.Item title="资产"
                                 key="asset"
                                 selected={this.state.selectedTab === 'asset'}
                                 icon={<img src={tabbar_banlance} style={{width: '22px', height: '22px'}}/>}
                                 selectedIcon={<img src={tabbar_banlance_light}
                                                    style={{width: '22px', height: '22px'}}/>}
                                 onPress={() => {
                                     createHashHistory().push("/asset")
                                 }}
                    >

                    </TabBar.Item>
                </TabBar>

            </div>)
    }

}

export default MTabbar