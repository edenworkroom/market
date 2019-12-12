import React, {Component} from 'react';
import {Carousel} from "antd-mobile";

class MCarousel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: ['1', '2', '3'],
            imgHeight: 176,
        }
    }

    componentDidMount() {
        // simulate img loading
        setTimeout(() => {
            this.setState({
                data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);
    }

    render() {
        return (
                <Carousel style={{padding: "16px", background: "#DEF1E5",overflow: "hidden"}}
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
                            href="http://www.alipay.com"
                            style={{
                                display: 'block',
                                position: 'relative',
                                top: this.state.slideIndex === index ? -10 : 0,
                                height: 'auto',
                                boxShadow: '2px 1px 1px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            <img
                                src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                                alt=""
                                style={{width: '100%', verticalAlign: 'top'}}
                                onLoad={() => {
                                    // fire window resize event to change height
                                    window.dispatchEvent(new Event('resize'));
                                }}
                            />
                        </a>
                    ))}
                </Carousel>
        );
    }
}
export default MCarousel