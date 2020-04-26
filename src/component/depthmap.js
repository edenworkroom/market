import React, {Component} from 'react';
import {Flex, List, TabBar, WingBlank} from "antd-mobile";

import language from './language'
import {showPK, showPrice, showValue, showValueP} from "./common";

export class Depthmap extends Component {

    constructor(props) {
        super(props);
    }

    renderMap(list, type) {
        let items = list.map((each, index) => {
            if (type == 0) {
                return (<div className="item">
                    <Flex>
                        <Flex.Item style={{flex: 10, textAlign: 'left'}}>{index}</Flex.Item>
                        <Flex.Item style={{flex: 45, textAlign: 'left'}}>{showValueP(each.value, 18, 2)}</Flex.Item>
                        <Flex.Item style={{flex: 45, textAlign: 'right'}}>{showPrice(each.price)}</Flex.Item>
                    </Flex>
                </div>)
            } else {
                return (<div className="item">
                    <Flex>
                        <Flex.Item style={{flex: 45, textAlign: 'left'}}>{showPrice(each.price)}</Flex.Item>
                        <Flex.Item style={{flex: 45, textAlign: 'right'}}>{showValueP(each.value, 18, 2)}</Flex.Item>
                        <Flex.Item style={{flex: 10, textAlign: 'right'}}>{index}</Flex.Item>
                    </Flex>
                </div>)
            }
        });
        return (
            <div className="ui list">
                {items}
            </div>
        )
    }


    render() {
        console.log("depthmap", this.props.sellList, this.props.buyList);
        return (
            <WingBlank>
                <Flex>
                    <Flex.Item style={{flex: 49, height: '300px'}}>{this.renderMap(this.props.buyList, 0)}</Flex.Item>
                    <Flex.Item style={{flex: 2, height: '300px'}}></Flex.Item>
                    <Flex.Item style={{flex: 49, height: '300px'}}>{this.renderMap(this.props.sellList, 1)}</Flex.Item>
                </Flex>
            </WingBlank>
        )
    }
}

export default Depthmap