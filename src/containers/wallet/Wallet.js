import React from "react";
import { Line, Bar } from "react-chartjs-2";
import Header from "../../components/header/Header";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import {getWalletDetail} from "../../actions";
import "./Wallet.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment  from "moment";
const totalAmountDataOptions = {
	responsive: true,
	maintainAspectRatio: false,
	elements: {
		line: {
			lineTension: 0,
		},
	},

	plugins: {
		legend: {
			display: false,
		},
	},

	scales: {
		y: {
			grid: {
				display: true,
			},
			title: {
				display: true,
			},
			ticks: {
				display: false,
			},
		},
		x: {
			grid: {
				display: false,
			},
			title: {
				display: false,
			},
			ticks: {
				font: {
					size: 20,
					weight: 500,
					family: "Gilroy",
				},
				color: "#7A8F99",
			},
		},
	},
};
class Wallet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			amount:"",
			totalExpense:"",
			totalIncome:"",
			transactions:"",
			graph: "",
			incomeGraph: "",
			expenseGraph:"",
			isValidForm:false
		};
	}
	componentDidMount(){
		this.props.getWalletDetail().then((response)=>{
		  if(response && response.ResponseCode){
			this.setState({
			  amount:response.data.amount,
			  totalExpense:response.data.total_expense,
			  totalIncome:response.data.total_income,
			  transactions:response.data.transactions,
			  graph: response.data.graph,
			  incomeGraph: response.data.incomeGraph,
			  expenseGraph: response.data.expenseGraph,
			}); 
		  }
		});
	  }
	render() {
		const totalAmountData = (canvas) => {
			const ctx = canvas.getContext("2d");
			const gradient = ctx.createLinearGradient(0, 0, 0, 200);

			gradient.addColorStop(0, "rgba(230, 237, 255, 1)");
			gradient.addColorStop(1, "rgba(230, 237, 255, 0)");

			return {
				labels: this.state.graph?.month,
				datasets: [
					{
						pointBackgroundColor: "#527BCC",
						pointRadius: 8,
						pointHoverRadius: 8,
						pointBorderColor: "white",
						pointBorderWidth: 3,
						borderColor: "#527BCC",
						lineTension: 0.6,
						data: this.state.graph?.data,
						fill: true,
						backgroundColor: gradient,
					},
				],
			};
		};
		const incomeOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			barThickness: 34,
			cornerRadius: 10,

			scales: {
				y: {
					display: false,
					title: {
						display: false,
					},
				},
				x: {
					grid: {
						display: false,
					},
					ticks: {
						font: {
							size: 20,
							weight: 500,
							family: "Gilroy",
						},
						color: "#7A8F99",
					},
				},
			},
		};
		const incomeData = {
			labels: this.state.incomeGraph?.days,
			datasets: [
				{
					roundedBar: {
						categoryPercentage: 0.5,
						barPercentage: 0.5,
					},
					label: "#",
					data: this.state.incomeGraph?.data,
					backgroundColor: "#6EBF7C",
					borderRadius: 20,
					barThickness: "flex",
					barPercentage: 0.8,
				},
			],
		};

		const expenseData = {
			labels: this.state.expenseGraph?.days,
			datasets: [
				{
					roundedBar: {
						categoryPercentage: 0.5,
						barPercentage: 0.5,
					},
					label: "# of Votes",
					data: this.state.expenseGraph?.data,
					backgroundColor: "#EE6C4C",
					borderRadius: 20,
					barThickness: "flex",
					barPercentage: 0.8,
				},
			],
		};

		const columns = [
			{
			  dataField: "type",
			  text: "",
			  sort: true,
			  formatter: (cell, row, rowIndex, formatExtraData) => {
				return (
				  row.type=="transfer"?"Transfer":"Withdraw"
			  )}
			},
			{
			  dataField: "created_at",
			  text: "",
			  formatter: (cell, row, rowIndex, formatExtraData) => {
				return (
				  moment(row?.created_at).format('DD, MMM YYYY')
			  )}
			
			},
			{
			  dataField: "transaction_number",
			  text: "",
			},
			{
			  dataField: "amount",
			  text: "",
			  formatter: (cell, row, rowIndex, formatExtraData) => {
				return (
				  row.type=="transfer"?
				  <h4 className="txn-result  added">+ ${row.amount}</h4>
				  :<h4 className="txn-result  removed">- ${row.amount}</h4>
			  )}
			},
		  ];

		

		return (
			<main className="page-content wallet-page">
				<Header title="Wallet" />
				<div className="Wallet-grid">
					<section className="total-wallet">
						<div className="title-bar">
							<div className="">
								<h2>${this.state.amount}</h2>
								<h5 className="m-0">Total Amount</h5>
							</div>
							{/* <Link to="#" className="btn primary-btn">
								WITHDRAW
							</Link> */}
						</div>
						<div className="chart-container">
							<Line
								id="lineChart"
								height="160px"
								data={totalAmountData}
								options={totalAmountDataOptions}
							/>
						</div>
					</section>
					<section>
						<div className="row">
							<div className="col-md-6">
								<div className="income">
									<div className="title-bar">
										<div className="">
											<h2>${this.state.totalIncome}</h2>
											<h5 className="m-0 gray">Income</h5>
										</div>
									</div>
									<div className="chart-container">
										<Bar
											height="160px"
											data={incomeData}
											options={incomeOptions}
										/>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="expense">
									<div className="title-bar">
										<div className="">
											<h2>${this.state.totalExpense}</h2>
											<h5 className="m-0 gray">Expense</h5>
										</div>
									</div>
									<div className="chart-container">
										<Bar
											height="160px"
											data={expenseData}
											options={incomeOptions}
										/>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div className="last-transactions">
						<div className="title-bar">
							<h2>Last Transaction</h2>
							<Link to="/wallet" className="action-link">
								View All
							</Link>
						</div>

						<ToolkitProvider
							keyField="Item"
							data={this.state.transactions}
							columns={columns}>
							{(props) => (
								<div>
									<div className="table-responsive-lg recent-transactions">
										<BootstrapTable
											className="themis-table"
											{...props.baseProps}
											bordered={false}
										/>
									</div>
								</div>
							)}
						</ToolkitProvider>
					</div>
				</div>
			</main>
		);
	}
}

Wallet.propsType = {
  getWalletDetail: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
  getWalletDetail: (data) => dispatch(getWalletDetail(data)),
});


const mapStateToProps = (state) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);

