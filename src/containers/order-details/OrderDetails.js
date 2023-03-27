import React from "react";
import { Link } from "react-router-dom";
import "./OrderDetails.css";
import Header from "../../components/header/Header";
import THDatatable from "../../components/THdatatable/THDatatable";
import { getOrderDetail, orderStatusChange } from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import moment from "moment";
import THOrderConfirmModal from "../../components/THmodal/THOrderConfirmModal";

class OrderDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			imagePath: '',
			transportPath:'',
			orderConfirmModalShow: false,
			orderDetail: [],
			subOrderDetail: [],
			analysisOrderDetail: []
		};
	}

	componentDidMount() {
		const id = this.props.match.params.id;
		this.props.getOrderDetail(id).then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					isLoading: false,
					orderDetail: resp.data.data,
					subOrderDetail: resp.data.data[0]?.order_details[0],
					imagePath: resp.data.imagePath,
					transportPath: resp.data.transportPath,
				});
			}
		});
	}
	setOrderConfirmModalShow = (e, id) => {
		e.preventDefault();
		this.setState({
			orderId: id,
			orderConfirmModalShow: !this.state.orderConfirmModalShow,
		});
	};
	changeStatus = async (status) => {
		if (status == 0) {
			this.setState({
				orderConfirmModalShow: !this.state.orderConfirmModalShow,
			});
		}
		else {
			const { list, orderId } = this.state;
			let orderdata = { status: status, id: orderId }

			this.props.orderStatusChange(orderdata).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success(resp.message);
				}
				else {
					toast.error(resp.message);
				}
				this.setState({
					orderConfirmModalShow: !this.state.orderConfirmModalShow,
				});
			})
		}
	}
	render() {
		const { imagePath, orderDetail, subOrderDetail } = this.state;
		const buyerSellerColumns = [
			{
				dataField: "Name",
				text: "Item Name",
				sort: true,
				headerStyle: () => {
					return { width: "20%" };
				},
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-info-wrap ps-0">
									<div className="order-details">
										<h5 className="blue">#{row.order_number}</h5>
										<h4>
											{row?.seller_product?.product.name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "first_name",
				text: "Name",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div>
							{row?.user?.first_name} {row?.user?.last_name}
						</div>
					);
				},
			},
			{
				dataField: "Quantity",
				text: "Quantity",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						row?.order_details[0]?.qty
					)
				}
			},
			{
				dataField: "BuyUnit",
				text: "Buy/Unit",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						row?.order_details[0]?.price

					);
				},
			},
			{
				dataField: "total_price",
				text: "Total",
			},
			{
				dataField: "ExpDate",
				text: "Exp. Date",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<span>
							{moment(row?.order_date).format('DD, MMM YYYY')}
						</span>
					);
				},
			},
			{
				dataField: "Address",
				text: "Address",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.address}
						</h4>

					);
				},
			},
			{
				dataField: "Action",
				text: "",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						orderDetail && orderDetail[0]?.status !== 3 ?
						<Link to={`/changes-status/${row.uuid}`} className="btn tirtiery-btn">
							Modify
						</Link>
						:""
					);
				},
			},
		];

		const transporterColumns = [
			{
				dataField: "Name",
				text: "Item Name",
				sort: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-info-wrap ps-0">
									<div className="order-details">
										<h5 className="blue">#{row.order_number}</h5>
										<h4>
											{row?.seller_product?.product.name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "Quantity",
				text: "Quantity",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						row?.order_details[0]?.qty
					)
				}
			},
			{
				dataField: "Pickup",
				text: "Pickup",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.address}
						</h4>
					)
				}
			},
			{
				dataField: "PickupDate",
				text: "Pickup Date",
			},
			{
				dataField: "Dropoff",
				text: "Dropoff",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.seller_product.pickup_address}
						</h4>
					)
				}
			},
			{
				dataField: "total_price",
				text: "Payout",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.order_tariff?.distance * row?.order_tariff?.tariff_price}
						</h4>
					)
				}
			},
			{
				dataField: "Action",
				text: "",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						orderDetail && orderDetail[0]?.status !== 3 ?
						<Link to={`/changes-status/${row.uuid}`} className="btn tirtiery-btn">
							Modify
						</Link>
						:""
					)
				}
			},
		];


		const analysisColumns = [
			{
				dataField: "Name",
				text: "Item Name",
				sort: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-info-wrap ps-0">
									<div className="order-details">
										<h5 className="blue">#{row.order_number}</h5>
										<h4>
											{row?.seller_product?.product.name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "Quantity",
				text: "Quantity",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						row?.order_details[0]?.qty
					)
				}
			},
			{
				dataField: "Address",
				text: "Address",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.address}
						</h4>
					)
				}
			},
			{
				dataField: "LastDate",
				text: "Last Date",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{moment(row?.order_analyasis && row?.order_analyasis.created_at).format('DD, MMM YYYY')}
						</h4>
					)
				}
			},
			{
				dataField: "total_price",
				text: "Total",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.order_analyasis?.analysis_price}
						</h4>
					)
				}
			},
			{
				dataField: "Action",
				text: "",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						orderDetail && orderDetail[0]?.status !== 3 ?
						<Link to={`/changes-status/${row.uuid}`} className="btn tirtiery-btn">
							Modify
						</Link>
						:""
					)
				}
			},
		];
		const warehouseColumns = [
			{
				dataField: "Name",
				text: "Warehouse Name",
				sort: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (

						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-info-wrap ps-0">
									<div className="order-details">
										<h4>
											{row.order_warehouses[0]?.warehouse?.name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "price",
				text: "Price",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						row.order_warehouses[0]?.warehouse?.price
					)
				}
			},
			{
				dataField: "Address",
				text: "Address",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.order_warehouses[0]?.warehouse?.address}
						</h4>
					)
				}
			},

			{
				dataField: "total_price",
				text: "	",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>

						</h4>
					)
				}
			},

		];


		const paginationOptions = {
			withFirstAndLast: false,
			hidePageListOnlyOnePage: true,
			showTotal: true,
			hideSizePerPage: true,
			sizePerPage: 10,
			alwaysShowAllBtns: true,
			prePageText: <i className="ri-arrow-left-s-line"></i>,
			nextPageText: <i className="ri-arrow-right-s-line"></i>,
		};
		return (
			<main className="page-content admin-order-details-page">
				<Header title="Order Details" />

				<div className="main-content">
					<div className="order-details-grid">
						<section className="open-orders-wrap current-order">
							<div className="order-item">
								<div className="order-img">
									<img
										className="img-cover"
										src={imagePath + orderDetail && imagePath + orderDetail[0]?.seller_product?.product?.image}
										alt="Order"
									/>
								</div>

								<div className="order-info-wrap">
									<div className="order-details">
										<h4>
											{orderDetail && orderDetail[0]?.seller_product?.product.name}
										</h4>
										<p className="gray mb-0">Qty : {subOrderDetail && subOrderDetail?.qty}</p>
									</div>
									<Link
										to="/edit-shipping-info"
										className="action-link align-align-self-start">
										Edit
									</Link>
								</div>
							</div>
							<div className="current-order-info gap">
								<div className="or-info c1">
									<label className="gray">Order ID</label>
									<h5 className="mb-0">{orderDetail && orderDetail[0]?.order_number}</h5>
								</div>
								<div className="or-info c2">
									<label className="gray">Buy/Unit</label>
									<h5 className="mb-0">${subOrderDetail && subOrderDetail?.price}</h5>
								</div>
								<div className="or-info c3">
									<label className="gray">Total</label>
									<h5 className="mb-0">${orderDetail && orderDetail[0]?.total_price}</h5>
								</div>
								{orderDetail[0]?.transport_type === 1 ?
								<div className="or-info c4">
									<label className="gray">Pickup Address</label>
									<h5>{orderDetail[0]?.order_warehouses ? orderDetail[0].order_warehouses[0].warehouse?.name : ""} {orderDetail[0].order_warehouses ? orderDetail[0].order_warehouses[0].warehouse?.address : ""}</h5>
								</div>
								: ""}
								{/* <div className="or-info c4">
									<label className="gray">Address</label>
									<h5 className="mb-0">
										{orderDetail && orderDetail[0]?.address}
									</h5>
								</div> */}
								<div className="or-info c5">
									<label className="gray">Purchase Date</label>
									<h5 className="mb-0">{moment(orderDetail && orderDetail[0]?.order_date).format('DD, MMM YYYY')}</h5>
								</div>
								{/* {orderDetail[0]?.transport_type === 1 ?
									<div className="or-info c5">
										 <div className="or-info">
											<label className="gray">Pickup Address</label>
											<h5>{orderDetail[0]?.order_warehouses ? orderDetail[0].order_warehouses[0].warehouse?.name : ""} {orderDetail[0].order_warehouses ? orderDetail[0].order_warehouses[0].warehouse?.address : ""}</h5>
										{/* </div> 
									</div>
									: ""} */}
							</div>
						</section>

						<section className="current-order-actions">
							<div className="action-required d-none">
								<h3>Action Required</h3>

								<h6>Complete Your Information</h6>
								<p className="gray">
									{/* Lorem ipsum dolor sit amet, consect etur adipiscing elit sed do. */}
								</p>
								<button className="btn primary-btn text-uppercase w-100">
									Complete Now
								</button>
							</div>

							<div className="action-required">
								<h3>Action Required</h3>

								{/* <h6>Is Order Matched?</h6> */}
								<p className="gray">
									{/* Lorem ipsum dolor sit amet, consect etur adipiscing elit sed do. */}
								</p>
								{orderDetail && orderDetail[0]?.status === 0 ?
									<button className="btn primary-btn text-uppercase w-100" onClick={(e) => this.setOrderConfirmModalShow(e, orderDetail[0]?.uuid)}>
										Confirm Order
									</button>
									: ""}
								<Link
									to={`/order/open-dispute/${orderDetail[0]?.uuid}`}
									className="action-link text-center d-block pt-3">
									Open Dispute
								</Link>
							</div>

							<div className="action-required d-none">
								<h3>Action Required</h3>

								<h6>Pay Now</h6>
								<p className="gray">
									{/* Lorem ipsum dolor sit amet, consect etur adipiscing elit sed do. */}
								</p>
								<button className="btn primary-btn text-uppercase w-100">
									Pay
								</button>
							</div>

							<div className="download-docs">
								<h3>Download Documents</h3>

								<ul className="doc-list">
									{/* <li>
										<div className="doc-info">
											<i className="ri-file-text-line"></i> Contract
										</div>
										<button>
											<i className="ri-download-fill"></i>
										</button>
									</li> */}
									{orderDetail[0]?.order_shipments[0]?.load_doc?
									<li>
										<div className="doc-info">
										<Link
											to={{ pathname: `${this.state.transportPath}${orderDetail[0]?.order_shipments[0]?.load_doc}` }} target="_blank"
										>
											<i className="ri-truck-line"></i>Delivery Note
										</Link>
										</div>
										<button>
											<i className="ri-download-fill"></i>
										</button>
									</li>
									:""}
									{/* <li>
										<div className="doc-info">
											<i className="ri-file-chart-2-line"></i>Analysis
										</div>
										<button>
											<i className="ri-download-fill"></i>
										</button>
									</li> */}
									<li>
										<div className="doc-info">
											<Link
												 to={`/order-invoice/${orderDetail[0]?.uuid}`}
											>
												<i className="ri-file-list-3-line"></i>Invoice
											</Link>

										</div>
										<button>
											<i className="ri-download-fill"></i>
										</button>
									</li>
								</ul>
							</div>
						</section>
					</div>
					<section className="table-section">
						<div className="title-bar">
							<h2 className="mb-0">Buyer</h2>
						</div>

						<THDatatable name="name" paginationOptions={paginationOptions} columns={buyerSellerColumns} dataList={orderDetail} />
					</section>
					<section className="table-section">
						<div className="title-bar">
							<h2>Seller</h2>
						</div>

						<THDatatable name="name" paginationOptions={paginationOptions} columns={buyerSellerColumns} dataList={orderDetail} />
					</section>
					<section className="table-section">
						<div className="title-bar">
							<h2>Transporter Details</h2>
						</div>
						<THDatatable name="name" paginationOptions={paginationOptions} columns={transporterColumns} dataList={orderDetail} />
					</section>
					{orderDetail[0]?.order_analyasis ?
						<section className="table-section">
							<div className="title-bar">
								<h2 className="mb-0">Analysis Details</h2>
							</div>


							<THDatatable name="name" paginationOptions={paginationOptions} columns={analysisColumns} dataList={orderDetail} />
						</section>
						: ""}
					{orderDetail[0]?.order_warehouses ?
						<section className="table-section">
							<div className="title-bar">
								<h2 className="mb-0">Warehouse Details</h2>
							</div>


							<THDatatable name="name" paginationOptions={paginationOptions} columns={warehouseColumns} dataList={orderDetail} />
						</section>
						: ""}
				</div>
				<THOrderConfirmModal

					show={this.state.orderConfirmModalShow}
					onHide={(status) => this.changeStatus(status)}
					reject="rejectbyadmin"
					confirm="confirmbyadmin"
					title="Confirm Order"
					description="Do you want to confirm this order?"
				/>
			</main>
		);
	}
}

OrderDetails.protoType = {
	getOrderDetail: PropTypes.func,
	orderStatusChange: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
	getOrderDetail: (data) => dispatch(getOrderDetail(data)),
	orderStatusChange: (data) => dispatch(orderStatusChange(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails);