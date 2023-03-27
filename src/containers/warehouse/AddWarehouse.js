import React from "react";
import { Form } from "react-bootstrap";
import THButton from "../../components/THButton/THButton";
import THInput from "../../components/THInput/THInput";
import THSelect from "../../components/THSelect/THSelect";
import Header from "../../components/header/Header";
import THGoogleAddress from "../../components/THGoogleAddress/THGoogleAddress";
import { getSellProductDetail, warehouseStore, getWarehouseDetail, warehouseUpdate } from "../../actions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

const currency = [
  { value: "dollar", label: "$(dollar)" },
  { value: "inr", label: "₹(INR)" },
];
class AddWarehouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidForm: true,
      isTitle: "Add",
      selectedCurrency: "",
      warehouse: {
        id: "",
        name: "",
        price: "",
        payCurrency: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
      },
      warehouseError: {
        name: "",
        price: "",
        payCurrency: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        latitude: "",
        longitude: "",
      },
    };
  }

  componentDidMount() {
    if (this.props.match.params.id !== undefined) {
      this.setState({
        isTitle: "Edit",
      });
      const { warehouse } = this.state;

      this.props.getWarehouseDetail(this.props.match.params.id).then((resp) => {
        if (resp && resp.ResponseCode === 1) {

          const currencyFiltered = currency.filter(
            (item) => item.value === resp.data.currency_pay
          );
          this.setState({
            isValidForm: true,
            selectedCurrency: currencyFiltered[0],
            warehouse: {
              ...this.state.warehouse,
              price: resp.data.price,
              name: resp.data.name,
              address: resp.data.address,
              payCurrency: resp.data.currency_pay,
              zipCode: resp.data.zipcode,
              city: resp.data.city,
              country: resp.data.country,
              latitude: resp.data.latitude,
              longitude: resp.data.longitude,
            },
          });
        }
      });
    }
  }
  handleCurrencyCallbackSelect = (event) => {
    let { name, value } = event;

    this.setState(
      {
        selectedCurrency: event,
        warehouse: { ...this.state.warehouse, payCurrency: value },
      },
      () => {
        this.checkValidation();
      }
    );
  };

  handleCallback = (e) => {
    const { value, name } = e.target;

    this.setState(
      {
        warehouse: { ...this.state.warehouse, [name]: value },
      },
      () => {
        this.checkValidation();
      }
    );
  };

  checkValidation = () => {

    const { warehouse, warehouseError } = this.state;

    const numberRegx = /^[+-]?\d+(\.\d+)?$/;
    if (
      warehouse.price === "" ||
      !numberRegx.test(warehouse.price) ||
      warehouse.name === "" ||
      warehouse.payCurrency === "" ||
      warehouse.address === "" ||
      warehouse.city === "" ||
      warehouse.country === "" ||
      warehouse.zipCode === "" ||
      !numberRegx.test(warehouse.zipCode) 
    ) {

      this.setState({
        isValidForm: false,
        warehouseError: {
          ...warehouseError,

          price:
            warehouse.price === ""
              ? "Price is required"
              : !numberRegx.test(warehouse.price)
                ? "Please enter only number."
                : "",
          name:
            warehouse.name === ""
              ? "Name field is required"
              : "",
          payCurrency:
            warehouse.payCurrency === ""
              ? "Pay Currency field is required"
              : "",
          address:
            warehouse.address === ""
              ? "Address field is required"
              : "",

          city: warehouse.city === "" ? "City field is required" : "",
          country:
            warehouse.country === "" ? "Country field is required" : "",
          zipCode:
            warehouse.zipCode === "" 
            ? "ZipCode field is required" 
            : !numberRegx.test(warehouse.zipCode)
            ? "Please enter only number."
            : ""
        },
      });
    } else {
      this.setState({
        isValidForm: true,
        warehouseError: {
          ...warehouseError,
          price: "",
          name: "",
          payCurrency: "",
          address: "",
          zipCode: "",
          city: "",
          country: "",
        },
      });
    }
  };

  addWarehouse = async (e) => {
    e.preventDefault();
    await this.checkValidation();
    const { warehouse, warehouseError, isValidForm } = this.state;
    let data = {
      price: parseFloat(warehouse.price),
      name: warehouse.name,
      address: warehouse.address,
      currency_pay: warehouse.payCurrency,
      zipcode: warehouse.zipCode,
      city: warehouse.city,
      country: warehouse.country,
      latitude: warehouse.latitude.toString(),
      longitude: warehouse.longitude.toString(),
    }
    if (this.state.isTitle === "Add") {
      if (isValidForm) {
        this.props.warehouseStore(data).then((resp) => {
          if (resp && resp.ResponseCode === 1) {
            toast.success("Warehouse added successfully");
            this.props.history.push("/warehouses");

          } else {
            toast.error(resp.message);
          }
        });
      }
    }
    else {
      if (isValidForm) {
       data.id = this.props.match.params.id;
        this.props.warehouseUpdate(data).then((resp) => {
          if (resp && resp.ResponseCode === 1) {
            toast.success("Warehouse Updated successfully");
            this.props.history.push("/warehouses");
          } else {
            this.setState({
              warehouseError: {
                ...warehouseError,
                name: resp.message,
              },
            });
          }
        });
      }
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
            warehouse: {
              ...this.state.warehouse,
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
          });
          return getLatLng(results[0]);
        })
        .then(({ lat, lng }) => {
          this.setState({
            warehouse: {
              ...this.state.warehouse,
              latitude: lat,
              longitude: lng,
            },
          });
          this.checkValidation();
        });
    } else {
      this.setState({
        warehouse: {
          ...this.state.warehouse,
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
  render() {
    const { warehouse, selectedCurrency, warehouseError } = this.state;
    return (
      <main className="page-content edit-shopping-info-page">
        <Header title={this.state.isTitle + " Warehouse"} />
        <Form onSubmit={this.addWarehouse}>
          <div className="row">
            <div className="col">
              <div className="form-wrapp">
                <div className="row gx-3">
                  <div className="col-6">
                    <THInput
                      controlId="Name"
                      type="text"
                      id="name"
                      name="name"
                      class=""
                      isNumber={true}
                      placeholder="Name"
                      datavalue={warehouse.name}
                      inputChangeHandler={this.handleCallback}
                      errors_msg={warehouseError.name}
                    />
                  </div>
                  <div className="col-6">
                    <THInput
                      controlId="Price"
                      type="text"
                      id="price"
                      name="price"
                      class=""
                      placeholder="Price"
                      datavalue={warehouse.price}
                      inputChangeHandler={this.handleCallback}
                      errors_msg={warehouseError.price}
                    />
                  </div>
                  <div className="col-md-12">
                    <THSelect
                      controlId="CurrentPay"
                      labelName="What currency do you want to pay?"
                      className2="themis-select"
                      placeholder="$(Dollar)"
                      options={currency}
                      id="payCurrency"
                      name="payCurrency"
                      datavalue={selectedCurrency}
                      errors_msg={warehouseError.payCurrency}
                      inputChangeHandler={this.handleCurrencyCallbackSelect}
                    />
                  </div>
                  <div className="col-md-12">
                    <THGoogleAddress
                      controlId="BidaLocation"
                      name="address"
                      class=""
                      classGroup="mb-3 pb-1"
                      isLable={true}
                      placeholder="Enter Delivery Location"
                      labelName="Shipping Address"
                      handleCallbackGoogle={this.handleCallbackGoogle}
                      errorMessage={warehouseError.address}
                      dataValue={warehouse.address}
                    />
                  </div>
                  <div className="col-12">
                    <div className="row gx-3">
                      <div className="col-md-4">
                        <THInput
                          controlId="BidZipCode"
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          placeholder="Zip Code"
                          datavalue={warehouse.zipCode}
                          inputChangeHandler={this.handleCallback}
                          errors_msg={warehouseError.zipCode}
                        />
                      </div>
                      <div className="col-md-4">
                        <THInput
                          controlId="BidCity"
                          type="text"
                          name="city"
                          id="city"
                          placeholder="City"
                          datavalue={warehouse.city}
                          inputChangeHandler={this.handleCallback}
                          errors_msg={warehouseError.city}
                        />
                      </div>
                      <div className="col-md-4">
                        <THInput
                          controlId="BidCountry"
                          type="text"
                          name="country"
                          id="country"
                          placeholder="Country"
                          datavalue={warehouse.country}
                          inputChangeHandler={this.handleCallback}
                          errors_msg={warehouseError.country}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              <THButton
                variant="none"
                className="primary-btn"
                type="submit"
                name="Save"
              />
              </div>
            </div>
          </div>
        </Form>
      </main>
    );
  }
}

AddWarehouse.propsType = {
  getSellProductDetail: PropTypes.func,
  warehouseStore: PropTypes.func,
  getWarehouseDetail: PropTypes.func,
  warehouseUpdate: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
  getSellProductDetail: (data) => dispatch(getSellProductDetail(data)),
  warehouseStore: (data) => dispatch(warehouseStore(data)),
  getWarehouseDetail: (data) => dispatch(getWarehouseDetail(data)),
  warehouseUpdate: (data) => dispatch(warehouseUpdate(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AddWarehouse);