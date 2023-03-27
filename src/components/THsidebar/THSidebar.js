import React,{useEffect} from "react";
import "./THSidebar.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLocation, Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router";
import routeList from "../../routes";


const THSidebar=(props)=> {
	const location = useLocation();
	const path=location.pathname;
	const pathName = path.split("/");
	const history = useHistory();

	const handleLogout = () => {
		// const history = useHistory();
		localStorage.removeItem("token");
		localStorage.removeItem("user_detail");
		history.push("/login");
	}

	// const path = location.pathname.split("/");
	return (
		<>
			{location.pathname === "/login" ||
			location.pathname === "/forgot-password" ||
			pathName[1] === "verify-otp" ||
			pathName[1] === "order-invoice" ||
			location.pathname === "/register" ? null : (
				<aside className="sidebar">
					<div className="sidebar-logo">
						<Link to="/home">
							<img
								src="/assets/images/themis-logo.png"
								alt="Themis"
								className="img-fluid"
							/>
						</Link>
					</div>
					<ul>
						{ 	routeList.map((item, i) => (item.isVisible===true) && (
								<OverlayTrigger
									key={i}
									placement="right"
									overlay={<Tooltip className="tooltip-right">{item.name}</Tooltip>}>
									<li>
										<NavLink exact to={item.path} className="nav-link">
											<i className={item.icon}></i>
										</NavLink>
									</li>
								</OverlayTrigger>
							))
						}						
					</ul>

					<OverlayTrigger
						key="right1"
						placement="right"
						overlay={<Tooltip className="tooltip-right">Logout</Tooltip>}>
						<Link className="logout-btn" to="#" onClick={handleLogout}>
							<i className="ri-logout-circle-r-line"></i>
						</Link>
					</OverlayTrigger>
				</aside>
			)}
		</>
	);
}

export default THSidebar;
