import React from "react";
import Header from "../../components/header/Header";
import THDatatable from "../../components/THdatatable/THDatatable";
import { getbidProductList,bidProductStatusChange, bidProductDetele } from "../../actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import cx from "classnames";
import THProductStatusModal from "../../components/THmodal/THProductStatusModal";
import THDeleteModal from "../../components/THmodal/THDeleteProductModal";

class ProductBidList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			productListModalShow: false,
			deleteModalShow: false,
			isLoading: true,
			userId: "",
			userIndex: "index",
			productList:[]
		};
	}	
	getBidProductList(){
		this.props.getbidProductList("").then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					isLoading: false,
					productList: resp.data,
				});
			}
		});
	}
	componentDidMount(){
		this.getBidProductList();
	}

	setProductListModalShow = (e, id, index, status) => {
		e.preventDefault();
		this.setState({
			userId: id,
			userIndex: index,
			status: status,
			productListModalShow: !this.state.productListModalShow,
		});
	};

	changeStatus = (status) => {
		const { userId } = this.state;
		if (status === 1) {
			this.props.bidProductStatusChange(userId).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("Bid product status change successfully.");
					this.getBidProductList();
				}
			});
		}
		this.setState({
			userId: "",
			userIndex: "",
			productListModalShow: !this.state.productListModalShow,
		});
	};

	setDeleteModalShow = (e, id, index) => {
		e.preventDefault();
		this.setState({
			userId:id,
			userIndex:index,
			deleteModalShow:!this.state.deleteModalShow
		});
	};
	deleteProduct = (status) => {
		const {userId } = this.state;
		if(status===1){
			this.props.bidProductDetele(userId).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
				  toast.success("Bid delete successfully.");
				  this.getBidProductList();
				}
			});
		}
		this.setState({
			userId:'',
			userIndex:'',
			deleteModalShow:!this.state.deleteModalShow
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
									<img
										className="img-cover"
										src={row.product.image}
										alt=""
									/>
								</div>
								<div className="order-info-wrap">
									<div className="order-details">
										<h4>
											{row.product.name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "UserName",
				text: "Bid User Name",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row.user.first_name} {row.user.last_name}
						</h4>
					);
				},
			},
			{
				dataField: "bid_amount",
				text: "Amount",
				sort: true,
			},
			{
				dataField: "bid_expiration",
				text: "Expiration",
			},
			{
				dataField: "packaging_delivery",
				text: "Package Details",
			},
			{
				dataField: "currency_pay",
				text: "Currency",
			},
			{
				dataField: "pickup_address",
				text: "Location",
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
								this.setProductListModalShow(e, row.uuid, rowIndex, row.status)
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
							<Link to={"/product-bid/"+row.uuid+"/edit"} className="action-link me-2">
								Edit
							</Link>
							<Link
								to="#"
								onClick={(e) => this.setDeleteModalShow(e, row.uuid)}
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
		const {productList , status} =this.state;
		const statusText = `Are you sure, you want to  ${
			status || status === true ? "De-active" : "Active"
		} account ?`;
		return (
			<main className="page-content admin-order-details-page">
				<Header title="Product Bid List" />

				<div className="main-content">
					<section className="table-section">
						<THDatatable
							paginationOptions={paginationOptions}
							columns={columns}
							dataList={productList}
							name="transport"
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


ProductBidList.propsType = {
	getbidProductList: PropTypes.func,
	bidProductStatusChange:PropTypes.func,
	bidProductDetele: PropTypes.func
};
const mapDispatchToProps = (dispatch) => ({
	getbidProductList: (data) => dispatch(getbidProductList(data)),
	bidProductStatusChange:(data)=>dispatch(bidProductStatusChange(data)),
	bidProductDetele:(data)=>dispatch(bidProductDetele(data)),
	
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductBidList);
