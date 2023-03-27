import React from "react";
import {Form} from "react-bootstrap";
import THButton from "../../components/THButton/THButton";
import THInput from "../../components/THInput/THInput";
import THDatepicker from "../../components/THDatepicker/THDatepicker";
import THSelect from "../../components/THSelect/THSelect";
import THFile from "../../components/THFile/THFile";
import Header from "../../components/header/Header";
import THGoogleAddress from "../../components/THGoogleAddress/THGoogleAddress";
import {getSellProductDetail, sellProductUpdate} from "../../actions";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";

const Packaging = [
  {value: "Bulk", label: "Bulk"},
  {value: "Big Bag", label: "Big Bag"},
  {value: "Bag 15Kg", label: "Bag 15Kg"},
  {value: "Bag 25Kg", label: "Bag 25Kg"}
];

const currency = [
  {value: "dollar", label: "$(dollar)"},
  {value: "inr", label: "₹(INR)"}
];
class EditSellProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidForm: true,
      sellProduct: {
        product_id: "",
        availableQty: "",
        minOrderQty: "",
        price: "",
        receptionDate: new Date(),
        packageAndDelivery: "",
        payCurrency: "",
        shipAddress: "",
        zipCode: "",
        city: "",
        country: "",
        docImage: "",
        latitude: "",
        longitude: "",
        quality: ""
      },
      sellError: {
        availableQty: "",
        minOrderQty: "",
        price: "",
        receptionDate: "",
        packageAndDelivery: "",
        payCurrency: "",
        shipAddress: "",
        zipCode: "",
        city: "",
        country: "",
        docImage: "",
        quality: ""
      }
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getSellProductDetail(id).then((resp) => {
      if (resp.ResponseCode) {
        // console.log({ resp: resp.data });

        const packagingDeliveryFiltered = Packaging.filter((item) => item.value === resp.data.packaging_delivery);
        const currencyFiltered = currency.filter((item) => item.value === resp.data.currency_pay);

        this.setState({
          isValidForm: true,
          selectedpackagingDelivery: packagingDeliveryFiltered[0],
          selectedCurrency: currencyFiltered[0],
          sellProduct: {
            ...this.state.sellProduct,
            product_id: resp.data.uuid,
            availableQty: resp.data.availble_quantity,
            minOrderQty: resp.data.min_order_quantity,
            price: resp.data.price,
            receptionDate: new Date(resp.data.expiry_date),
            packageAndDelivery: resp.data.packaging_delivery,
            shipAddress: resp.data.pickup_address,
            payCurrency: resp.data.currency_pay,
            zipCode: resp.data.zipcode,
            city: resp.data.city,
            country: resp.data.country,
            docImage: resp.data.image,
            latitude: resp.data.latitude,
            longitude: resp.data.longitude,
            quality: resp.data.quality
          }
        });
      }
    });
  }
  handlePackageCallbackSelect = (event) => {
    let {name, value} = event;
    this.setState(
      {
        selectedpackagingDelivery: event,
        sellProduct: {...this.state.sellProduct, packageAndDelivery: value}
      },
      () => {
        this.checkSellerValidation();
      }
    );
  };
  handleCurrencyCallbackSelect = (event) => {
    let {name, value} = event;

    this.setState(
      {
        selectedCurrency: event,
        sellProduct: {...this.state.sellProduct, payCurrency: value}
      },
      () => {
        this.checkSellerValidation();
      }
    );
  };

  handleDateCallback = (date) => {
    this.setState(
      {
        sellProduct: {...this.state.sellProduct, receptionDate: date}
      },
      () => {
        this.checkSellerValidation();
      }
    );
  };

  handleCallback = (e) => {
    const {value, name} = e.target;

    this.setState(
      {
        sellProduct: {...this.state.sellProduct, [name]: value}
      },
      () => {
        this.checkSellerValidation();
      }
    );
  };

  checkSellerValidation = () => {
    const {sellProduct, sellError} = this.state;

    const numberRegx = /^[0-9\b]+$/;
    const floatnumberRegx = /^[+-]?\d+(\.\d+)?$/;
    if (
      sellProduct.availableQty === "" ||
      !numberRegx.test(sellProduct.availableQty) ||
      sellProduct.minOrderQty === "" ||
      !numberRegx.test(sellProduct.minOrderQty) ||
      sellProduct.price === "" ||
      !floatnumberRegx.test(sellProduct.price) ||
      sellProduct.receptionDate === "" ||
      sellProduct.packageAndDelivery === "" ||
      sellProduct.payCurrency === "" ||
      sellProduct.shipAddress === "" ||
      sellProduct.city === "" ||
      sellProduct.country === "" ||
      sellProduct.quality === ""
    ) {
      this.setState({
        isValidForm: false,
        sellError: {
          ...sellError,

          availableQty:
            sellProduct.availableQty === "" ? "Available quantity is required" : !numberRegx.test(sellProduct.availableQty) ? "Please enter only number." : "",
          minOrderQty:
            sellProduct.minOrderQty === ""
              ? "MinOrder quantity is required"
              : !numberRegx.test(sellProduct.minOrderQty)
              ? "Please enter only number."
              : sellProduct.minOrderQty > sellProduct.availableQty
              ? "Minimum quantity less than available quantity"
              : "",
          price: sellProduct.price === "" ? "Price is required" : !floatnumberRegx.test(sellProduct.price) ? "Please enter only number." : "",
          receptionDate: sellProduct.receptionDate === "" ? "Reception date field is required" : "",
          packageAndDelivery: sellProduct.packageAndDelivery === "" ? "Package and delivery date field is required" : "",
          payCurrency: sellProduct.payCurrency === "" ? "payCurrency field is required" : "",
          shipAddress: sellProduct.shipAddress === "" ? "shipping address field is required" : "",

          city: sellProduct.city === "" ? "City field is required" : "",
          country: sellProduct.country === "" ? "Country field is required" : "",
          quality: sellProduct.quality === "" ? "Quality field is required" : ""
        }
      });
    } else {
      this.setState({
        isValidForm: true,
        sellError: {
          ...sellError,
          availableQty: "",
          minOrderQty: "",
          price: "",
          receptionDate: "",
          packageAndDelivery: "",
          payCurrency: "",
          shipAddress: "",
          zipCode: "",
          city: "",
          country: "",
          docImage: "",
          quality: ""
        }
      });
    }
  };

  ImageCallback = async (e) => {
    const file = e.target.files[0];
    if (file !== undefined) {
      var fileType = file.type.split("/").pop().toLowerCase();
      if (fileType !== "jpeg" && fileType !== "jpg" && fileType !== "png") {
        this.setState({
          sellError: {
            ...this.state.sellError,
            docImage: "Please select a valid image file"
          },
          sellProduct: {
            ...this.state.sellProduct,
            docImage: ""
          },
          isImagePreview: "",
          isValidForm: false
        });
      } else {
        const base64Image = await this.getBase64Image(file);
        this.setState({
          isImagePreview: base64Image,
          sellProduct: {
            ...this.state.sellProduct,
            docImage: base64Image
          },
          sellError: {
            ...this.state.sellError,
            docImage: ""
          },
          isValidForm: true
        });
      }
    }
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
  sellProduct = async (e) => {
    e.preventDefault();

    await this.checkSellerValidation();
    const {sellProduct, sellError, isValidForm} = this.state;

    if (isValidForm) {
      let sellProductData = {
        id: sellProduct.product_id,
        availble_quantity: sellProduct.availableQty,
        min_order_quantity: sellProduct.minOrderQty,
        price: sellProduct.price,
        expiry_date: sellProduct.receptionDate,
        packaging_delivery: sellProduct.packageAndDelivery,
        pickup_address: sellProduct.shipAddress,
        currency_pay: sellProduct.payCurrency,
        zipcode: sellProduct.zipCode,
        city: sellProduct.city,
        country: sellProduct.country,
        image: sellProduct.docImage,
        latitude: sellProduct.latitude,
        longitude: sellProduct.longitude,
        quality: sellProduct.quality
      };
      this.props.sellProductUpdate(sellProductData).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success("Sell product updated successfully");
          this.props.history.push("/sell-product");
        } else {
          toast.error(resp.message);
        }
      });
    }
  };

  handleCallbackGoogle = (val) => {
    if (val != null) {
      geocodeByAddress(val.label)
        .then((results) => {
          //   console.log({ results });
          const ShouldBeComponent = {
            postal_code: ["postal_code"],
            city: ["locality"],
            country: ["country"]
          };
          results[0].address_components.forEach((component) => {
            for (let shouldBe in ShouldBeComponent) {
              if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
                results[0].address_components[shouldBe] = component.long_name;
              }
            }
          });
          this.setState({
            sellProduct: {
              ...this.state.sellProduct,
              shipAddress: results[0].formatted_address,
              zipCode: typeof results[0].address_components.postal_code !== undefined ? results[0].address_components.postal_code : "",
              city: typeof results[0].address_components.city !== undefined ? results[0].address_components.city : "",
              country: typeof results[0].address_components.country !== undefined ? results[0].address_components.country : ""
            }
          });
          return getLatLng(results[0]);
        })
        .then(({lat, lng}) => {
          this.setState({
            sellProduct: {
              ...this.state.sellProduct,
              latitude: lat,
              longitude: lng
            }
          });
          this.checkSellerValidation();
        });
    } else {
      this.setState({
        sellProduct: {
          ...this.state.sellProduct,
          latitude: "",
          longitude: "",
          shipAddress: "",
          zipCode: "",
          city: "",
          country: ""
        }
      });
    }
  };
  render() {
    const {sellProduct, selectedpackagingDelivery, selectedCurrency, sellError} = this.state;
    return (
      <main className="page-content edit-shopping-info-page">
        <Header title="Edit Products On Sale" />
        <Form onSubmit={this.sellProduct}>
          <div className="row">
            <div className="col">
              <div className="form-wrapp">
                <div className="row gx-3">
                  <div className="col-6">
                    <THInput
                      controlId="AvailableQuantity"
                      type="text"
                      id="availableQty"
                      name="availableQty"
                      class=""
                      isNumber={true}
                      placeholder="Available Quantity"
                      datavalue={sellProduct.availableQty}
                      inputChangeHandler={this.handleCallback}
                      errors_msg={sellError.availableQty}
                    />
                  </div>
                  <div className="col-6">
                    <THInput
                      controlId="MinimumOrderQuantity"
                      type="text"
                      id="minOrderQty"
                      name="minOrderQty"
                      class=""
                      placeholder="Minimum Order Quantity"
                      datavalue={sellProduct.minOrderQty}
                      inputChangeHandler={this.handleCallback}
                      errors_msg={sellError.minOrderQty}
                    />
                  </div>
                  <div className="col-6">
                    <THInput
                      controlId="Sell Price"
                      type="text"
                      name="price"
                      id="price"
                      class=""
                      placeholder="Price"
                      datavalue={sellProduct.price}
                      inputChangeHandler={this.handleCallback}
                      errors_msg={sellError.price}
                    />
                  </div>
                  <div className="col-md-6">
                    <THDatepicker
                      controlId="ExpiryDate"
                      labelClass="w-100 mb-0"
                      id="receptionDate"
                      class="form-control"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Expiry Date"
                      dataValue={sellProduct.receptionDate}
                      errorMessage={sellError.receptionDate}
                      parentDateCallback={(data) => this.handleDateCallback(data)}
                    />
                  </div>
                  <div className="col-md-12">
                    <THInput
                      controlId="Quality"
                      type="text"
                      name="quality"
                      id="quality"
                      class=""
                      placeholder="Quality"
                      datavalue={sellProduct.quality}
                      inputChangeHandler={this.handleCallback}
                      errors_msg={sellError.qQuality}
                    />
                  </div>
                  <div className="col-md-12">
                    <THSelect
                      controlId="packageAndDelivery"
                      labelName="Packaging & Delivery"
                      placeholder="Packaging Details"
                      name="packageAndDelivery"
                      options={Packaging}
                      id="packageAndDelivery"
                      className2="themis-select"
                      placeholder="Product Category"
                      options={Packaging}
                      inputChangeHandler={this.handlePackageCallbackSelect}
                      errors_msg={sellError.packageAndDelivery}
                      datavalue={selectedpackagingDelivery}
                    />
                  </div>
                  <div className="col-md-12">
                    <THSelect
                      controlId="BidCurrentPay"
                      labelName="What currency do you want to pay?"
                      className2="themis-select"
                      placeholder="$(Dollar)"
                      options={currency}
                      id="payCurrency"
                      name="payCurrency"
                      datavalue={selectedCurrency}
                      errors_msg={sellError.payCurrency}
                      inputChangeHandler={this.handleCurrencyCallbackSelect}
                    />
                  </div>
                  <div className="col-md-12">
                    <THGoogleAddress
                      controlId="BidLocation"
                      name="shipAddress"
                      class=""
                      classGroup="mb-3 pb-1"
                      isLable={true}
                      placeholder="Enter Delivery Location"
                      labelName="Shipping Address"
                      handleCallbackGoogle={this.handleCallbackGoogle}
                      errors_msg={sellError.shipAddress}
                      dataValue={sellProduct.shipAddress}
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
                          datavalue={sellProduct.zipCode}
                          inputChangeHandler={this.handleCallback}
                          errors_msg={sellError.zipCode}
                        />
                      </div>
                      <div className="col-md-4">
                        <THInput
                          controlId="BidCity"
                          type="text"
                          name="city"
                          id="city"
                          placeholder="City"
                          datavalue={sellProduct.city}
                          inputChangeHandler={this.handleCallback}
                          errors_msg={sellError.city}
                        />
                      </div>
                      <div className="col-md-4">
                        <THInput
                          controlId="BidCountry"
                          type="text"
                          name="country"
                          id="country"
                          placeholder="Country"
                          datavalue={sellProduct.country}
                          inputChangeHandler={this.handleCallback}
                          errors_msg={sellError.country}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <THFile
                      labelName="Upload Document or Photo"
                      id="docImage"
                      name="docImage"
                      type="file"
                      title=""
                      accept=".png,.jpg,.jpeg"
                      onChange={this.ImageCallback}
                      perentImageCallback={this.ImageCallback}
                      src={sellProduct.docImage}
                      errors_msg={sellError.docImage}
                    />
                  </div>
                </div>
                <THButton variant="none" className="primary-btn" type="submit" name="Update" />
              </div>
            </div>
          </div>
        </Form>
      </main>
    );
  }
}

EditSellProduct.propsType = {
  getSellProductDetail: PropTypes.func,
  userStatusChange: PropTypes.func,
  sellProductUpdate: PropTypes.func
};
const mapDispatchToProps = (dispatch) => ({
  getSellProductDetail: (data) => dispatch(getSellProductDetail(data)),
  sellProductUpdate: (data) => dispatch(sellProductUpdate(data))
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EditSellProduct);
