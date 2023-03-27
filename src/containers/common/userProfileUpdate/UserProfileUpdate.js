import React from "react";
import { Form } from "react-bootstrap";
import Header from "../../../components/header/Header";
import THButton from "../../../components/THButton/THButton";
import THImage from "../../../components/THImage/THImage";
import THInput from "../../../components/THInput/THInput";
import THLink from "../../../components/THLink/THLink";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { userProfileUpdate, getUserDetails } from "../../../actions";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import THGoogleAddress from "../../../components/THGoogleAddress/THGoogleAddress";

class UserProfileUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_title:'',
            profile: {
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                com_address: "",
                company: "",
                image: "",
                latitude : "",
                longitude : ""
            },
            profileError: {
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                address: "",
                company: "",
            },
        };
    }

    componentDidMount() {
        if (this.props.match.params.id !== undefined) {
            this.setState({
                is_title:this.props.match.params.name.charAt(0).toUpperCase() + this.props.match.params.name.slice(1).replace('-',' ')
                +" Edit",
            });
            this.props.getUserDetails(this.props.match.params.id).then((resp) => {
                if (resp && resp.ResponseCode === 1) {
                    this.setState({
                        isLoading: false,
                        profile: resp.data,
                    });
                }
            });
        }
    }

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

    handleCallback = (event) => {
        const { value, name } = event.target;
            this.setState({
                profile: {
                    ...this.state.profile,
                    [name]: value,
                },
            },() => {
                this.validateForm();
            }
        );
    };

    validateForm = () => {
        const { profile, profileError } = this.state;
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
   	 	const { profile } = this.state;
		await this.validateForm();
		if (this.state.isValidForm) {
            let profileData={
                id:profile.uuid,
                first_name:profile.first_name,
                last_name:profile.last_name,
                phone:(profile.phone)? profile.phone: "",
                com_address:profile.com_address,
                image:profile.image,
                company:profile.company,
                country:profile.country,
                latitude:(profile.latitude)? profile.latitude.toString(): "",
                longitude:(profile.longitude)? profile.longitude.toString(): ""
            }
			this.props.userProfileUpdate(profileData).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
                    toast.success("User update successfully");
                    this.props.history.push("/"+this.props.match.params.name);
				} else {
				    toast.error("User not update successfully");
				}
			});
    	}
  	};

    handleCallbackGoogle = (val) => {
        if(val!==null){
            this.setState({
                profile: {
                    ...this.state.profile,
                    com_address: val.label,
                },
            })
            geocodeByAddress(val.label)
                .then((results) => getLatLng(results[0]))
                .then(({ lat, lng }) =>{
                    this.setState({
                        profile: {
                            ...this.state.profile,
                            latitude: lat,
                            longitude: lng,
                        },
                    });
                }
            );
        }
    };
    render() {
        const { profile, profileError } = this.state;
        return (
            <main className="page-content edit-shopping-info-page">
                <Header title={this.state.is_title} />
                <Form onSubmit={this.profileUpdate}>
                    <div className="row gx-5">
                        <div className="col profile-col">
                            <div className="profile-img-wrapp">
                                <label for="uploadProfile">
                                <THImage src={profile.profile_img} class="profile-img" />
                                <input
                                    id="uploadProfile"
                                    type="file"
                                    name="myImage"
                                    onChange={this.onImageChange}
                                />
                                <THLink
                                    type="profileChange"
                                    to="#"
                                    class="profile-img-edit"
                                    labelName={
                                    <THImage src="/assets/images/icons/pencil.svg" />
                                    }
                                ></THLink>
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-wrapp">
                                <h4>Personal Info</h4>
                                <div className="row gx-3">
                                    <div className="col-md-6">
                                        <THInput
                                        labelName="First Name"
                                        type="text"
                                        placeholder="First Name"
                                        controlId="first_name"
                                        name="first_name"
                                        id="first_name"
                                        class=""
                                        inputChangeHandler={this.handleCallback}
                                        datavalue={profile.first_name}
                                        errorMessage={profileError.first_name}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <THInput
                                        labelName="Last Name"
                                        type="text"
                                        placeholder="Last Name"
                                        controlId="last_name"
                                        name="last_name"
                                        id="last_name"
                                        class=""
                                        inputChangeHandler={this.handleCallback}
                                        datavalue={profile.last_name}
                                        errorMessage={profileError.last_name}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <THInput
                                        labelName="Email Address"
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="xyz@mail.com"
                                        controlId="email"
                                        class=""
                                        readonly={true}
                                        inputChangeHandler={this.handleCallback}
                                        datavalue={profile.email}
                                        errorMessage={profileError.email}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <THInput
                                        labelName="Mobile Number"
                                        type="text"
                                        placeholder="0123465798"
                                        controlId="phone"
                                        name="phone"
                                        id="phone"
                                        class="mb-md-0"
                                        inputChangeHandler={this.handleCallback}
                                        datavalue={profile.phone}
                                        errorMessage={profileError.phone}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <THInput
                                        labelName="Company Name"
                                        type="text"
                                        placeholder="Company Name"
                                        controlId="companyName"
                                        name="company"
                                        id="company"
                                        class="mb-md-0"
                                        inputChangeHandler={this.handleCallback}
                                        datavalue={profile.company}
                                        errorMessage={profileError.company}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <THGoogleAddress
                                            controlId="CompanyAddress"
                                            name="com_address"
                                            class=""
                                            classGroup="mb-3 pb-1"
                                            placeholder="Company Address"
                                            isLable={false}
                                            icon={<i className="ri-focus-3-line"></i>}
                                            handleCallbackGoogle={this.handleCallbackGoogle}
                                            dataValue={profile.com_address}
                                            errorMessage={profileError.com_address}
                                        />
                                    </div>
                                </div>
                                <THButton
                                    variant="none"
                                    className="primary-btn"
                                    type="submit"
                                    name="Save"
                                />
                                <THLink
                                    to={"/"+this.props.match.params.name}
                                    class="btn secondary-btn"
                                    labelName="Cancel"
                                />
                            </div>
                        </div>
                    </div>
                </Form>
            </main>
        );
    }
}

UserProfileUpdate.propsType = {
  userProfileUpdate: PropTypes.func,
  getUserDetails: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
  userProfileUpdate: (data) => dispatch(userProfileUpdate(data)),
  getUserDetails: (data) => dispatch(getUserDetails(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileUpdate);
