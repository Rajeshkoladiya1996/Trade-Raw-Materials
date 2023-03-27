import React from "react";
import Header from "../../components/header/Header";
import { Tab, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import THDatatable from "../../components/THdatatable/THDatatable";
import { getOrderList, orderStatusChange } from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import cx from "classnames";
import moment from "moment";
import THOrderConfirmModal from "../../components/THmodal/THOrderConfirmModal";
class Orders extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			imagePath: '',
			list: 'all',
			orderConfirmModalShow: false,
			orderList: []
		};
	}
	componentDidMount() {
		this.orderList('all');
	}
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
					this.orderList(list);
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
	orderList = (key) => {
		this.props.getOrderList(key).then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					orderList: resp.data.data,
					imagePath: resp.data.imagePath,
					list: key
				})
			}
		})
	}
	setOrderConfirmModalShow = (e, id) => {
		e.preventDefault();
		this.setState({
			orderId: id,
			orderConfirmModalShow: !this.state.orderConfirmModalShow,
		});
	};
	render() {
		const { imagePath, orderList } = this.state;
		let columns = [
			{
				dataField: "ItemName",
				text: "Item Name",
				sort: true,
				csvFormatter: (cell, row ) => `${(row?.seller_product)?row?.seller_product?.product.name:row?.seller_warehouse_product?.product.name}  ${row?.order_number}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-img">
									<img
										className="img-cover"
										src={`${imagePath}${(row?.seller_product)?row?.seller_product?.product?.image:row?.seller_warehouse_product?.product?.image}`}
										alt="Order"
									/>
								</div>
								<div className="order-info-wrap">
									<div className="order-details">
										<h5 className="blue">{row?.order_number}</h5>
										<h4>
											{(row?.seller_product)?row?.seller_product?.product.name:row?.seller_warehouse_product?.product.name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "name",
				text: "Buyer Name",
				csvFormatter: (cell, row ) => `${(row?.user?.first_name)} ${(row?.user?.last_name)}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div>{row?.user?.first_name} {row?.user?.last_name}</div>
					);
				},
			},
			{
				dataField: "name",
				text: "Seller Name",
				csvFormatter: (cell, row ) => `${(row?.seller_product)?row?.seller_product?.user?.first_name:row?.seller_warehouse_product?.user?.first_name} ${(row?.seller_product)?row?.seller_product?.user?.last_name:row?.seller_warehouse_product?.user?.last_name}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div>{(row?.seller_product)?row?.seller_product?.user?.first_name:row?.seller_warehouse_product?.user?.first_name} {(row?.seller_product)?row?.seller_product?.user?.last_name:row?.seller_warehouse_product?.user?.last_name}</div>

					);
				},
			},
			{
				dataField: "qty",
				text: "Quantity",
				csvFormatter: (cell, row ) => `${row?.order_details[0]?.qty}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						row?.order_details[0]?.qty

					);
				},
			},
			{
				dataField: "address",
				text: "Address",
				csvFormatter: (cell, row ) => `${row?.address}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.address}
						</h4>

					);
				},
			},
			{
				dataField: "transport",
				text: "Transport Type",
				csvFormatter: (cell, row ) => `${row?.transport_type===1?"FOB":"CIF"}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row?.transport_type===1?"FOB":"CIF"}
						</h4>
					);
				},
			},
			{
				dataField: "total_price",
				text: "Total",
				csvFormatter: (cell, row ) => `${row?.total_price}`,
			},
			{
				dataField: "currency",
				text: "Currency",
				csvFormatter: (cell, row ) => `${row?.currency}`,
			},
			{
				dataField: "order_date",
				text: "Purchase Date",
				csvFormatter: (cell, row ) => `${moment(row?.order_date).format('DD, MMM YYYY')}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div>
							{moment(row?.order_date).format('DD, MMM YYYY')}
						</div>
					);
				},
			},
			{
				dataField: "pstatus",
				text: "Payment Status",
				csvFormatter: (cell, row ) => `${ row.payment_status===0?'Pending':'Paid'}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return(
						<h5 className={cx("status-pill", {
							"pending": row.payment_status === 0,
					
							"completed": row.payment_status === 1,
							
						})}>
						{
							row.payment_status === 0 ?
							<Link to="#" >Pending</Link>
							:
							<Link to="#">Paid</Link>
								
     					}

						</h5>
					)
				}
			},
			{
				dataField: "status",
				text: "Order Status",
				csvFormatter: (cell, row ) => `${ 
					row.payment_status===0?'Pending'
					:row.status === 1 ?'Preparing'
					:row.status === 2 ?'Delivering'
					:row.status === 3 ?'Completed'
					:row.status === 4 ?'Canceled'
					:row.status === 5 ?'Accepted By Seller'
					:row.status === 6 ?'Rejected By Seller'
					:row.status === 7 ?'No Transporter'
					:row.status === 8 ?'Buyer Unavailable'
					:row.status === 9 ?'Confirmed By Admin'
					:'Rejected By Admin'
				}`,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h5 className={cx("status-pill", {
							"pending": row.status === 0,
							"preparing": row.status === 1 || row.status === 5 || row.status === 9,
							"delivering": row.status === 2,
							"completed": row.status === 3,
							"canceled": row.status === 4 || row.status === 6 || row.status === 7 || row.status === 8,
						})}>
							{
								row.status === 0 ?
								<Link to="#" onClick={(e) => this.setOrderConfirmModalShow(e, row.uuid)}>Pending</Link>
								:
								row.status === 1 ?
								<Link to="#">Preparing</Link>
								:
								row.status === 2 ?
								<Link to="#">Delivering</Link>
								:
								row.status === 3 ?
								<Link to="#">Completed</Link>
								:
								row.status === 4 ?
								<Link to="#">Canceled</Link>
								:
								row.status === 5 ?
								<Link to="#">Accepted By Seller</Link>
								:
								row.status === 6 ?
								<Link to="#">Rejected By Seller</Link>
								:
								row.status === 7 ?
								<Link to="#">No Transporter</Link>
								:
								row.status === 8 ?
								<Link to="#">Buyer Unavailable</Link>
								:
								row.status === 9 ?
								<Link to="#">Confirmed By Admin</Link>
								:
								<Link to="#">Rejected By Admin</Link>
							}

						</h5>
					);
				},
			},
			{
				dataField: "Action",
				text: "",
				csvFormatter: (cell, row ) => ``,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<Link to={`/order/detail/${row.uuid}`} className="btn tirtiery-btn">
							Manage
						</Link>


					);
				},
			},
		];

		// const selectRow = {
		// 	mode: "checkbox",
		// 	clickToSelect: true,
		// };

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
			<main className="page-content admin-orders-page">
				<Header title="Orders" />

				<div className="main-content">
					<Tab.Container id="admin-order-tabs" defaultActiveKey="all" onSelect={this.orderList}>
						<div className="custom-tab-wrap">
							<Nav variant="pills">
								<Nav.Item>
									<Nav.Link eventKey="all">All Orders</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="new">New Orders</Nav.Link>
								</Nav.Item>

								<Nav.Item>
									<Nav.Link eventKey="completed">Completed</Nav.Link>
								</Nav.Item>
							</Nav>

							<div className="table-option-wrap">
								{/* <button className="btn table-option-btn me-3">
									<i className="ri-download-fill align-bottom"></i> Export
								</button> */}
								{/* <Dropdown className="rounded-dropdown me-3">
									<Dropdown.Toggle variant="light" id="table-sort-by">
										<h5 className="d-flex align-items-center me-2">
											View Only :
											<span className="d-flex align-items-center ms-2">
												Matched <i className="ri-arrow-down-s-line ms-2"></i>
											</span>
										</h5>
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item to="#/action-1">Unmatched</Dropdown.Item>
										<Dropdown.Item to="#/action-2">All</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
								<Dropdown className="rounded-dropdown">
									<Dropdown.Toggle variant="light" id="table-sort-by">
										<h5 className="d-flex align-items-center me-2">
											Sort By:
											<span className="d-flex align-items-center ms-2">
												Buy <i className="ri-arrow-down-s-line ms-2"></i>
											</span>
										</h5>
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item to="#/action-1">Buy</Dropdown.Item>
										<Dropdown.Item to="#/action-2">Sell</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown> */}
							</div>
						</div>
						<Tab.Content>
							<Tab.Pane eventKey="all">
								<THDatatable name="ItemName"
									isExport={true}
									paginationOptions={paginationOptions}
									columns={columns}
									dataList={orderList} />
							</Tab.Pane>
							<Tab.Pane eventKey="new">
								<THDatatable
									isExport={true}
									name="ItemName"
									paginationOptions={paginationOptions}
									columns={columns}
									dataList={orderList} />
							</Tab.Pane>

							<Tab.Pane eventKey="completed">

								<THDatatable name="ItemName"
									isExport={true}
									paginationOptions={paginationOptions}
									columns={columns}
									dataList={orderList} />
							</Tab.Pane>
						</Tab.Content>
					</Tab.Container>
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

Orders.propsType = {
	getOrderList: PropTypes.func,
	orderStatusChange: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
	getOrderList: (data) => dispatch(getOrderList(data)),
	orderStatusChange: (data) => dispatch(orderStatusChange(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Orders);