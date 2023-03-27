import React from "react";
import Header from "../../components/header/Header";
import THDatatable from "../../components/THdatatable/THDatatable";
import THProductStatusModal from "../../components/THmodal/THProductStatusModal";
import THDeleteModal from "../../components/THmodal/THDeleteProductModal";
import { Link } from "react-router-dom";
import { getAnalysisList, userStatusChange } from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import cx from "classnames";

class AnalysisUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			productListModalShow: false,
			deleteModalShow: false,
			isLoading: true,
			userId: "",
			userIndex: "index",
			analysisUserList:[]
		};
	}
	getAnalysisList(){
		this.props.getAnalysisList("").then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					isLoading: false,
					analysisUserList: resp.data,
				});
			}
		});
	}
	componentDidMount() {
		this.getAnalysisList();
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
					this.getAnalysisList();
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
		const {userId, userIndex } = this.state;
		if(status==1){
			
		}
		this.setState({
			userId:'',
			userIndex:'',
			deleteModalShow:!this.state.deleteModalShow
		});
	};
	render() {

		const analysisColumns = [
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
							{row.phone !== null 
								? row.phone
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
							<Link to={"/analysis-user/"+row.uuid+"/edit"} className="action-link me-2">
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
		const {analysisUserList , status} =this.state;
		const statusText = `Are you sure, you want to  ${
			status || status === true ? "De-active" : "Active"
		} account ?`;
		return (
			<main className="page-content admin-order-details-page">
				<Header title="Analysis User" />

				<div className="main-content">
					<section className="table-section">
						<THDatatable
							paginationOptions={paginationOptions}
							columns={analysisColumns}
							dataList={analysisUserList}
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
					title="Delete User"
					text="Do you want to delete this user?"
					show={this.state.deleteModalShow}
					onHide={(status) => this.deleteProduct(status)}
				/>
			</main>
		);
	}
}

AnalysisUser.propsType = {
	getsellProductList: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	getAnalysisList: (data) => dispatch(getAnalysisList(data)),
	userStatusChange: (data) => dispatch(userStatusChange(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisUser);