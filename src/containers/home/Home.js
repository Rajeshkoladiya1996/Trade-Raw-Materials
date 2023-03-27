import React from "react";
import Header from "../../components/header/Header";
import { Bar, Line } from "react-chartjs-2";
import "./Home.css";
import { getDashboardDetail} from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			analysisTotal:"",
			tariffTotal: "",
			totalSell: "",
			notification: "",
		};
	}
	componentDidMount() {
		const id = this.props.match.params.id;
		this.props.getDashboardDetail().then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					isLoading: false,
					analysisTotal: resp.data.analysisTotal,
					tariffTotal: resp.data.tariffTotal,
					totalSell: resp.data.totalSell,
					notification: resp.data.notification,
				});
			}
		});
		
	}
		  
	render() {
		const balanceOptions = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: true,
					position: "top",
					align: "end",
					labels: {
						boxWidth: 10,
						boxHeight: 10,
					},
				},
			},
			barThickness: 34,
			cornerRadius: 10,

			scales: {
				y: {
					grid: {
						display: false,
					},
					title: {
						display: false,
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
		const balanceData = {
			labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
			datasets: [
				{
					label: "Income",
					data: [7, 5, 8, 6, 7, 3],
					backgroundColor: "#6EBF7C",
					borderRadius: 20,
					barThickness: "flex",
					barPercentage: 0.7,
				},
				{
					label: "Expense",
					data: [9, 3, 5, 3, 10, 2],
					backgroundColor: "#EE6C4C",
					borderRadius: 20,
					barThickness: "flex",
					barPercentage: 0.7,
				},
			],
		};

		const profitStatOptions = {
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				y: {
					display: false,
					title: {
						display: false,
					},
				},
				x: {
					display: false,
					title: {
						display: false,
					},
				},
			},
		};
		const lossData = (canvas) => {
			const ctx = canvas.getContext("2d");
			const gradient = ctx.createLinearGradient(0, 0, 0, 100);

			gradient.addColorStop(0, "rgba(238, 108, 76, 0.16)");
			gradient.addColorStop(1, "rgba(238, 108, 76, 0)");

			return {
				legend: {
					display: false,
				},
				labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
				tooltips: {
					callbacks: {
						label: function (tooltipItem) {
							return tooltipItem.yLabel;
						},
					},
				},
				datasets: [
					{
						pointBackgroundColor: "#527BCC",
						pointRadius: 0,
						pointHoverRadius: 0,
						pointBorderColor: "white",
						pointBorderWidth: 3,
						borderColor: "#EE6C4C",
						lineTension: 0.6,
						data: [0, 15, 25, 20, 30, 35],
						fill: true,
						backgroundColor: gradient,
					},
				],
			};
		};
		const statData = (canvas) => {
			const ctx = canvas.getContext("2d");
			const gradient = ctx.createLinearGradient(0, 0, 0, 100);

			gradient.addColorStop(0, "rgba(110, 191, 124, 0.21)");
			gradient.addColorStop(1, "rgba(110, 191, 124, 0)");

			return {
				legend: {
					display: false,
				},
				labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
				tooltips: {
					callbacks: {
						label: function (tooltipItem) {
							return tooltipItem.yLabel;
						},
					},
				},
				datasets: [
					{
						pointBackgroundColor: "#527BCC",
						pointRadius: 0,
						pointHoverRadius: 0,
						pointBorderColor: "white",
						pointBorderWidth: 3,
						borderColor: "#6EBF7C",
						lineTension: 0.6,
						data: [0, 15, 25, 20, 30, 35],
						fill: true,
						backgroundColor: gradient,
					},
				],
			};
		};

		return (
			<main className="page-content">
				<Header title="Home" />

				<div className="main-content">
					<div className="admin-home-grid">
						<section className="admin-stat-wrap">
							<div className="admin-stat">
								<h5>Sales</h5>
								<h3>${this.state.totalSell}</h3>
								<div className="result profit">
									<div className="icon-wrap">
										<i className="ri-arrow-up-line"></i>
									</div>
									<h4 className="mb-0">140.13%</h4>
									<div className="time gray">(From Last Year)</div>
								</div>
								<div className="chart-container">
									<Line
										height="100%"
										width="100%"
										data={statData}
										options={profitStatOptions}></Line>
								</div>
							</div>
						
							<div className="admin-stat">
								<h5>Shipments</h5>
								<h3>${this.state.tariffTotal}</h3>
								<div className="result loss">
									<div className="icon-wrap">
										<i className="ri-arrow-down-line"></i>
									</div>
									<h4 className="mb-0">140.13%</h4>
									<div className="time gray">(From Last Year)</div>
								</div>
								<div className="chart-container">
									<Line
										height="100%"
										width="100%"
										data={lossData}
										options={profitStatOptions}></Line>
								</div>
							</div>
							<div className="admin-stat">
								<h5>Analysis</h5>
								<h3>${this.state.analysisTotal}</h3>
								<div className="result loss">
									<div className="icon-wrap">
										<i className="ri-arrow-down-line"></i>
									</div>
									<h4 className="mb-0">140.13%</h4>
									<div className="time gray">(From Last Year)</div>
								</div>
								<div className="chart-container">
									<Line
										height="100%"
										width="100%"
										data={lossData}
										options={profitStatOptions}></Line>
								</div>
							</div>
							
						</section>
						<section className="admin-balance">
							<div className="title-bar">
								<h2 className="mb-0">Balance</h2>
								<button className="btn table-option-btn ms-auto">
									<i className="ri-download-fill align-bottom"></i> Export
								</button>
							</div>

							<div className="chart-container">
								<Bar data={balanceData} options={balanceOptions} />
							</div>
						</section>

						<section className="admin-activity">
							<div className="title-bar">
								<h2 className="mb-0">Recent Activity</h2>
							</div>

							<ul className="activities-list">
							{this.state.notification ? (
								this.state.notification.map((item, key) => (
								<li>
									<h5>{moment(item?.created_at).format('H:m a')}</h5>
									<h4>{item.title}</h4>
									<p className="gray">
										{item.message}
									</p>
								</li>
							))
							) : ""}	
							</ul>
						</section>
					</div>
				</div>
			</main>
		);
	}
}

Home.protoType = {
	getDashboardDetail: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
	getDashboardDetail: (data) => dispatch(getDashboardDetail(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
