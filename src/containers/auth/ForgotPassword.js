import React from "react";
import { Form, Image } from "react-bootstrap";
import THButton from "../../components/THButton/THButton";
import THInput from "../../components/THInput/THInput";
import THLink from "../../components/THLink/THLink";
import "./auth.css";
import { forgotPassword } from "../../actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";

const emailRegx = RegExp(
	/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

class ForgotPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataValue: "",
			forgotData: {
				email: "",
			},
			isError: false,
			errors: {
				email: "",
			},
		};
	}
	handleCallback = (event) => {
		let { value, name } = event.target;
		const { errors, forgotData } = this.state;
		value = value ? value.trimStart() : "";

		switch (name) {
			case "email":
				errors.email = emailRegx.test(value) ? "" : "Invalid email address.";
				break;
			default:
				break;
		}
		this.setState({
			forgotData: { ...this.state.forgotData, [name]: value },
			errors,
		});
	};

	doForgot = (e) => {
		e.preventDefault();
		const { forgotData, errors } = this.state;
		let isValidForm = true;

		if (forgotData.email === "") {
			isValidForm = false;
			this.setState({
				errors: {
					...errors,
					email: forgotData.email === "" ? "Email is Required" : "",
				},
			});
		}
		if (errors.email) {
			isValidForm = false;
		}

		if (isValidForm) {
			this.props.forgotPassword({email:forgotData.email}).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("Email send successfully");
					this.props.history.push(`/verify-otp/${resp.data.uuid}`);
				}
				else{
					let msg='';
                    if(resp.ResponseText){
                        msg=resp.ResponseText;
                    }
                    else if(resp.message){
                        msg=resp.message;
                    }
                    this.setState({
                        errors: {
                          ...this.state.errors,
                          email: msg,
                        },
                    });
				}
			});
		}
	};
	render() {
		const { errors, forgotData } = this.state;
		return (
			<div className="auth-wrapp">
				<Image
					className="bg-auth bg-top-left"
					src="/assets/images/backgrounds/auth-top-left.svg"></Image>
				<Image
					className="bg-auth bg-top-right"
					src="/assets/images/backgrounds/auth-top-right.svg"></Image>
				<Image
					className="bg-auth bg-bottom-left"
					src="/assets/images/backgrounds/auth-bottom-left.svg"></Image>
				<Image
					className="bg-auth bg-bottom-right"
					src="/assets/images/backgrounds/auth-bottom-right.svg"></Image>
				<div className="auth-form-warpp text-center">
					<h2>Forgot Password </h2>
					<p>
						<span>
							Please enter your email, we will send you OTP
						</span>
					</p>
					<Form onSubmit={this.doForgot}>
						<THInput
							id="email"
							name="email"
							controlId="ForgotEmail"
							type="email"
							placeholder="Enter Address"
							class="mb-2"
							isLable={false}
							inputChangeHandler={this.handleCallback}
							datavalue={forgotData.email}
							errors_msg={errors.email}
						/>
						<THButton
							variant="none"
							className="primary-btn "
							type="submit"
							name="Send OTP"
						/>
					</Form>
					<p className="link-text mb-0">
						<THLink to="/login" class="action-link ms-2" labelName="Back To Sign In" />
					</p>
				</div>
			</div>
		);
	}
}

ForgotPassword.propsType = {
	forgotPassword: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	forgotPassword: (data) => dispatch(forgotPassword(data)),
});
const mapStateToProps = (status) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
