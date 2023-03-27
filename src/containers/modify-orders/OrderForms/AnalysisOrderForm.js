import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import THInput from "../../../components/THInput/THInput";
import THGoogleAddress from "../../../components/THGoogleAddress/THGoogleAddress";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { analysisOrderUpdate } from "../../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import THDatepicker from "../../../components/THDatepicker/THDatepicker";
class AnalysisOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isValidForm:false,
      analysisOrder: {
        charge: "",
        address: "",
        zipcode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
        analysis_date: ""
      },
      analysisError: {
        charge: "",
        address: "",
        zipcode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
        analysis_date: ""
      },
    }
  }

  componentWillReceiveProps(props) {
    let data = props.order[0];
    this.setState({
      isLoading: false,
      analysisOrder: {
        charge: data.order_analyasis?.analysis_price,
        address: data.order_analyasis?.user_tariff?.address,
        zipcode: data.order_analyasis?.user_tariff?.zipcode,
        city: data.order_analyasis?.user_tariff?.city,
        analysis_date: data.pickup_date ? new Date(data.pickup_date) : "",
        country: data.order_analyasis?.user_tariff?.country,
        latitude: data.order_analyasis?.user_tariff?.latitude,
        longitude: data.order_analyasis?.user_tariff?.longitude,
      },
    });
  }

  analysisOrderUpdate = async (e) => {
    e.preventDefault();
    await this.checkAnalysisValidation();
    const { analysisOrder, isValidForm } = this.state;
    if (isValidForm) {
      var data = {
        charge: analysisOrder.charge,
        address: analysisOrder.address,
        zipcode: analysisOrder.zipcode,
        city: analysisOrder.city,
        country: analysisOrder.country,
        analysis_date: analysisOrder.analysis_date,
        id: this.props.id,
        latitude: analysisOrder.latitude,
        longitude: analysisOrder.longitude
      }
      this.props.analysisOrderUpdate(data).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success(resp.message);
        }
        else {
          toast.error(resp.message);
        }
      });
    }
  }
  checkAnalysisValidation = () => {
    const { analysisOrder, analysisError } = this.state;
    if (
      analysisOrder.charge === "" ||
      analysisOrder.address === "" ||
      analysisOrder.city === "" ||
      analysisOrder.country === ""
    ) {
      this.setState({
        isValidForm: false,
        analysisError: {
          ...analysisError,
          charge:
            analysisOrder.charge === ""
              ? "analysis charge is required"
              : "",
          address:
            analysisOrder.address === ""
              ? "address field is required"
              : "",

          city: analysisOrder.city === "" ? "City field is required" : "",
          country:
            analysisOrder.country === "" ? "Country field is required" : "",

        },
      });
    } else {
      this.setState({
        isValidForm: true,
        analysisError: {
          ...analysisError,
          charge: "",
          address: "",
          zipcode: "",
          city: "",
          country: "",
          latitude: "",
          longitude: "",
          analysis_date: ""
        },
      });
    }
  };
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
            analysisOrder: {
              ...this.state.analysisOrder,
              address: results[0].formatted_address,
              zipcode:
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
          });
          return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
          this.checkAnalysisValidation();
          this.setState({
            analysisOrder: {
              ...this.state.analysisOrder,
              latitude: lat,
              longitude: lng,
            },
          });
        });
    } else {
      this.setState({
        analysisOrder: {
          ...this.state.analysisOrder,
          latitude: "",
          longitude: "",
          address: "",
          zipcode: "",
          city: "",
          country: "",
        },
      });
    }
  };
  handlePickupChange = (date) => {
    this.setState(
      {
        analysisOrder: { ...this.state.analysisOrder, analysis_date: date },
      });
  }
  handleCallback = (e) => {
    const { value, name } = e.target;
    this.setState(
      {
        analysisOrder: { ...this.state.analysisOrder, [name]: value },
      }, () => {
        this.checkAnalysisValidation();
      });
  };

  render() {

    const { analysisOrder, analysisError } = this.state;

    return (
      <Form onSubmit={this.analysisOrderUpdate}>
        <div className="row gx-3">

          <div className="col-md-6">
            <THInput
              controlId="Analysis-Charge"
              label="Analysis Charge"
              type="text"
              name="charge"
              id="Analysis-Charge"
              placeholder="$00.00"
              datavalue={analysisOrder?.charge}
              errors_msg={analysisError?.charge}
              inputChangeHandler={this.handleCallback}
            />
          </div>
          <div className="col-md-12">
            <THGoogleAddress
              controlId="Address"
              name="address"
              class=""
              classGroup="mb-3 pb-1"
              isLable={true}
              placeholder="Enter Address Location"
              labelName="Address"
              dataValue={analysisOrder?.address}
              errorMessage={analysisError?.address}
              handleCallbackGoogle={this.handleCallbackGoogle}
            />
          </div>
          <div className="col-12">
            <div className="row gx-3">
              <div className="col-md-4">
                <THInput
                  controlId="ZipCode"
                  type="text"
                  name="zipcode"
                  id="zipCode"
                  placeholder="Zip Code"
                  datavalue={analysisOrder?.zipcode}
                  errors_msg={analysisError?.zipcode}
                  inputChangeHandler={this.handleCallback}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="City"
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  datavalue={analysisOrder?.city}
                  errors_msg={analysisError?.city}
                  inputChangeHandler={this.handleCallback}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="Country"
                  type="text"
                  name="country"
                  id="country"
                  placeholder="Country"
                  datavalue={analysisOrder?.country}
                  errors_msg={analysisError?.country}
                  inputChangeHandler={this.handleCallback}
                />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <THDatepicker
              controlId="AnalysisDatePicker"
              labelClass="w-100 mb-0"
              id="analysis_date"
              class="form-control"
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter Analysis Date"
              dataValue={analysisOrder.analysis_date}
              parentDateCallback={this.handlePickupChange}
            />
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="">
            <Button variant="none" className="primary-btn" type="submit">
              Save
            </Button>
            <Link to={`/order/detail/${this.props.id}`} className="btn secondary-btn">
              Cancel
            </Link>
          </div>
        </div>
      </Form>
    );
  }
}

AnalysisOrderForm.protoType = {
  analysisOrderUpdate: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  analysisOrderUpdate: (data) => dispatch(analysisOrderUpdate(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisOrderForm);
