import React from "react";
import Header from "../../components/header/Header";
import THDatatable from "../../components/THdatatable/THDatatable";
import { Link } from "react-router-dom";
import { getTranspoterList,userStatusChange } from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import cx from "classnames";
import THProductStatusModal from "../../components/THmodal/THProductStatusModal";
import THDeleteModal from "../../components/THmodal/THDeleteProductModal";

class Transporter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userListModalShow: false,
			deleteModalShow: false,
			isLoading: true,
			userId: "",
			userIndex: "index",
			transportUserList:[]
		};

	}

	getTranspoterList(){
		this.props.getTranspoterList("").then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					isLoading: false,
					transportUserList: resp.data,
				});
			}
		});
	}
	componentDidMount() {
		this.getTranspoterList();
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
			this.props.userStatusChange(userId).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("Transpoter status chnage successfully.");
					this.getTranspoterList();
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
		if(status===1){
			
		}
		this.setState({
			userId:'',
			userIndex:'',
			deleteModalShow:!this.state.deleteModalShow
		});
	};

	render() {
		const transporterColumns = [
			{
				dataField: "Name",
				text: "Customer Name",
				sort: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-img">
									<img
										className="img-cover"
										src={row.profile_img}
										alt="Order"
									/>
								</div>
								<div className="order-info-wrap">
									<div className="order-details">
										<h4>
											{row.first_name} {row.last_name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			{
				dataField: "email",
				text: "Email Address",
			},
			{
				dataField: "phone",
				text: "Contact Number",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row.phone !== null && row.phone_code !== null
								? "(" + row.phone + ") " + row.phone_code
								: "-"}
						</h4>
					);
				},
			},
			{
				dataField: "Address",
				text: "Address",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
							{row.com_address !== null && row.com_address !== null
								? row.com_address
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
							<Link to={"/transporter/"+row.uuid+"/tariff-list"} className="action-link me-2">Tariff List</Link>
							<Link to={"/transporter/"+row.uuid+"/edit"} className="action-link me-2">
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
		const {transportUserList ,status} = this.state;
		const statusText = `Are you sure, you want to  ${
			status || status === true ? "De-active" : "Active"
		} account ?`;
		return (
			<main className="page-content admin-order-details-page">
				<Header title="Transporter Management" />

				<div className="main-content">
					<section className="table-section">
						<THDatatable
							paginationOptions={paginationOptions}
							columns={transporterColumns}
							dataList={transportUserList}
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
					title="Delete User"
					text="Do you want to delete this user?"
					show={this.state.deleteModalShow}
					onHide={(status) => this.deleteProduct(status)}
				/>
			</main>
		);
	}
}

Transporter.propsType = {
	getTranspoterList: PropTypes.func,
	userStatusChange: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	getTranspoterList: (data) => dispatch(getTranspoterList(data)),
	userStatusChange: (data) => dispatch(userStatusChange(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Transporter);