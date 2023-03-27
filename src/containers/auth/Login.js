import React from "react";
import { Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { doLogin } from "../../actions";
import THInput from "../../components/THInput/THInput";
import THButton from "../../components/THButton/THButton";
import "./auth.css";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "password",
      loginUser: {
        email: "",
        password: "",
      },
      emailErrMsg: "",
      passwordErrMsg: "",
      isError: false,
      errors: {
        email: "",
        password: "",
      },
    };
  }

  handleClick = () =>
    this.setState(({ type }) => ({
      type: type === "text" ? "password" : "text",
    }));
  onLoginUser = (e) => {
    e.preventDefault();
    const { loginUser, emailErrMsg, passwordErrMsg, errors } = this.state;
    let isValidForm = true;
    if (loginUser.email === "" || emailErrMsg) {
      isValidForm = false;
      this.setState({
        isError: true,
        emailErrMsg: "Email is required",
      });
    }
    if (loginUser.password === "" || passwordErrMsg) {
      isValidForm = false;
      this.setState({
        isError: true,
        passwordErrMsg: "Password is required",
      });
    }

    if (loginUser.email === "" || loginUser.password === "") {
      isValidForm = false;
      this.setState({
        errors: {
          ...errors,
          email: loginUser.email === "" ? "Email is Required" : "",
          password: loginUser.password === "" ? "Password is Required" : "",
        },
      });
    }
    if (errors.email || errors.password) {
      isValidForm = false;
    }
    if (isValidForm) {
      this.props.doLogin(loginUser).then((resp) => {
        if (resp && resp.data && resp.data.ResponseCode === 1) {
          this.setState({
            errors: {
              ...errors,
              email: "",
            },
            loginUser: {
              ...loginUser,
              email: "",
              password: "",
            },
          });
          toast.success("Login successfully.");
          setTimeout(() => {
            this.props.history.push("/");
          }, 500);
        } else {
          // console.log({resp});
          this.setState({
            errors: {
              ...errors,
              email: resp.response.data.message,
            },
            loginUser: {
              ...loginUser,
              password: "",
            },
          });
        }
      });
    }
  };

  inputChangeHandler = (event) => {
    let { value, name } = event.target;
    const { errors } = this.state;
    value = value ? value.trimStart() : "";
    switch (name) {
      case "email":
        errors.email = validEmailRegex.test(value)
          ? ""
          : "Invalid email address.";
        break;
      case "password":
        errors.password =
          value.length < 8
            ? "Password must be at least 8 characters long!"
            : "";
        break;
      default:
        break;
    }
    this.setState({
      loginUser: { ...this.state.loginUser, [name]: value },
      errors,
    });
  };
  render() {
    const { loginUser, errors } = this.state;
    return (
      <div className="auth-wrapp">
        <Image
          className="bg-auth bg-top-left"
          src="/assets/images/backgrounds/auth-top-left.svg"
        ></Image>
        <Image
          className="bg-auth bg-top-right"
          src="/assets/images/backgrounds/auth-top-right.svg"
        ></Image>
        <Image
          className="bg-auth bg-bottom-left"
          src="/assets/images/backgrounds/auth-bottom-left.svg"
        ></Image>
        <Image
          className="bg-auth bg-bottom-right"
          src="/assets/images/backgrounds/auth-bottom-right.svg"
        ></Image>
        <div className="auth-form-warpp text-center">
          <h2>Log In to Themis Admin</h2>
          <p>
            <span>Please enter your email and password to continue</span>
          </p>
          <Form onSubmit={this.onLoginUser}>
            <THInput
              type="email"
              id="email"
              placeholder="Enter your email"
              name="email"
              inputChangeHandler={this.inputChangeHandler}
              errors_msg={errors.email}
              datavalue={loginUser.email}
            />
            <THInput
              type={this.state.type}
              id="password"
              placeholder="Enter your password"
              name="password"
              inputChangeHandler={this.inputChangeHandler}
              errors_msg={errors.password}
              datavalue={loginUser.password}
              handleClick={this.handleClick}
              className1="position-relative"
              className2="mb-0"
            />
            <p className="forgot-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <THButton
              type="submit"
              variant="none"
              className="primary-btn btn"
              name="Log in"
            />
          </Form>
        </div>
      </div>
    );
  }
}
Login.propsType = {
  doLogin: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
  doLogin: (loginUser) => dispatch(doLogin(loginUser)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
