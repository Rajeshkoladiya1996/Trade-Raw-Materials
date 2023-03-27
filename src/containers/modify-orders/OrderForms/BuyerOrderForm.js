import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import THInput from "../../../components/THInput/THInput";
import THGoogleAddress from "../../../components/THGoogleAddress/THGoogleAddress";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { buyerOrderUpdate } from "../../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

class BuyerOrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isLoading: false,
      buyerOrder:{
        quantity:"",
        price:"",
        address:"",
        zipcode:"",
        city:"",
        country:"",
        latitude:"",
        longitude:""
      },
      buyerError:{
        quantity:"",
        price:"",
        address:"",
        zipcode:"",
        city:"",
        country:"",
        latitude:"",
        longitude:""
      },
    }
  }
  
  componentWillReceiveProps(props) {
    
    let data=props.order[0];
    this.setState({
 
      isLoading: false,
      buyerOrder:{
        quantity:data.order_details[0]?.qty,
        price:data.order_details[0]?.price,
        address:data.address,
        zipcode:data.zipcode,
        city:data.city,
        country:data.country,
        latitude:data.latitude,
        longitude:data.longitude
      },
    });
  }
  
  buyerOrderUpdate=async(e)=>{
    e.preventDefault();
    await this.checkBuyerValidation();
    const {buyerOrder,isValidForm}=this.state;
    if(isValidForm){
      var data={
        quantity:buyerOrder.quantity,
        price:buyerOrder.price,
        address:buyerOrder.address,
        zipcode:buyerOrder.zipcode,
        city:buyerOrder.city,
        country:buyerOrder.country,
        id:this.props.id ,
        latitude:buyerOrder.latitude.toString(),
        longitude:buyerOrder.longitude.toString()
      }

      this.props.buyerOrderUpdate(data).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success(resp.message);
        }
        else{
          toast.error(resp.message);
        }
      });
    }
  }

  checkBuyerValidation = () => {

    const { buyerOrder,buyError } = this.state;

    const numberRegx = /^[0-9\b]+$/;
    if (
        buyerOrder.quantity === "" ||
        !numberRegx.test(buyerOrder.quantity) ||
        buyerOrder.price === "" ||
        buyerOrder.address === "" ||
        buyerOrder.city === "" ||
        buyerOrder.country === ""
    ) {

        this.setState({
            isValidForm: false,
            buyError: {
                ...buyError,

                quantity:
                  buyerOrder.quantity === ""
                        ? "Quantity is required"
                        : !numberRegx.test(buyerOrder.quantity)
                            ? "Please enter only number."
                            : "",
                price:
                  buyerOrder.price === ""
                        ? "price field is required"
                        : "",
                address:
                  buyerOrder.address === ""
                        ? "shipping address field is required"
                        : "",

                city: buyerOrder.city === "" ? "City field is required" : "",
                country:
                  buyerOrder.country === "" ? "Country field is required" : "",

            },
        });
    } else {
        this.setState({
          isValidForm: true,
            buyError: {
                ...buyError,
                amount: "",
                quantity: "",
                price:"",
                address: "",
                zipCode: "",
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
                    buyerOrder: {
                        ...this.state.buyerOrder,
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
                    buyerOrder: {
                        ...this.state.buyerOrder,
                        latitude: lat,
                        longitude: lng,
                    },
                });
            });
    } else {
        this.setState({
           buyerOrder: {
                ...this.state.buyerOrder,
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
  handleCallback = (e) => {
		const { value, name } = e.target;
		this.setState(
			{
				buyerOrder: { ...this.state.buyerOrder, [name]: value },
			},()=>{
        this.checkBuyerValidation();
      });
	};

  render() {

    const {  buyerOrder,buyError} = this.state;

    return (
        <Form onSubmit={this.buyerOrderUpdate}>
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
              datavalue={buyerOrder.quantity}
              inputChangeHandler={this.handleCallback}
              errors_msg={buyError?.quantity}
            />

          </div>
          <div className="col-md-6">
            <THInput
              controlId="Buy-Unit"
              type="text"
              id="Buy-Unit"
              name="price"
              class=""
              label="Buy/Unit"
              isNumber={true}
              placeholder="$00.00"
              datavalue={buyerOrder.price}
              inputChangeHandler={this.handleCallback}
              errors_msg={buyError?.price}
            />

          </div>
          <div className="col-md-12">
            <THGoogleAddress
              controlId="Delivery-Location"
              name="shipAddress"
              class=""
              classGroup="mb-3 pb-1"
              isLable ={true}
              placeholder="Enter Delivery Location"
              labelName="Shipping Address"
              dataValue={buyerOrder.address}
              errorMessage={buyError?.address}
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
                  datavalue={buyerOrder.zipcode}
                  inputChangeHandler={this.handleCallback}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="BidCity"
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  datavalue={buyerOrder.city}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={buyError?.city}
                />
              </div>
              <div className="col-md-4">
                <THInput
                  controlId="BidCountry"
                  type="text"
                  name="country"
                  id="country"
                  placeholder="Country"
                  datavalue={buyerOrder.country}
                  inputChangeHandler={this.handleCallback}
                  errors_msg={buyError?.country}
                />
              </div>
            </div>
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

BuyerOrderForm.protoType = {
  buyerOrderUpdate:PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  buyerOrderUpdate:(data)=>dispatch(buyerOrderUpdate(data)),
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(BuyerOrderForm);
