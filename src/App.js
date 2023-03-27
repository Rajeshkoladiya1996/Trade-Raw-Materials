import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import THSidebar from "./components/THsidebar/THSidebar";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "react-dropzone-uploader/dist/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import "./assets/stylesheets/App.css";
import "./assets/stylesheets/form.css";
import "./assets/stylesheets/DataTable.css";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet";
import routeList from "./routes";
import ProtectedRoute from "./helper/protectedRoute";
import THNotfound from "./components/THNotfound/THNotfound";

class App extends Component {
	render() {
		return (
			<Router>
				<Helmet title="Themis | Admin" />

				<ToastContainer
					position="top-right"
					autoClose={2000}
					hideProgressBar={false}
					closeOnClick={true}
					pauseOnHover={false}
					draggable={true}
					progress="undefined"
				/>
				<div className="page-container">
					<THSidebar />
					<Switch>
						{routeList.map((item, i) => (
							<ProtectedRoute
								exact
								path={item.path}
								key={item.id}
								isAuth={item.isAuth}
								component={item.component}
							/>
						))}
						<Route component={THNotfound} key="404"/>
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
