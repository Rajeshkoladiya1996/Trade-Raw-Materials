import React from "react";
import { Form } from "react-bootstrap";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { doStoreTariff,getTariffDetail,updateTariff } from "../../../actions";
import PropTypes from "prop-types";
import Header from "../../../components/header/Header";
import THGoogleAddress from "../../../components/THGoogleAddress/THGoogleAddress";
import THInput from "../../../components/THInput/THInput";
import THSelect from "../../../components/THSelect/THSelect";
import THButton from "../../../components/THButton/THButton";

const Packaging = [
  { value: "Bulk", label: "Bulk" },
  { value: "Big Bag", label: "Big Bag" },
  { value: "Bag 15Kg", label: "Bag 15Kg" },
  { value: "Bag 25Kg", label: "Bag 25Kg" },
];

class TariffAdd extends React.Component {
 	 constructor(props) {
		super(props);
		this.state = {
			isTitle: "Add",
			isValidForm: false,
            userId:'',
			tariff: {
				address: "",
				zipCode: "",
				city: "",
				country: "",
				latitude: "",
				longitude: "",
				rate: "",
				packageAndDelivery: "",
			},
			tariffError: {
				address: "",
				zipCode: "",
				city: "",
				country: "",
				latitude: "",
				longitude: "",
				rate: "",
				packageAndDelivery: "",
			},
		};
	}
	componentDidMount() {
		if (this.props.match.params.tariff_id !== undefined) {
			this.setState({
				isTitle: "Edit",
                userId:this.props.match.params.tariff_id
			});
			this.props.getTariffDetail(this.props.match.params.tariff_id).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					const filtered = Packaging.filter(
						(item) => item.value === resp.data.package
					);
					this.setState({
						isLoading: false,
						selectedPackage: filtered[0],
						tariff:{
							...this.state.tariff,
							rate:resp.data.rate,
							address:resp.data.address,
							zipCode:resp.data.zipcode,
							city:resp.data.city,
							country:resp.data.country,
							latitude: resp.data.latitude,
							longitude: resp.data.longitude,
							packageAndDelivery:resp.data.package,
							uuid:resp.data.uuid
						},
					});
				}
			});
		}
		else{
			this.setState({
                userId:this.props.match.params.id
			});
		}
	}
	handleCallbackGoogle = (val) => {
		if (val != null) {
			geocodeByAddress(val.label)
				.then((results) => {
					const ShouldBeComponent = {
						postal_code: ["postal_code"],
						city: ["locality"],
						country: ["country"],
					};
					results[0].address_components.forEach((component) => {
						for (let shouldBe in ShouldBeComponent) {
							if (
								ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1
							) {
								results[0].address_components[shouldBe] = component.long_name;
							}
						}
					});
					this.setState({
						tariff: {
							...this.state.tariff,
							address: results[0].formatted_address,
							zipCode:
								typeof results[0].address_components.postal_code !== undefined
									? results[0].address_components.postal_code
									: "",
							city:
								typeof results[0].address_components.city !== undefined
									? results[0].address_components.city
									: "",
							country:
								typeof results[0].address_components.country !== undefined
									? results[0].address_components.country
									: "",
						},
					},()=>{
						this.checkTarrifValidation();
					});
					return getLatLng(results[0]);
				})
				.then(({ lat, lng }) => {
					this.setState({
						tariff: {
							...this.state.tariff,
							latitude: lat,
							longitude: lng,
						},
					});
				});
		} else {
			this.setState({
				tariff: {
					...this.state.tariff,
					latitude: "",
					longitude: "",
					address: "",
					zipCode: "",
					city: "",
					country: "",
				},
			});
		}
	};

	handleCallback = (e) => {
		const { value, name } = e.target;
		this.setState(
			{
				tariff: { ...this.state.tariff, [name]: value },
			},
			() => {
				this.checkTarrifValidation();
			}
		);
	};

	handleCallbackSelect(e) {
		this.setState({
			selectedPackage: e,
			tariff: { ...this.state.tariff, packageAndDelivery: e.value },
		}, () => {
			this.checkTarrifValidation();
		});
	}

	checkTarrifValidation = () => {
		const { tariff, tariffError } = this.state;
	
		const numberRegx = /^[0-9\b]+$/;
		if (
			tariff.rate === "" ||
			tariff.packageAndDelivery === "" ||
		
			tariff.address === "" ||
			tariff.zipCode === "" ||
			tariff.city === "" ||
			tariff.country === ""
		) {
				this.setState({
					isValidForm: false,
					tariffError: {
					...tariffError,
					rate:
						tariff.rate === ""
						? "Rate is required"
						
						: "",
					packageAndDelivery:
						tariff.packageAndDelivery === ""
						? "Package and delivery field is required"
						: "",
					address:
						tariff.address === ""
						? "Shipping address field is required"
						: "",
					zipCode: tariff.zipCode === "" ? "ZipCode field is required" : "",
					city: tariff.city === "" ? "City field is required" : "",
					country: tariff.country === "" ? "Country field is required" : "",
					},
				});
		} else {
			this.setState({
				isValidForm: true,
				tariffError: {
				...tariffError,
				packageAndDelivery: "",
				address: "",
				zipCode: "",
				city: "",
				country: "",
				rate: "",
				},
			});
		}
	};

  storeTariff = async (e) => {
   
    e.preventDefault();
    await this.checkTarrifValidation();
	const { tariff,  isValidForm,userId } = this.state;
    if (isValidForm) {
		const tariffData = {
			rate: tariff.rate,
			package: tariff.packageAndDelivery,
			address: tariff.address,
			city: tariff.city,
			country: tariff.country,
			zipcode: tariff.zipCode,
			latitude: tariff.latitude.toString(),
			longitude: tariff.longitude.toString(),
			
		};
		
	  	if (this.state.isTitle === "Add") {
			tariffData.id=userId;
			this.props.doStoreTariff(tariffData).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("You successfully added tariff.");
					this.setState({
						tariffError: [],
						tariff:[]						
					});
					setTimeout(() => {
						this.props.history.push(`/transporter/${this.props.match.params.id}/tariff-list`);
					}, 500);
				}else{
					toast.error(resp.message);
				}
			});
		}else{
			tariffData.uuid=userId;
			this.props.updateTariff(tariffData).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					toast.success("You successfully updated tariff.");
					this.setState({
						tariffError: [],
						tariff:[]						
					});
					setTimeout(() => {
						this.props.history.push(`/transporter/${this.props.match.params.id}/tariff-list`);
					}, 500);
				}
			});
		}
    }
  };

  render() {
    const { tariff, tariffError,userId ,selectedPackage} = this.state;
    return (
      <main className="page-content tariff-page">
        <Header title={this.state.isTitle+ "  Tariff"} />
        <div className="form-wrapp">
          <Form onSubmit={this.storeTariff}>
            <div className="row gx-3">
              <div className="col-md-12">
                <THInput
                  controlId="rate"
                  type="text"
                  id="rate"
                  name="rate"
                  class=""
                  placeholder="$0.00"
                  isLable={true}
                  labelName="Your Tariff Rate (Price per Km)"
                  inputChangeHandler={this.handleCallback}
                  datavalue={tariff.rate}
                  errors_msg={tariffError.rate}
                />
              </div>
              <div className="col-md-12">
                <THSelect
                  controlId="packageAndDelivery"
                  labelName="Packaging & Delivery"
                  classNamePrefix="themis-select"
				  className2="themis-select"
                  placeholder="Packaging Details"
                  id="packageAndDelivery"
                  name="packageAndDelivery"
                  isLabel={true}
                  options={Packaging}
                 
				  inputChangeHandler={(name, value) =>
                    this.handleCallbackSelect(name, value)
                  }
                  datavalue={selectedPackage}
                  errors_msg={tariffError.packageAndDelivery}
                />
              </div>
              <div className="col-md-12">
                <THGoogleAddress
                  controlId="address"
                  name="address"
                  class=""
                  classGroup="mb-3 pb-1"
                  placeholder="Enter Delivery Location"
                  isLable={true}
                  labelName="Enter Delivery Location"
                  handleCallbackGoogle={this.handleCallbackGoogle}
                  dataValue={tariff.address}
                  errorMessage={tariffError.address}
                />
              </div>
              <div className="col-12">
                <div className="row gx-3">
                  <div className="col-md-4">
                    <THInput
                      controlId="ZipCode"
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      placeholder="Zip Code"
                      isLable={false}
                      inputChangeHandler={this.handleCallback}
                      datavalue={tariff.zipCode}
                      errors_msg={tariffError.zipCode}
                    />
                  </div>
                  <div className="col-md-4">
                    <THInput
                      controlId="City"
                      type="text"
                      name="city"
                      id="city"
                      placeholder="City"
                      isLable={false}
                      inputChangeHandler={this.handleCallback}
                      datavalue={tariff.city}
                      errors_msg={tariffError.city}
                    />
                  </div>
                  <div className="col-md-4">
                    <THInput
                      controlId="Country"
                      type="text"
                      name="country"
                      id="country"
                      placeholder="Country"
                      isLable={false}
                      inputChangeHandler={this.handleCallback}
                      datavalue={tariff.country}
                      errors_msg={tariffError.country}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="">
                <THButton
                  className="primary-btn"
                  type="submit"
                  name="Save"
                  variant="none"
                />
                <Link to={'/transporter/'+this.props.match.params.id+'/tariff-list'} className="btn secondary-btn">
                  Cancel
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </main>
    );
  }
}

TariffAdd.propsType = {
	doStoreTariff:PropTypes.func,
	getTariffDetail:PropTypes.func,
	updateTariff:PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	doStoreTariff: (data)=> (dispatch(doStoreTariff(data))),
	getTariffDetail: (data)=> (dispatch(getTariffDetail(data))),
	updateTariff: (data)=> (dispatch(updateTariff(data))),
});

const mapStateToProps = (status) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(TariffAdd);
