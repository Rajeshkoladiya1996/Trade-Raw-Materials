import React from "react";
import Header from "../../../components/header/Header";
import THDatatable from "../../../components/THdatatable/THDatatable";
import { Link } from "react-router-dom";
import { getTranspoterTariffList,tariffDelete,tariffStatusChange } from "../../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import cx from "classnames";
import THProductStatusModal from "../../../components/THmodal/THProductStatusModal";
import THDeleteModal from "../../../components/THmodal/THDeleteProductModal";

class TariffList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			statusModalShow:false,
			userListModalShow: false,
			deleteModalShow: false,
			isLoading: true,
			userId: "",
			tariffId: "",
			userIndex: "index",
			transportTariffList:[]
		};
	}
    getTranspoterTariffList(){
		
		if(this.props.match.params.id!==undefined){
			let id=this.props.match.params.id	
			this.props.getTranspoterTariffList(id).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					this.setState({
						isLoading: false,
						transportTariffList: resp.data,
					});
				}
			});
		}
	}
	componentDidMount() {
		this.getTranspoterTariffList();
	}
    hadleButtonClick = () => {
        
		this.props.history.push(`${'/transporter/'+this.props.match.params.id+'/tariff-add'}`);
	};
	setDeleteModalShow = (e, id) => {
		e.preventDefault();
		this.setState({
			tariffId:id,
			deleteModalShow:!this.state.deleteModalShow
		});
	};
	setStatusModalShow = (e, id) => {
		e.preventDefault();
		this.setState({
		  tariffId: id,
		 
		  statusModalShow: !this.state.statusModalShow,
		});
	  };
	deleteProduct = (status) => {
		const {tariffId} = this.state;
		if (status === 1) {
			this.props.tariffDelete(tariffId).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					this.getTranspoterTariffList();
					toast.success("Tariff deleted successfully.");
				}
			});
		}
		this.setState({
			tariffId: "",
			deleteModalShow: !this.state.deleteModalShow,
		});
	};
	changeStatus = (status) => {
		const {tariffId} = this.state;
		if (status === 1) {
		  this.props.tariffStatusChange(tariffId).then(async (resp) => {
			if (resp && resp.ResponseCode === 1) {
			  toast.success("Tariff status change successfully.");
			  this.getTranspoterTariffList();
			}
		  });
		}
		this.setState({
			tariffId: "",
			statusModalShow: !this.state.statusModalShow,
		});
	  };
    render(){
        const columns = [
			{
				dataField: "rate",
				text: "Rate",
				sort: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
						  {row?.rate}
						</h4>
			
					  );
						
				},
			},
			{
				dataField: "package",
				text: "Packaging",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<h4>
						  {row?.package}
						</h4>
			
					  );
						
				},
			},
			{
				dataField: "address",
				text: "Location",
			},
			{
				dataField: "Status",
				text: "Status",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<Link
							to="#"
							className={cx("action-link", {"status-green": row.status, "text-danger": !row.status})}
							onClick={(e) => this.setStatusModalShow(e, row.uuid, rowIndex, row.status)}
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
							<Link to={"/transporter/"+ this.props.match.params.id +"/" + row.uuid + "/tariff-edit"} className="action-link me-2">
								Edit
							</Link>
							<Link to="#" onClick={(e) => this.setDeleteModalShow(e, row.uuid)} className="action-link text-danger">
								Delete
							</Link>
						</div>
					);
				}
			},
		];

		const paginationOptions = {
			withFirstAndLast: false,
			hidePageListOnlyOnePage: true,
			showTotal: false,
			hideSizePerPage: true,
			sizePerPage: 10,
			alwaysShowAllBtns: true,
			prePageText: <i className="ri-arrow-left-s-line"></i>,
			nextPageText: <i className="ri-arrow-right-s-line"></i>,
		};
        const {transportTariffList ,status} = this.state;
		const statusText = `Are you sure, you want to  ${
			status || status === true ? "De-active" : "Active"
		} account ?`;

        return(
            <main className="page-content admin-order-details-page">
                <Header title="Transporter Tariff Management" />
                
                <div className="main-content">
                    <section className="table-section">
                        <THDatatable
                            paginationOptions={paginationOptions}
                            columns={columns}
                            dataList={transportTariffList}
                            name="Tariff"
                            isButtonVisible={true}
                            btnLabelText="Add Tariff"
                            hadleButtonClick={this.hadleButtonClick}
                            placeholder="Search Tariff"
                        />
                    </section>
                </div>
                <THProductStatusModal
                    statustext={statusText}
                    show={this.state.statusModalShow}
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



TariffList.propsType = {
	getTranspoterTariffList: PropTypes.func,
	tariffDelete: PropTypes.func,
	tariffStatusChange: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	getTranspoterTariffList: (data) => dispatch(getTranspoterTariffList(data)),
	tariffDelete: (data) => dispatch(tariffDelete(data)),
	tariffStatusChange: (data) => dispatch(tariffStatusChange(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TariffList);