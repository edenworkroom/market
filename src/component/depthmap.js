import React, {Component} from 'react';
import {Flex, List, TabBar, WingBlank} from "antd-mobile";

import language from './language'
import {showPK, showPrice, showValue, showValueP} from "./common";
import Highcharts from 'highcharts';


export class Depthmap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sellList: props.sellList,
            buyList: props.buyList
        }
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

    componentDidMount() {
        const {buyList, sellList} = this.props;
        let dataX = [];
        let dataY = [];
        console.log("componentDidMount", this.state.buyList, this.state.sellList);
        this.props.buyList.forEach(each => {
            dataX.push(each.price)
            dataY.push(each.value)
        });
        this.props.sellList.forEach(each => {
            dataX.push(each.price)
            dataY.push(each.value)
        });

        Highcharts.chart('container', {
            chart: {
                type: 'area'
            },
            title: {
                text: '深度图'
            },
            subtitle: {
                text: '数据来源'
            },
            xAxis: {
                title: {
                    enabled: false,
                },
                labels: {
                    formatter: function () {
                        return dataX[this.value]
                    },
                },
                tickmarkPlacement: 'on'
            },
            yAxis: {
                title: {
                    enabled: false,
                },
                minPadding: 0,
                startOnTick: false,
                tickWidth: 1,
                gridLineWidth: 0,
                labels: {
                    formatter: function () {
                        this.value = this.value >= 1000 ? this.value / 1000 + 'k' : this.value
                        return this.value;
                    }
                }
            },
            tooltip: {
                headerFormat: '',
                pointFormatter: function () {
                    return '<b>委托价：' + dataX[this.x] + '</b><br/><b>累计：' + this.y + '</b>'
                }
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 4,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                zoneAxis: 'x',
                color: '#ffd6d6',
                zones: [{
                    value: (dataY.length) / 2 - 1,
                    color: '#d3ebd8'
                }],
                data: dataY
            }]
        });
    }

    render() {
        // console.log("depthmap", this.props.sellList, this.props.buyList);
        return (
            <WingBlank>
                <div id="container" style={{width: '100%', height: '400px'}}></div>

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