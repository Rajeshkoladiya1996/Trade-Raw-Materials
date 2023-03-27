import React from "react";
import Header from "../../components/header/Header";
import "./OpenDispute.css";
import io from 'socket.io-client';
import { getMessages, getOrderDetail } from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
// const socket = io(process.env.REACT_APP_SOCKET_API_URL);
class OpenDispute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            messageList: [],
            message: "",
            imagePath: "",
            orderDetail: "",
            subOrderDetail: ""
        };

    }
    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getOrderDetail(id).then((resp) => {
            if (resp && resp.ResponseCode === 1) {
                this.setState({
                    isLoading: false,
                    orderDetail: resp.data?.data[0],
                    subOrderDetail: resp.data?.data[0]?.order_details,
                    imagePath: resp.data.imagePath
                });
            }
        });
        this.props.getMessages(id).then((resp) => {
            let user = localStorage.getItem("user_detail");
            // socket.emit('join', { 'email': "admin@admin.com" });

            if (resp && resp.ResponseCode === 1) {

                this.setState({
                    ...this.state,
                    messageList: resp.data
                }, () => {
                    this.scrollToBottom();
                });
            }
        });
        // socket.on('get-msg', (data) => {
        //     let { messageList } = this.state;
        //     messageList.push(data);
        //     this.setState({
        //         ...this.state,
        //         messageList: messageList
        //     }, () => {
        //         this.scrollToBottom();
        //     })
        // })
    }
    scrollToBottom = (event) => {
        var element = document.getElementById("chat_list");
        if(element){
            element.scrollTop = element.scrollHeight;
        }
    }
    handleChange = (event) => {
        let { value } = event.target;
        this.setState({
            message: value
        });
    }
    handleKeyPress = (e) => {
        if (e.charCode == 13 || e.keyCode == 13) {
            this.sendMessage();
        }
    }
    sendMessage = () => {

        let data = {
            order_id: this.props.match.params.id,
            message: this.state.message,
            user_id: this.props.userDetail.id,
            from: "admin",
        }

        this.setState({
            ...this.state,
            message: "",
        })

        // socket.emit('send-msg', data);

    }

    render() {
        const { messageList, imagePath, orderDetail, subOrderDetail } = this.state;
        return (
            <main className="page-content open-dispute-page">
                <Header title="Open Dispute" />

                <div className="main-content">
                    <div className="order-details-grid">
                        <section className="open-orders-wrap current-order">
                            <h3>Dispute Details</h3>
                            <div className="order-item">
                                <div className="order-img">
                                    <img className="img-cover" src={imagePath + orderDetail && imagePath + orderDetail?.seller_product?.product?.image} alt="Order" />
                                </div>

                                <div className="order-info-wrap">
                                    <div className="order-details">
                                        <h4>
                                            {orderDetail?.seller_product?.product.name}
                                        </h4>
                                        <p className="gray mb-0">Qty : {subOrderDetail && subOrderDetail[0]?.qty}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="current-order-info d-flex flex-wrap justify-content-between">
                                <div className="or-info">
                                    <label className="gray">Order ID</label>
                                    <h5>{orderDetail && orderDetail?.order_number}</h5>
                                </div>
                                <div className="or-info">
                                    <label className="gray">Amount</label>
                                    <h5>${orderDetail && orderDetail?.total_price}</h5>
                                </div>
                                <div className="or-info">
                                    <label className="gray">Forecast Delivery Dates</label>
                                    <h5>{orderDetail?.delivery_date ? moment(orderDetail?.delivery_date).format('DD, MMM YYYY') : ''}</h5>
                                </div>
                            </div>
                        </section>
                        <section className="chat-section">
                            <div className="chat-wrap">
                                <div className="chat-with">
                                    <div className="chat-img">
                                        <img src="/assets/images/themis-logo.png" alt="recipient" className="img-cover" />
                                    </div>
                                    <h3 className="mb-0">Themis</h3>
                                </div>
                                <div className="chat-window">
                                    <div className="chat" id="chat_list">
                                        {messageList ? (
                                            messageList.map((item, key) => (
                                                <div className={item.isUser === true ? "msg-sent" : "msg-recieved"}>
                                                    <div className="msg-text">{item.message}</div>
                                                    <h6 className="msg-time mb-0">{moment(item.created_at).utc().format("H:mm")}</h6>
                                                </div>
                                            ))) : ""
                                        }
                                    </div>

                                    <div className="send-msg-box">
                                        <input type="text" placeholder="Type your message here..." value={this.state.message} onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                                        <div className="msg-actions w-100">
                                            {/* <button className="msg-icon">
                      <i className="ri-emotion-line"></i>
                    </button>
                    <button className="msg-icon">
                      <i className="ri-attachment-2"></i>
                    </button>
                    <button className="msg-icon">
                      <i className="ri-phone-line"></i>
                    </button> */}

                                            <button className="btn primary-btn ms-auto" onClick={this.sendMessage}>Send</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        );
    }
}
OpenDispute.protoType = {
    getMessages: PropTypes.func,
    getOrderDetail: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
    getMessages: (data) => dispatch(getMessages(data)),
    getOrderDetail: (data) => dispatch(getOrderDetail(data)),
});

const mapStateToProps = (state) => ({
    userDetail: state.authenticate.user,
});

export default connect(mapStateToProps, mapDispatchToProps)(OpenDispute);