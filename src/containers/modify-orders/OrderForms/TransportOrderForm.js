import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import THInput from "../../../components/THInput/THInput";
import THGoogleAddress from "../../../components/THGoogleAddress/THGoogleAddress";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { transportOrderUpdate } from "../../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import THDatepicker from "../../../components/THDatepicker/THDatepicker";
class TransportOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      transportOrder: {
        charge: "",
        address: "",
        zipcode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
        delivery_date: "",
        pickup_date: ""
      },
      transportError: {
        charge: "",
        address: "",
        zipcode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
        delivery_date: "",
        pickup_date: ""
      },
    }
  }
  componentWillReceiveProps(props) {
    let data = props.order[0];
    this.setState({
      isLoading: false,
      transportOrder: {
        charge: data.order_tariff?.tariff_price,
        address: data.order_tariff?.user_tariff?.address,
        zipcode: data.order_tariff?.user_tariff?.zipcode,
        city: data.order_tariff?.user_tariff?.city,
        country: data.order_tariff?.user_tariff?.country,
        latitude: data.order_tariff?.user_tariff?.latitude,
        longitude: data.order_tariff?.user_tariff?.longitude,
        pickup_date: data.pickup_date ? new Date(data.pickup_date) : "",
        delivery_date: data.delivery_date ? new Date(data.delivery_date) : "",
      },
    });
  }

  transportOrderUpdate = async (e) => {
    e.preventDefault();
    await this.checkTransportValidation();
    const { transportOrder, isValidForm } = this.state;
    if (isValidForm) {
      var data = {
        charge: transportOrder.charge,
        address: transportOrder.address,
        zipcode: transportOrder.zipcode,
        city: transportOrder.city,
        country: transportOrder.country,
        pickup_date: transportOrder.pickup_date,
        delivery_date: transportOrder.delivery_date,
        id: this.props.id,
        latitude: transportOrder.latitude,
        longitude: transportOrder.longitude
      }
      this.props.transportOrderUpdate(data).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success(resp.message);
        }
        else {
          toast.error(resp.message);
        }
      });
    }
  }
  checkTransportValidation = () => {
    const { transportOrder, transportError } = this.state;

    if (
      transportOrder.charge === "" ||
      transportOrder.address === "" ||
      transportOrder.city === "" ||
      transportOrder.zipcode === "" ||
      transportOrder.pickup_date === "" ||
      transportOrder.delivery_date === "" ||
      transportOrder.country === ""
    ) {
      this.setState({
        isValidForm: false,
        transportError: {
          ...transportError,

          charge:
            transportOrder.charge === ""
              ? "Transporter charge is required"
              : "",
          address:
            transportOrder.address === ""
              ? "Address field is required"
              : "",

          city: transportOrder.city === "" ? "City field is required" : "",
          country:
            transportOrder.country === "" ? "Country field is required" : "",
          zipcode:
            transportOrder.zipcode === "" ? "Zipcode field is required" : "",
          pickup_date:
            transportOrder.pickup_date === "" ? "Pickup Date field is required" : "",
          delivery_date:
            transportOrder.delivery_date === "" ? "Delivery Date field is required" : "",
        },
      });
    } else {
      this.setState({
        isValidForm: true,
        transportError: {
          ...transportError,
          charge: "",
          address: "",
          zipcode: "",
          city: "",
          country: "",
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
            transportOrder: {
              ...this.state.transportOrder,
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
          this.checkTransportValidation();
          this.setState({
            transportOrder: {
              ...this.state.transportOrder,
              latitude: lat,
              longitude: lng,
            },
          });
        });
    } else {
      this.setState({
        transportOrder: {
          ...this.state.transportOrder,
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
        transportOrder: { ...this.state.transportOrder, pickup_date: date },
      });
  }
  handleDeliveryChange = (date) => {
    this.setState(
      {
        transportOrder: { ...this.state.transportOrder, delivery_date: date },
      });
  }
  handleCallback = (e) => {

    const { value, name } = e.target;
    this.setState(
      {
        transportOrder: { ...this.state.transportOrder, [name]: value },
      }, () => {
        this.checkTransportValidation();
      });
  };

  render() {

    const { transportOrder, transportError } = this.state;

    return (
      <Form onSubmit={this.transportOrderUpdate}>
        <div className="row gx-3">
          <div className="col-md-6">
            <THInput
              controlId="Delivery-Unit"
              label="Delivery Charge"
              type="text"
              name="charge"
              id="Delivery-Unit"
              placeholder="$00.00"
              datavalue={transportOrder?.charge}
              inputChangeHandler={this.handleCallback}
              errors_msg={transportError?.charge}
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
              dataValue={transportOrder?.address}
              handleCallbackGoogle={this.handleCallbackGoogle}
              errorMessage={transportError?.address}
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
                  datavalue={transportOrder?.zipcode}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={transportError?.zipcode}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="City"
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  datavalue={transportOrder?.city}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={transportError?.city}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="Country"
                  type="text"
                  name="country"
                  id="country"
                  placeholder="Country"
                  datavalue={transportOrder?.country}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={transportError?.country}

                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <THDatepicker
              controlId="departureDate"
              labelClass="w-100 mb-0"
              id="pickup_date"
              class="form-control"
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter Pickup Date"
              dataValue={transportOrder?.pickup_date}
              parentDateCallback={this.handlePickupChange}
              errors_msg={transportError?.pickup_date}
            />
          </div>
          <div className="col-md-6">
            <THDatepicker
              controlId="departureDate"
              labelClass="w-100 mb-0"
              id="delivery_date"
              class="form-control"
              dateFormat="dd/MM/yyyy"
              placeholderText="Enter Delivery Date"
              dataValue={transportOrder?.delivery_date}
              errors_msg={transportError?.delivery_date}
              parentDateCallback={this.handleDeliveryChange}
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

TransportOrderForm.protoType = {
  transportOrderUpdate: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  transportOrderUpdate: (data) => dispatch(transportOrderUpdate(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TransportOrderForm);
