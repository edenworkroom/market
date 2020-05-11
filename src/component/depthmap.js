import React, {Component} from 'react';
import {Flex, List, TabBar, WingBlank} from "antd-mobile";
import ReactEcharts from 'echarts-for-react';
import BigNumber from "bignumber.js";
import language from './language'
import {showPK, showPrice, showValue, showValueP} from "./common";


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
        let dataY_buy = [];
        let dataY_sell = [];

        console.log(buyList, sellList);
        this.props.buyList.reverse().forEach(each => {
            dataX.push(new BigNumber(each.price).dividedBy(1e18).toNumber())
            dataY_buy.push(new BigNumber(each.value).dividedBy(1e18).toNumber())
            dataY_sell.push('');
        });
        this.props.sellList.forEach(each => {
            dataX.push(new BigNumber(each.price).dividedBy(1e18).toNumber())
            dataY_buy.push('');
            dataY_sell.push(new BigNumber(each.value).dividedBy(1e18).toNumber())
        });

        let option = {
            grid: {left: 10, top: 30, right: 10, bottom: 10},
            tooltip: {
                confine: true,
                trigger: 'axis',
                axisPointer: {type: 'line', lineStyle: {color: 'rgba(0, 0, 0, 0)'}},
                backgroundColor: '#355475',
                textStyle: {color: '#fff', fontSize: '14px'},
                extraCssText: 'box-shadow: 0 0 16px 0 rgba(0, 0, 0, .2);border-radius: 4px;'
            },
            // legend: {
            //     data: [
            //         {name: '买单', icon: 'rect'},
            //         {name: '卖单', icon: 'rect'}
            //     ],
            //     selected: {
            //         '买单': true,
            //         '卖单': true
            //     },
            //     itemWidth: 10,
            //     itemHeight: 10,
            //     textStyle: {color: '#fff'},
            //     pageIconColor: '#4CC453'
            // },
            xAxis: {
                type: 'category',
                // axisLine: {show: false},
                // axisTick: {show: false},
                // axisLabel: {show: false},
                boundaryGap: false,
                data: dataX
            },
            yAxis: [{
                type: 'value',
                // axisLine: {show: false},
                // axisTick: {show: false},
                // axisLabel: {show: false},
                // splitLine: {show: false}
            }],
            series: [
                {
                    name: '买单',
                    type: 'line',
                    // smooth: true,
                    // symbol: 'circle',
                    // showSymbol: false,
                    // symbolSize: 3,
                    // sampling: 'average',
                    itemStyle: {normal: {color: '#21BA45'}},
                    lineStyle: {normal: {color: '#21BA45'}},
                    areaStyle: {color: '#21BA45'},
                    data: dataY_buy
                },
                {
                    name: '卖单',
                    type: 'line',
                    // smooth: true,
                    // // symbol: 'circle',
                    // showSymbol: false,
                    // symbolSize: 3,
                    // sampling: 'average',
                    itemStyle: {normal: {color: '#D01919'}},
                    lineStyle: {normal: {color: '#D01919'}},
                    areaStyle: {color: '#D01919'},
                    data: dataY_sell
                }
            ]
        };
        return (
            <WingBlank>
                <ReactEcharts
                    option={option}
                    style={{height: '300px', width: '100%'}}
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