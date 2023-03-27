import React from "react";
import Header from "../../components/header/Header";
import THDatatable from "../../components/THdatatable/THDatatable";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { getWalletRequest,confirmWalletRequest } from "../../actions";
import cx from "classnames";
import { Link } from "react-router-dom";
import THOrderConfirmModal from "../../components/THmodal/THOrderConfirmModal";
import moment from "moment";
class WalletRequestList extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
			userListModalShow: false,
			isLoading: true,
			requestList: [],
            orderConfirmModalShow: false,
            requestId:"",
            imagePath:""
		};
    }
    changeStatus = async (status) => {
		if(status == 1 || status==2){
			const { list, requestId } = this.state;
			let reqdata = { status: status, id: requestId }
            
			this.props.confirmWalletRequest(reqdata).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success(resp.message);
					this.getRequestList(list);
				}
				else {
					toast.error(resp.message);
				}
				this.setState({
					orderConfirmModalShow: !this.state.orderConfirmModalShow,
				});
			})
		}
        else{
            this.setState({
				orderConfirmModalShow: !this.state.orderConfirmModalShow,
			});
        }
	}
    setOrderConfirmModalShow = (e, id) => {
		e.preventDefault();
		this.setState({
			requestId: id,
			orderConfirmModalShow: !this.state.orderConfirmModalShow,
		});
	};
    getRequestList(){
		this.props.getWalletRequest("").then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					isLoading: false,
					requestList: resp.data?.withdrawnRequest,
                    imagePath:resp.data.imagePath
				});
			}
		});
	}
	componentDidMount() {
		this.getRequestList();
	}
    render() {
        const paginationOptions = {
			page: 1,
			withFirstAndLast: false,
			hidePageListOnlyOnePage: true,
			showTotal: true,
			hideSizePerPage: true,
			sizePerPage: 10,
			alwaysShowAllBtns: true,
			prePageText: <i className="ri-arrow-left-s-line"></i>,
			nextPageText: <i className="ri-arrow-right-s-line"></i>,
		};
		let columns = [
			{
				dataField: "name",
				text: "Customer Name",
				sort: true,
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div className="open-orders-wrap">
							<div className="order-item table-order-item">
								<div className="order-img">
									<img
										className="img-cover"
                                        src={`${this.state.imagePath}${row?.user?.profile_img}`}
										alt="User"
									/>
								</div>
								<div className="order-info-wrap">
									<div className="order-details">
										<h4>
											{row?.user?.first_name} {row?.user?.last_name}
										</h4>
									</div>
								</div>
							</div>
						</div>
					);
				},
			},
			
			{
				dataField: "amount",
				text: "Amount",
			},
			{
				dataField: "currency",
				text: "Currency",
				
			},
			{
				dataField: "created_at",
				text: "Date",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<div>
							{moment(row?.created_at).format('DD, MMM YYYY')}
						</div>
					);
				},
			},
			{
				dataField: "id",
				text: "Status",
				formatter: (cell, row, rowIndex, formatExtraData) => {
					return (
						<Link
							to="#"
							className={cx("action-link", {
								"status-green": row.status==="1",
								"text-danger": row.status==="2" || row.status==="0",
							})}
                            onClick={(e) => row.status==="0"?this.setOrderConfirmModalShow(e, row.uuid):"#"}
							>
							{
                            row.status==="1" ? "Accepted" 
                            : row.status==="2"? "Canceled"
                            :"Pending"
                            }
						</Link>
					);
				},
			},
		];
        const { requestList, status } = this.state;
       
        return (
			<main className="page-content ">
				<Header title="Wallet Requests " />

				<div className="main-content">
					<THDatatable
						name="Name"
						isButtonVisible={false}
						paginationOptions={paginationOptions}
						columns={columns}
						dataList={requestList}
					/>
				</div>
                <THOrderConfirmModal
					show={this.state.orderConfirmModalShow}
                    title="Accept Wallet Request"
                    description="Do you want to accept this request?"
					onHide={(status) => this.changeStatus(status)}
					reject="2"
					confirm="1"
				/>
			</main>
		);
    }
}
WalletRequestList.propsType = {
	getWalletRequest: PropTypes.func,
    confirmWalletRequest: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	getWalletRequest: (data) => dispatch(getWalletRequest(data)),
    confirmWalletRequest: (data) => dispatch(confirmWalletRequest(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WalletRequestList);