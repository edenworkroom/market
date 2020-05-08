import React, {Component} from 'react';
import {Carousel} from "antd-mobile";

class MCarousel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: ['1', '2'],
            imgHeight: 176,
        }
    }

    componentDidMount() {
        // this.setState({
        //     data: ['1','1', '1'],
        // });
    }

    render() {
        return (
            <Carousel style={{padding: "16px", background: "#DEF1E5", overflow: "hidden"}}
                      frameOverflow="visible"
                      cellSpacing={10}
                      slideWidth={0.8}
                      autoplay
                      infinite
                      afterChange={index => this.setState({slideIndex: index})}
            >
                {this.state.data.map((val, index) => (
                    <a
                        key={val}
                        style={{
                            display: 'block',
                            position: 'relative',
                            top: this.state.slideIndex === index ? -10 : 0,
                            height: this.state.imgHeight,
                            boxShadow: '2px 1px 1px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <img
                            src={'https://edenworkroom.gitee.io/logo/static/banner_' + val + '.png'}
                            alt=""
                            style={{width: '100%', verticalAlign: 'top'}}
                            onLoad={() => {
                                // fire window resize event to change height
                                window.dispatchEvent(new Event('resize'));
                                this.setState({imgHeight: 'auto'});
                            }}
                        />
                    </a>

                ))}
            </Carousel>
        );
    }
}

export default MCarousel