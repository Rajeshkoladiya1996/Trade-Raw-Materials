import React from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import { changePassword } from "../../actions";
import THInput from "../../components/THInput/THInput";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			isValidForm:false,
			user: {
				oldPassword: "",
				newPassword: "",
				confirmPassword: ""
			},
			error: {
				oldPassword: "",
				newPassword: "",
				confirmPassword: ""
			}
		};
  }
	//   handleCallback
  	handleCallback = (e) => {

    	const { value, name } = e.target;

		this.setState({
			user: { ...this.state.user, [name]: value },
		},() => {
			this.checkPasswordValidation();
		});
  };
  checkPasswordValidation = () => {
		const { user, error } = this.state;
		if (user.oldPassword === "" || user.newPassword === "" || user.confirmPassword === "" || user.newPassword !== user.confirmPassword ) {

      		this.setState({
				isValidForm: false,
					error: {
					...error,
					oldPassword:
						user.oldPassword === ""
						? "Old Password field is required"
						: "",
					newPassword:
						user.newPassword === ""
						? "New Password field is required"
						: "",
					confirmPassword:
						user.confirmPassword === ""
						? "Confirm password field is Required"
						: user.newPassword !== user.confirmPassword
							? "Password and confirm password must same."
							: "",
				},
			});
		} else {
			this.setState({
				isValidForm: true,
				error: {
					...error,
					oldPassword: "",
					newPassword: "",
					confirmPassword: "",
				},
			});
		}
	};
  changePassword = async (e) => {
		e.preventDefault();
		await this.checkPasswordValidation();
		if (this.state.isValidForm) {
			const { user } = this.state;
			const userData = {
				current_password: user.oldPassword,
				new_password: user.newPassword,
				confirm_password: user.confirmPassword,
			};
			this.props.changePassword(userData).then((response) => {
				if (response && response.ResponseCode === 1) {
					toast.success("Password updated successfully");
					setTimeout(() => {
						this.props.history.push("/setting");
					}, 500);
				} else {
					toast.error("Something went wrong");
				}
			});
		}
	};
  	render() {
    	const { user, error } = this.state;
    	return (
      	<main className="page-content edit-shopping-info-page">
        	<Header title="Reset Password" />
        	<div className="form-wrapp">
          <Form onSubmit={this.changePassword}>
				<div className="row gx-3">
					<div className="col-md-12">

					<THInput
					controlId="EnterOldPassword"
					type="text"
					id="oldPassword"
					name="oldPassword"
					class=""
					type="password"
					label="Enter Old Password"
					placeholder="Enter Old Password"
					datavalue={user.oldPassword}
					inputChangeHandler={this.handleCallback}
					errors_msg={error.oldPassword}
					/>
				</div>
					<div className="col-md-12">
						<THInput
						controlId="EnterNewPassword"
						id="newPassword"
						name="newPassword"
						class=""
						type="password"
						label="Enter New Password"
						placeholder="Enter New Password"
						datavalue={user.newPassword}
						inputChangeHandler={this.handleCallback}
						errors_msg={error.newPassword}
						/>
					</div>
					<div className="col-12">
						<THInput
						controlId="EnterNewPassword"
						id="confirmPassword"
						name="confirmPassword"
						class=""
						type="password"
						label="Confirm New Password"
						placeholder="Confirm Password"
						datavalue={user.confirmPassword}
						inputChangeHandler={this.handleCallback}
						errors_msg={error.confirmPassword}
						/>
					</div>
            	</div>
				<Button variant="none" className="primary-btn" type="submit">
				Save
				</Button>
				<Link to="/setting" className="btn secondary-btn">
				Cancel
				</Link>
          	</Form>
        </div>
      	</main>
    );
  }
}
ResetPassword.propsType = {
	changePassword: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	changePassword: (data) => dispatch(changePassword(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

