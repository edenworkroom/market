import React, {Component} from 'react';
import {Flex, List, TabBar, WingBlank} from "antd-mobile";
import ReactEcharts from 'echarts-for-react';
import BigNumber from "bignumber.js";
import language from './language'
import {showPK, showPrice, showValue, showValueP} from "./common";
import Highcharts from 'highcharts';


export class Depthmap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataX: [],
            dataY: []
        }
    }

    //
    // renderMap(list, type) {
    //     let items = list.map((each, index) => {
    //         if (type == 0) {
    //             return (<div className="item">
    //                 <Flex>
    //                     <Flex.Item style={{flex: 10, textAlign: 'left'}}>{index}</Flex.Item>
    //                     <Flex.Item style={{flex: 45, textAlign: 'left'}}>{showValueP(each.value, 18, 2)}</Flex.Item>
    //                     <Flex.Item style={{flex: 45, textAlign: 'right'}}>{showPrice(each.price)}</Flex.Item>
    //                 </Flex>
    //             </div>)
    //         } else {
    //             return (<div className="item">
    //                 <Flex>
    //                     <Flex.Item style={{flex: 45, textAlign: 'left'}}>{showPrice(each.price)}</Flex.Item>
    //                     <Flex.Item style={{flex: 45, textAlign: 'right'}}>{showValueP(each.value, 18, 2)}</Flex.Item>
    //                     <Flex.Item style={{flex: 10, textAlign: 'right'}}>{index}</Flex.Item>
    //                 </Flex>
    //             </div>)
    //         }
    //     });
    //     return (
    //         <div className="ui list">
    //             {items}
    //         </div>
    //     )
    // }

    componentDidMount() {

    }

    getOption() {
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: this.state.dataX
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: this.state.dataY,
                type: 'line',
                areaStyle: {}
            }]
        }
        return option;

    }

    render() {
        const {buyList, sellList} = this.props;
        let dataX = [];
        let dataY = [];

        // console.log("componentDidMount", this.state.buyList, this.state.sellList);
        this.props.buyList.forEach(each => {
            dataX.push(new BigNumber(each.price).dividedBy(1e18).toNumber())
            dataY.push(new BigNumber(each.value).dividedBy(1e18).toNumber())
        });
        this.props.sellList.forEach(each => {
            dataX.push(new BigNumber(each.price).dividedBy(1e18).toNumber())
            dataY.push(new BigNumber(each.value).dividedBy(1e18).toNumber())
        });
        console.log(dataX, dataY);
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: dataX
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: dataY,
                type: 'line',
                areaStyle: {}
            }]
        };
        return (
            <WingBlank>
                <ReactEcharts
                    option={option}
                    style={{height: '350px', width: '100%'}}
                    className='react_for_echarts'/>
                {/*<div id="container" style={{width: '100%', height: '400px'}}></div>*/}

                {/*<Flex>*/}
                {/*    <Flex.Item style={{flex: 49, height: '300px'}}>{this.renderMap(this.props.buyList, 0)}</Flex.Item>*/}
                {/*    <Flex.Item style={{flex: 2, height: '300px'}}></Flex.Item>*/}
                {/*    <Flex.Item style={{flex: 49, height: '300px'}}>{this.renderMap(this.props.sellList, 1)}</Flex.Item>*/}
                {/*</Flex>*/}
            </WingBlank>
        )
    }
}

export default Depthmap