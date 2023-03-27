import React from "react";
import { Form, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";
import THButton from "../../components/THButton/THButton";
import THInput from "../../components/THInput/THInput";
import { getProfile, updateProfile, getAuthDetails } from "../../actions";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const emailRegx = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

class EditProfile extends React.Component {
  	constructor(props) {
    	super(props);
		this.state = {
			isLoading: true,
			profile: {
				first_name: "",
				last_name: "",
				email: "",
				phone: "",
				image: "",
			},
			profileError: {
				first_name: "",
				last_name: "",
				email: "",
				phone: "",
			},
		};
  	}
	componentDidMount() {
		this.props.getProfile("").then((resp) => {
			if (resp && resp.ResponseCode === 1) {
				this.setState({
					isLoading: false,
					profile: resp.data,
				});
			}
		});
	}

	onImageChange = async (event) => {
		if (event.target.files && event.target.files[0]) {
			let file = event.target.files[0];
			const base64Image = await this.getBase64Image(file);
			this.setState({
				profile: {
				...this.state.profile,
				image: base64Image,
				profile_img: base64Image,
				},
			});
		}
	};

  	inputChangeHandler = (event) => {
		const { value, name } = event.target;
		this.setState({
			profile: {
				...this.state.profile,
				[name]: value,
			},
      	},() => {
        	this.validateForm();
      	});
  	};
 	getBase64Image = (file) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(file);
			fileReader.onload = () => {
				return resolve(fileReader.result);
			};
			fileReader.onerror = () => {
				reject.error();
			};
		});
  	};

  	validateForm = () => {
		const { profile, profileError } = this.state;
		// console.log({ profile, profileError });
		if (profile.first_name === "" || profile.last_name === "") {
			this.setState({
				isValidForm: false,
				profileError: {
				...profileError,
				first_name:
					profile.first_name === "" ? "First name field is required." : "",
				last_name:
					profile.last_name === "" ? "Last name field is required." : "",
				},
			});
		} else {
			this.setState({
				isValidForm: true,
				profileError: {
				...profileError,
				first_name: "",
				last_name: "",
				},
			});
		}
	};

  	profileUpdate = async (e) => {
    	e.preventDefault();
    	const { profile, profileError } = this.state;
    	await this.validateForm();
		if (this.state.isValidForm) {
			this.props.updateProfile(profile).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
				toast.success("Profile update successfully");
				this.props.getAuthDetails();
				} else {
				toast.error("Profile not update successfully");
				}
			});
		}
  	};
  render() {
    const { profile, profileError } = this.state;
    return (
      <main className="page-content edit-shopping-info-page">
        <Header title="Edit Profile" />
        <Form onSubmit={this.profileUpdate}>
          <div className="row gx-5">
            <div className="col profile-col">
              <div className="profile-img-wrapp">
                <label for="uploadProfile">
                  <Image
                    src={profile.profile_img}
                    className="profile-img"
                  ></Image>
                  <input
                    id="uploadProfile"
                    type="file"
                    name="myImage"
                    onChange={this.onImageChange}
                  />
                  <Link to="#" className="profile-img-edit">
                    <Image src="/assets/images/icons/pencil.svg"></Image>
                  </Link>
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-wrapp">
                <h4>Personal Info</h4>
                <div className="row gx-3">
                  <div className="col-md-6">
                    <THInput
                      controlId="first_name"
                      label="First Name"
                      type="text"
                      name="first_name"
                      id="first_name"
                      placeholder="First Name"
                      className2="mb-md-0"
                      datavalue={profile.first_name}
                      errors_msg={profileError.first_name}
                      inputChangeHandler={this.inputChangeHandler}
                    />
                  </div>
                  <div className="col-md-6">
                    <THInput
                      controlId="last_name"
                      label="Last Name"
                      type="text"
                      name="last_name"
                      id="last_name"
                      datavalue={profile.last_name}
                      errors_msg={profileError.last_name}
                      placeholder="Last Name"
                      className2="mb-md-0"
                      inputChangeHandler={this.inputChangeHandler}
                    />
                  </div>
                  <div className="col-md-6">
                    <THInput
                      controlId="Email"
                      label="Email"
                      type="text"
                      name="email"
                      id="email"
                      datavalue={profile.email}
                      placeholder="example@mail.com"
                      className2="mb-md-0"
                      readonly={true}
                      inputChangeHandler={this.inputChangeHandler}
                    />
                  </div>
                  <div className="col-md-6">
                    <THInput
                      controlId="mobile"
                      label="Mobile No."
                      id="phone"
                      name="phone"
                      type="text"
                      datavalue={profile?.phone}
                      placeholder="012345678"
                      className2="mb-md-0"
                      inputChangeHandler={this.inputChangeHandler}
                    />
                  </div>
                </div>
                <THButton
                  variant="none"
                  className="primary-btn"
                  type="submit"
                  name="Save"
                />
                <Link to="/setting" className="btn secondary-btn">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </Form>
      </main>
    );
  }
}

EditProfile.propsType = {
  getProfile: PropTypes.func,
  updateProfile: PropTypes.func,
  getAuthDetails: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
  getProfile: (data) => dispatch(getProfile(data)),
  updateProfile: (data) => dispatch(updateProfile(data)),
  getAuthDetails: (data) => dispatch(getAuthDetails(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
