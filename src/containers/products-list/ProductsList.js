import React from "react";
import Header from "../../components/header/Header";
import THProductStatusModal from "../../components/THmodal/THProductStatusModal.js";
import THDeleteModal from "../../components/THmodal/THDeleteProductModal.js";
import {Link} from "react-router-dom";
import THDatatable from "../../components/THdatatable/THDatatable";
import {getproductList, productStatusChange, productDetele} from "../../actions";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import cx from "classnames";

class ProductsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productListModalShow: false,
      deleteModalShow: false,
      isLoading: true,
      prodId: "",
      prodIndex: "index",
      productList: [],
    };
  }

  componentDidMount() {
    this.props.getproductList("").then((resp) => {
      if (resp && resp.ResponseCode === 1) {
        this.setState({
          isLoading: false,
          productList: resp.data,
        });
      }
    });
  }
  
  setProductListModalShow = (e, id, index, status) => {
		e.preventDefault();
		console.log({status});
		this.setState({
			prodId: id,
			prodIndex: index,
			status: status,
			productListModalShow: !this.state.productListModalShow,
		});
  };

  chengeStatus = (status) => {
    const {prodId} = this.state;
    if (status === 1) {
		this.props.productStatusChange(prodId).then(async (resp) => {
			if (resp && resp.ResponseCode === 1) {
				toast.success("Product status chnage successfully.");
				this.props.getproductList("").then((resp) => {
					if (resp && resp.ResponseCode === 1) {
					this.setState({
						isLoading: false,
						productList: resp.data,
					});
					}
				});
			}
		});
    }
    this.setState({
		prodId: "",
		prodIndex: "",
		productListModalShow: !this.state.productListModalShow,
    });
  };
  setDeleteModalShow = (e, id, index) => {
    e.preventDefault();
    this.setState({
      prodId: id,
      prodIndex: index,
      deleteModalShow: !this.state.deleteModalShow,
    });
  };
  	deleteProduct = (status) => {
		const {prodId} = this.state;
		if (status === 1) {
			this.props.productDetele(prodId).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("Product delete successfully.");
				}
			});
		}
		this.setState({
			prodId: "",
			prodIndex: "",
			deleteModalShow: !this.state.deleteModalShow,
		});
  	};
	hadleButtonClick = () => {
			this.props.history.push("/product/add");
	};
  	render() {
    	const {status, productList} = this.state;

		const columns = [
			{
				dataField: "ItemName",
				text: "Item Name",
				sort: true,
				headerStyle: () => {
				return {width: "20%"};
				},
				formatter: (cell, row, rowIndex, formatExtraData) => {
				return (
					<div className="open-orders-wrap">
					<div className="order-item table-order-item">
						<div className="order-img">
						<img className="img-cover" src={row.image} alt="Order" />
						</div>

						<div className="order-info-wrap">
						<div className="order-details">
							<h4>{row.name}</h4>
						</div>
						</div>
					</div>
					</div>
				);
				},
			},
			{
				dataField: "description",
				text: "Description",
				headerStyle: () => {
				return {textAlign: "left", width: "50%"};
				},
				formatter: (cell, row, rowIndex, formatExtraData) => {
				return <h4 className="mb-0">{row.description}</h4>;
				},
			},
			{
				dataField: "min_quality",
				text: "Min. Quality",
				headerStyle: () => {
				return {textAlign: "left", width: "10%"};
				},
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return <h4 className="mb-0">{row.min_quality}</h4>;
				},
			},
			{
				dataField: "max_quality",
				text: "Max. Quality",
				headerStyle: () => {
				return {textAlign: "left", width: "10%"};
				},
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return <h4 className="mb-0">{row.max_quality}</h4>;
				},
			},
			{
				dataField: "Status",
				text: "Status",
				editable: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
				return (
					<Link
					to="#"
					className={cx("action-link", {"status-green": row.status, "text-danger": !row.status})}
					onClick={(e) => this.setProductListModalShow(e, row.id, rowIndex, row.status)}
					>
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
					<Link to={"/product/" + row.id + "/edit"} className="action-link me-2">
						Edit
					</Link>
					<Link to="#" onClick={(e) => this.setDeleteModalShow(e, row.id)} className="action-link text-danger">
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
    	const statusText = `Are you sure, you want to  ${status || status === true ? "De-active" : "Active"} product ?`;
		return (
			<main className="page-content admin-products-list text-left">
				<Header title="Products List" />
				<div className="main-content">
					<THDatatable
						name="ItemName"
						paginationOptions={paginationOptions}
						columns={columns}
						dataList={productList}
						isButtonVisible={true}
						btnLabelText="Add Product"
						hadleButtonClick={this.hadleButtonClick}
					/>
				</div>
				<THProductStatusModal  statustext={statusText} show={this.state.productListModalShow} onHide={(status) => this.chengeStatus(status)} />
				<THDeleteModal show={this.state.deleteModalShow} onHide={(status) => this.deleteProduct(status)} />
			</main>
		);
  }
}
ProductsList.propsType = {
	getproductList: PropTypes.func,
	productStatusChange: PropTypes.func,
	productDetele: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
	getproductList: (data) => dispatch(getproductList(data)),
	productStatusChange: (data) => dispatch(productStatusChange(data)),
	productDetele: (data) => dispatch(productDetele(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
