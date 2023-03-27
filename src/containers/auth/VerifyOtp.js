import React from "react";
import { Form, Image } from "react-bootstrap";
import THButton from "../../components/THButton/THButton";
import THInput from "../../components/THInput/THInput";
import THLink from "../../components/THLink/THLink";
import "./auth.css";
import { verifyOTP } from "../../actions";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { connect } from "react-redux";


class VerifyOtp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			dataValue: "",
			verifyData: {
				user_id: this.props.match.params.id,
				otp: "",
				newPassword: "",
				confirmPassword: ""
			},
			isValidForm: false,
			errors: {
				otp: "",
				newPassword: "",
				confirmPassword: ""
			},
		};
	}
	handleCallback = (event) => {
		const { value, name } = event.target;

		this.setState(
			{
				verifyData: {
					...this.state.verifyData,
					[name]: value,
				},
			},
			() => {
				this.validateForm();
			}
		);
	};

	validateForm = () => {
		const { verifyData, errors } = this.state;
		if (
			verifyData.otp === "" ||
			verifyData.newPassword === "" ||
			verifyData.confirmPassword === "" ||
			verifyData.newPassword !== verifyData.confirmPassword
		) {

			this.setState({
				isValidForm: false,
				errors: {
					...errors,
					otp:
						verifyData.otp === "" ? "OTP field is required." : "",
					newPassword: verifyData.newPassword === "" ? "Password field is Required" : "",
					confirmPassword:
						verifyData.confirmPassword === ""
							? "Confirm password field is Required"
							: verifyData.newPassword !== verifyData.confirmPassword
								? "Password and confirm password must same."
								: "",
				},
			});
		} else {
			this.setState({
				isValidForm: true,
				errors: {
					...errors,
					otp: "",
					newPassword: "",
					confirmPassword: "",
				},
			});
		}
	};

	doVerify = async (e) => {
		e.preventDefault();
		await this.validateForm;
		const { isValidForm, verifyData } = this.state;
		if (isValidForm) {
			let data = {
				user_id: verifyData.user_id,
				new_password: verifyData.newPassword,
				confirm_password: verifyData.confirmPassword,
				otp: verifyData.otp
			};

			this.props.verifyOTP(data).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("Password Reset Sucessfully");
					this.props.history.push(`/login`);
				}
				else {
                    
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
                          otp: msg,
                        },
                    });
				}
			});
		}
	};
	render() {
		const { errors, verifyData } = this.state;
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
					<h2>Verify OTP</h2>
					<p>
						<span>
							Please enter OTP sent on your email
						</span>
					</p>
					<Form onSubmit={this.doVerify}>
						<THInput
							id="otp"
							name="otp"
							controlId="ForgotEmail"
							type="text"
							placeholder="Enter OTP"
							class="mb-2"
							isLable={false}
							inputChangeHandler={this.handleCallback}
							datavalue={verifyData.otp}
							errors_msg={errors.otp}
						/>
						<THInput
							controlId="Password"
							type="password"
							name="newPassword"
							placeholder="New Password"
							class="mb-md-0"
							isLable={false}
							inputChangeHandler={this.handleCallback}
							datavalue={verifyData.newPassword}
							errors_msg={errors.newPassword}
						/>
						<THInput
							controlId="ConfirmPassword"
							type="password"
							name="confirmPassword"
							placeholder="Confirm Password"
							class="mb-md-0"
							isLable={false}
							inputChangeHandler={this.handleCallback}
							datavalue={verifyData.confirmPassword}
							errors_msg={errors.confirmPassword}
						/>
						<THButton
							variant="none"
							className="primary-btn"
							type="submit"
							name="Verify OTP"
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

VerifyOtp.propsType = {
	verifyOTP: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	verifyOTP: (data) => dispatch(verifyOTP(data)),
});
const mapStateToProps = (status) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(VerifyOtp);

