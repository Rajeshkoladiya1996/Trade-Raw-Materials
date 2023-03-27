import React from "react";
import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

class ProtectedRoute extends React.Component {
  render() {
    const Component = this.props.component;
    const isAuthenticated = localStorage.getItem("token");
    const path = this.props.location.pathname;
    
    return isAuthenticated ? (
      path === "/login" ||
      path === "/forgot-password" ? (
        <Redirect to={{ pathname: "/" }} />
        ) : (
          <Route path={this.props.path} component={Component} key={this.props.key} />
      )
    ) : (
      <>
      {this.props.isAuth === false ? (
          <Route path={this.props.path} component={Component} key={this.props.key} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )}       
      </>
      
    );
  }
}

export default ProtectedRoute;
