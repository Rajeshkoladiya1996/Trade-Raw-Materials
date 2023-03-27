import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import THInput from "../../../components/THInput/THInput";
import THGoogleAddress from "../../../components/THGoogleAddress/THGoogleAddress";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { sellerOrderUpdate } from "../../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import THDatepicker from "../../../components/THDatepicker/THDatepicker";
class SellerOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      sellerOrder: {
        quantity: "",
        price: "",
        address: "",
        zipcode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
        pickup_date: ""
      },
      sellerError: {
        quantity: "",
        price: "",
        address: "",
        zipcode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
        pickup_date: ""
      },
    }
  }

  componentWillReceiveProps(props) {
    let data = props.order[0];
    this.setState({
      isLoading: false,
      sellerOrder: {
        quantity: data.order_details[0]?.qty,
        price: data.order_details[0]?.price,
        address: data.seller_product?.pickup_address,
        zipcode: data.seller_product?.zipcode,
        city: data.seller_product?.city,
        pickup_date: data.pickup_date ? new Date(data.pickup_date) : "",
        country: data.seller_product?.country,
        latitude: data.seller_product?.latitude,
        longitude: data.seller_product?.longitude
      },
    });
  }

  sellerOrderUpdate = async (e) => {
    e.preventDefault();
    await this.checkSellerValidation();
    const { sellerOrder, isSellerValidForm } = this.state;
    if (isSellerValidForm) {
      var data = {
        quantity: sellerOrder.quantity,
        price: sellerOrder.price,
        address: sellerOrder.address,
        zipcode: sellerOrder.zipcode,
        city: sellerOrder.city,
        country: sellerOrder.country,
        pickup_date: sellerOrder.pickup_date,
        id: this.props.id,
        latitude: sellerOrder.latitude.toString(),
        longitude: sellerOrder.longitude.toString()
      }
      this.props.sellerOrderUpdate(data).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success(resp.message);
        }
        else {
          toast.error(resp.message);
        }
      });
    }
  }
  checkSellerValidation = () => {
    const { sellerOrder,sellerError } = this.state;

    const numberRegx = /^[0-9\b]+$/;
    if (
        sellerOrder.quantity === "" ||
        !numberRegx.test(sellerOrder.quantity) ||
        sellerOrder.price === "" ||
        sellerOrder.address === "" ||
        sellerOrder.zipcode === "" ||
        sellerOrder.city === "" ||
        sellerOrder.country === ""
    ) {    
        this.setState({
            isSellerValidForm: false,
            sellerError: {
                ...sellerError,

                quantity:
                  sellerOrder.quantity === ""
                        ? "Quantity is required"
                        : !numberRegx.test(sellerOrder.quantity)
                            ? "Please enter only number."
                            : "",
                price:
                  sellerOrder.price === ""
                        ? "price field is required"
                        : "",
                address:
                  sellerOrder.address === ""
                        ? "shipping address field is required"
                        : "",

                city: sellerOrder.city === "" ? "City field is required" : "",
                country:
                  sellerOrder.country === "" ? "Country field is required" : "",
                zipcode:
                  sellerOrder.zipcode === "" ? "ZipCode field is required" : "",

            },
        });
    } else {
        this.setState({
            isSellerValidForm: true,
            sellerError: {
                ...sellerError,
                amount: "",
                quantity: "",
                price:"",
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
            sellerOrder: {
              ...this.state.sellerOrder,
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
          this.setState({
            sellerOrder: {
              ...this.state.sellerOrder,
              latitude: lat,
              longitude: lng,
            },
          });
        });
    } else {
      this.checkSellerValidation();
      this.setState({
        sellerOrder: {
          ...this.state.sellerOrder,
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
  handlePickupChange=(date) =>{
		this.setState(
		{
			sellerOrder: { ...this.state.sellerOrder, pickup_date: date },
    });
  }
  handleCallback = (e) => {
    const { value, name } = e.target;
		this.setState(
			{
				sellerOrder: { ...this.state.sellerOrder, [name]: value },
			},()=>{
          this.checkSellerValidation();
      });
  };

  render() {

    const { sellerOrder, sellerError } = this.state;

    return (
      <Form onSubmit={this.sellerOrderUpdate}>
        <div className="row gx-3">
          <div className="col-md-6">
            <THInput
              controlId="Quantity"
              type="text"
              id="Quantity"
              name="quantity"
              class=""
              label="Quantity"
              isNumber={true}
              placeholder="00"
              datavalue={this.state.sellerOrder.quantity}
              inputChangeHandler={this.handleCallback}
              errors_msg={sellerError?.quantity}
            />
          </div>
          <div className="col-md-6">
            <THInput
              controlId="Sell-Unit"
              type="text"
              id="Sell-Unit"
              name="price"
              class=""
              label="Sell/Unit"
              isNumber={true}
              placeholder="$00.00"
              datavalue={sellerOrder.price}
              inputChangeHandler={this.handleCallback}
              errors_msg={sellerError?.price}
            />
          </div>

          <div className="col-md-12">
            <THGoogleAddress
              controlId="Pickup-Location"
              name="address"
              class=""
              classGroup="mb-3 pb-1"
              isLable={true}
              placeholder="Enter Pickup Location"
              labelName="Pickup Location"
              dataValue={sellerOrder.address}
              errorMessage={sellerError?.address}
              handleCallbackGoogle={this.handleCallbackGoogle}
            />

          </div>
          <div className="col-12">
            <div className="row gx-3">
              <div className="col-md-4">
                <THInput
                  controlId="BidZipCode"
                  type="text"
                  name="zipcode"
                  id="zipCode"
                  placeholder="Zip Code"
                  datavalue={sellerOrder.zipcode}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={sellerError?.zipcode}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="BidCity"
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  datavalue={sellerOrder?.city}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={sellerError?.city}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="BidCountry"
                  type="text"
                  name="country"
                  id="country"
                  placeholder="Country"
                  datavalue={sellerOrder.country}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={sellerError?.country}
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
              dataValue={sellerOrder.pickup_date}
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

SellerOrderForm.protoType = {
  sellerOrderUpdate: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  sellerOrderUpdate: (data) => dispatch(sellerOrderUpdate(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SellerOrderForm);
