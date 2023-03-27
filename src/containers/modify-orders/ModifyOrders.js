import React from "react";
import Header from "../../components/header/Header";
import { Tab, Nav} from "react-bootstrap";
import { getOrderDetail } from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import BuyerOrderForm from "./OrderForms/BuyerOrderForm";
import SellerOrderForm from "./OrderForms/SellerOrderForm";
import TransportOrderForm from "./OrderForms/TransportOrderForm";
import AnalysisOrderForm from "./OrderForms/AnalysisOrderForm";
class ModifyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      imagePath: '',
      orderConfirmModalShow: false,
      orderDetail: [],
    };
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getOrderDetail(id).then((resp) => {
      var data = resp.data.data[0];
      if (resp && resp.ResponseCode === 1) {
        this.setState({
          isLoading: false,
          orderDetail: resp.data.data,
          imagePath: resp.data.imagePath,
        });
      }
    });
  }
  render() {
    const { orderDetail } = this.state;
    return (
      <main className="page-content modify-order-page">
        <Header title="Orders" />

        <div className="main-content">
          <Tab.Container id="modify-order-tabs" defaultActiveKey="buyerOrder">
            <div className="custom-tab-wrap">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="buyerOrder">Buyer Order</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="sellerOrder">Seller Order</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link eventKey="transporterOrder">Transporter Order</Nav.Link>
                </Nav.Item>
                {orderDetail[0]?.order_analyasis!=null?
                <Nav.Item>
                  <Nav.Link eventKey="analysisOrder">Analysis Order</Nav.Link>
                </Nav.Item>
                :""}
              </Nav>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="buyerOrder">
                <div className="form-wrapp">
                  <BuyerOrderForm order={orderDetail} id={this.props.match.params.id} />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="sellerOrder">
                <div className="form-wrapp">
                  <SellerOrderForm order={orderDetail} id={this.props.match.params.id} />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="transporterOrder">
                <div className="form-wrapp">
                  <TransportOrderForm order={orderDetail} id={this.props.match.params.id} />
                </div>
              </Tab.Pane>
             
              <Tab.Pane eventKey="analysisOrder">
                <div className="form-wrapp">
                  
                  <AnalysisOrderForm order={orderDetail} id={this.props.match.params.id} />
                </div>
              </Tab.Pane>
            </Tab.Content>
           
          </Tab.Container>
        </div>
      </main>
    );
  }
}
ModifyOrders.protoType = {
  getOrderDetail: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  getOrderDetail: (data) => dispatch(getOrderDetail(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModifyOrders);
