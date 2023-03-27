import React from "react";
import { connect } from "react-redux";
import HeaderBg from "./../../assets/images/pdf-header.png";
import FooterBg from "./../../assets/images/pdf-footer.png";
import SignatureImage from "./../../assets/images/signature.png";
import "./OrderInvoice.css";
import { getOrderDetail } from "../../actions";
import PropTypes from "prop-types";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
class OrderInvoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      orderDetail: [],
  
    };
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getOrderDetail(id).then((resp) => {
      if (resp && resp.ResponseCode === 1) {
        this.setState({
          isLoading: false,
          orderDetail: resp.data.data,
        });
      }
    });
  }
  printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        let pdfname="invoice_"+Math.floor(Math.random() * 10000)+".pdf";
        pdf.save(pdfname);
      })
    ;
  }

  render() {
    // return (
    // 	<div className="auth-wrapp">

    // 	</div>
    // );
    const {orderDetail}=this.state;
    return (
      <div className="pdf-wrap">
        <div className="pdf-page" id="divToPrint">
          <div className="pdf-header">
            <img src={HeaderBg} alt="" className="pdf-bg-images" />
            <div className="pdf-brand-logo me-4">
              <img
                src="./assets/images/themis-logo.png"
                alt=""
                className="img-fluid"
              />
            </div>
            <h2 className="mb-0 brand-title">Themis</h2>
          </div>
          <div className="pdf-body">
            <h1 className="pdf-page-title">Invoice</h1>

            <table className="invoice-info-table">
              <tbody>
                <tr>
                  <th>Order Number</th>
                  <th>Invoice To</th>
                </tr>
                <tr>
                  <td>#{orderDetail[0]?.order_number}</td>
                  <td rowSpan={2}>
                    <h4>{orderDetail[0]?.user?.first_name} {orderDetail[0]?.user?.last_name}</h4>
                    <p className="mb-0 text-muted">
                    {orderDetail[0]?.user?.com_address}
                    </p>
                  </td>
                </tr>
                <tr>
                  <th>Order Date</th>
                </tr>
                <tr>
                  <td>{orderDetail[0]?.order_date} </td>
                </tr>
              </tbody>
            </table>

            <table className="invoice-price-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price/Unit</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="title-cell">
                      {orderDetail[0]?.seller_product?.product.name}
                  </td>
                  <td>${orderDetail[0]?.seller_product?.price}</td>
                  <td>{orderDetail[0]?.order_details[0]?.qty}</td>
                  <td>${orderDetail[0]?.order_details[0]?.qty*orderDetail[0]?.seller_product?.price}</td>
                </tr>
                <tr>
                  <td className="title-cell"></td>
                  <td colSpan={2} style={{ borderTop: "2px solid #E1E4E6" }}>
                    <strong>Subtotal </strong>
                  </td>
                  <td style={{ borderTop: "2px solid #E1E4E6" }}>${orderDetail[0]?.order_details[0]?.qty*orderDetail[0]?.seller_product?.price}</td>
                </tr>
                <tr>
                  <td className="title-cell"></td>
                  <td colSpan={2}>
                    <strong>Tariff</strong>
                  </td>
                  <td>${orderDetail[0]?.order_tariff?.distance*orderDetail[0]?.order_tariff?.tariff_price}</td>
                </tr>
                <tr>
                  <td className="title-cell"></td>
                  <td colSpan={2}>
                    <strong>Analysis</strong>
                  </td>
                  <td>${orderDetail[0]?.order_analyasis?.analysis_price}</td>
                </tr>
                <tr>
                  <td className="title-cell"></td>
                  <td colSpan={2} style={{ borderTop: "3px solid #E1E4E6" }}>
                    <strong>Invoice Total</strong>
                  </td>
                  <td style={{ borderTop: "3px solid #E1E4E6" }}>
                    <strong>${orderDetail[0]?.total_price}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* <div className="signature-section">
              <div className="signature-wrap">
                <img src={SignatureImage} alt="" className="img-fluid" />
              </div>
              <h6 className="text-center mb-0">Authorised Sign</h6>
            </div> */}

            <div style={{ clear: "both" }}></div>
          </div>
          <div className="pdf-footer">
            <img src={FooterBg} alt="" className="pdf-bg-images" />
          </div>
        </div>

        <div className="text-center py-3">
          <button className="btn primary-btn export-btn"  onClick={this.printDocument}>Export as PDF</button>
        </div>
      </div>
    );
  }
}

OrderInvoice.protoType = {
  getOrderDetail: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
  getOrderDetail: (data) => dispatch(getOrderDetail(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OrderInvoice);
