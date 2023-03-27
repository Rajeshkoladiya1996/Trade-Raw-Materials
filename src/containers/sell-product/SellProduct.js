import React from "react";
import Header from "../../components/header/Header";
import THDatatable from "../../components/THdatatable/THDatatable";
import {
	getsellProductList,
	sellProductStatusChange,
	sellProductDetele,
} from "../../actions";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import cx from "classnames";
import THProductStatusModal from "../../components/THmodal/THProductStatusModal";
import THDeleteModal from "../../components/THmodal/THDeleteProductModal";

class SellProduct extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userListModalShow: false,
			deleteModalShow: false,
			isLoading: true,
			userId: "",
			userIndex: "index",
			imagePath: "",
			productList: [],
		};
	}
	getsellProductList = (key) => {
		if (key === "seller") {
			this.props.getsellProductList(key).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					this.setState({
						isLoading: false,
						productList: resp.data?.data,
						imagePath: resp.data?.imagePath,
					});
				}
			});
		}
	}

	componentDidMount() {
		this.getsellProductList("seller");
	}
	setProductListModalShow = (e, id, index, status, type) => {
		e.preventDefault();
		this.setState({
			userId: id,
			userIndex: index,
			status: status,
			statusType: type,
			productListModalShow: !this.state.productListModalShow,
		});
	};

	changeStatus = (status) => {
		const { userId, statusType } = this.state;
		if (status === 1) {

			this.props.sellProductStatusChange(userId).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("Sell Product status change successfully.");
					if (statusType == "seller") {
						this.getsellProductList("seller");
					}
				}
			});
		}
		this.setState({
			userId: "",
			userIndex: "",
			productListModalShow: !this.state.productListModalShow,
		});
	};

	setDeleteModalShow = (e, id, index, type) => {
		e.preventDefault();
		this.setState({
			userId: id,
			userIndex: index,
			deleteType: type,
			deleteModalShow: !this.state.deleteModalShow,
		});
	};
	deleteProduct = (status) => {
		const { userId, deleteType } = this.state;
		if (status === 1) {

			this.props.sellProductDetele(userId).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("Sell product delete successfully.");
					if (deleteType == "seller") {
						this.getsellProductList("seller");
					}
				}
			});


		}
		this.setState({
			userId: "",
			userIndex: "",
			deleteModalShow: !this.state.deleteModalShow,
		});
	};

	render() {
		const columns = [
			{
				dataField: "ProductName",
				text: "Product Name",
				sort: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-img">
									<img className="img-cover" src={row.product.image} alt="" />
								</div>
								<div className="order-info-wrap">
									<div className="order-details">
										<h4>{row.product.name}</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "UserName",
				text: "Seller User Name",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row.user.first_name} {row.user.last_name}
						</h4>
					);
				},
			},
			{
				dataField: "availble_quantity",
				text: "Available Quantity",
			},
			{
				dataField: "min_order_quantity",
				text: "Min. Quantity",
			},
			{
				dataField: "quality",
				text: "Quality"
			},
			{
				dataField: "price",
				text: "Price",
			},
			{
				dataField: "packaging_delivery",
				text: "PackagingDetails",
			},
			{
				dataField: "currency_pay",
				text: "Currency",
			},
			{
				dataField: "pickup_address",
				text: "Location",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row.pickup_address !== null && row.pickup_address !== null
								? row.pickup_address
								: "-"}
						</h4>
					);
				},
			},
			{
				dataField: "Status",
				text: "Status",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<Link
							to="#"
							className={cx("action-link", {
								"status-green": row.status,
								"text-danger": !row.status,
							})}
							onClick={(e) =>
								this.setProductListModalShow(e, row.uuid, rowIndex, row.status, "seller")
							}>
							{row.status ? "Active" : "De-Active"}
						</Link>
					);
				},
			},
			{
				dataField: "Action",
				text: "Action",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="d-flex align-items-center">
							<Link to={"/sell-product/" + row.uuid + "/edit"} className="action-link me-2">
								Edit
							</Link>
							<Link
								to="#"
								onClick={(e) => this.setDeleteModalShow(e, row.uuid, "seller")}
								className="action-link text-danger">
								Delete
							</Link>
						</div>
					);
				},
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
		const { productList, status } = this.state;
		const statusText = `Are you sure, you want to  ${status || status === true ? "De-active" : "Active"
			} account ?`;
		return (
			<main className="page-content admin-order-details-page">
				<Header title="Product Sell Management" />
				<div className="main-content">
					<section className="table-section">
						<THDatatable
							paginationOptions={paginationOptions}
							columns={columns}
							dataList={productList}
							name="analysis-user"
						/>
					</section>
				</div>

				<THProductStatusModal
					statustext={statusText}
					show={this.state.productListModalShow}
					onHide={(status) => this.changeStatus(status)}
				/>
				<THDeleteModal
					show={this.state.deleteModalShow}
					onHide={(status) => this.deleteProduct(status)}
				/>
			</main>
		);
	}
}

SellProduct.propsType = {
	getsellProductList: PropTypes.func,
	sellProductStatusChange: PropTypes.func,
	sellProductDetele: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	getsellProductList: (data) => dispatch(getsellProductList(data)),
	sellProductStatusChange: (data) => dispatch(sellProductStatusChange(data)),
	sellProductDetele: (data) => dispatch(sellProductDetele(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SellProduct);
