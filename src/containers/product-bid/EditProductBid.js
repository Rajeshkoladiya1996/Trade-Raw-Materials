import React from "react";
import { Form } from "react-bootstrap";
import THButton from "../../components/THButton/THButton";
import THInput from "../../components/THInput/THInput";
import THSelect from "../../components/THSelect/THSelect";
import Header from "../../components/header/Header";
import THGoogleAddress from "../../components/THGoogleAddress/THGoogleAddress";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { getBidProductDetail, bidProductUpdate } from "../../actions";
const Packaging = [
    { value: "Bulk", label: "Bulk" },
    { value: "Big Bag", label: "Big Bag" },
    { value: "Bag 15Kg", label: "Bag 15Kg" },
    { value: "Bag 25Kg", label: "Bag 25Kg" },
];

const currency = [
    { value: "dollar", label: "$(dollar)" },
    { value: "inr", label: "₹(INR)" },
];
const BidExpiration = [
    { value: "BidExpiration1", label: "Bid Expiration 1" },
    { value: "BidExpiration2", label: "Bid Expiration 2" },
    { value: "BidExpiration3", label: "Bid Expiration 3" },
    { value: "BidExpiration4", label: "Bid Expiration 4" },
];

class EditProductBid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBidExpiration: {},
            selectedpackagingDelivery: {},
            selectedCurrency: {},
            bideProduct: {
                bidExpiration: "",
                amount: "",
                packageAndDelivery: "",
                payCurrency: "",
                shipAddress: "",
                zipCode: "",
                city: "",
                country: "",
                latitude: "",
                longitude: "",
            },
            bideError: {
                bidExpiration: "",
                amount: "",
                packageAndDelivery: "",
                payCurrency: "",
                shipAddress: "",
                zipCode: "",
                city: "",
                country: "",
            },
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getBidProductDetail(id).then((resp) => {
            if (resp.ResponseCode) {
                const packagingDeliveryFiltered = Packaging.filter(
                    (item) => item.value === resp.data.packaging_delivery
                );
                const currencyFiltered = currency.filter(
                    (item) => item.value === resp.data.currency_pay
                );
                const bidExpirationFiltered = BidExpiration.filter(
                    (item) => item.value === resp.data.bid_expiration
                );

                this.setState({
                    isValidForm: true,
                    selectedpackagingDelivery: packagingDeliveryFiltered[0],
                    selectedCurrency: currencyFiltered[0],
                    selectedBidExpiration: bidExpirationFiltered[0],
                    bideProduct: {
                        ...this.state.bideProduct,
                        product_id: resp.data.uuid,
                        bidExpiration: resp.data.bid_expiration,
                        amount: resp.data.bid_amount,
                        packageAndDelivery: resp.data.packaging_delivery,
                        payCurrency: resp.data.currency_pay,
                        shipAddress: resp.data.pickup_address,
                        zipCode: resp.data.zipcode,
                        city: resp.data.city,
                        country: resp.data.country,
                        latitude: resp.data.latitude.toString(),
                        longitude: resp.data.longitude.toString(),
                    },
                });
            }
        });
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
                        bideProduct: {
                            ...this.state.bideProduct,
                            shipAddress: results[0].formatted_address,
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
                        bideProduct: {
                            ...this.state.bideProduct,
                            latitude: lat,
                            longitude: lng,
                        },
                    });
                });
        } else {
            this.setState({
                bideProduct: {
                    ...this.state.bideProduct,
                    latitude: "",
                    longitude: "",
                    shipAddress: "",
                    zipCode: "",
                    city: "",
                    country: "",
                },
            });
        }
    };
    handlePackageCallbackSelect = (event) => {
        let { value } = event;
        this.setState(
            {
                selectedpackagingDelivery: event,
                bideProduct: { ...this.state.bideProduct, packageAndDelivery: value },
            },
            () => {
                this.checkBidValidation();
            }
        );
    };
    handleCurrencyCallbackSelect = (event) => {
        let { value } = event;

        this.setState(
            {
                selectedCurrency: event,
                bideProduct: { ...this.state.bideProduct, payCurrency: value },
            },
            () => {
                this.checkBidValidation();
            }
        );
    };
    handleBidCallbackSelect = (event) => {
        let { value } = event;
        
        this.setState(
            {
                selectedBidExpiration: event,
                bideProduct: { ...this.state.bideProduct, bidExpiration: value },
            },
            () => {
                this.checkBidValidation();
            }
        );
    };
    handleCallback = (e) => {
        const { value, name } = e.target;

        this.setState(
            {
                bideProduct: { ...this.state.bideProduct, [name]: value },
            },
            () => {
                this.checkBidValidation();
            }
        );
    };
    checkBidValidation = () => {

        const { bideProduct, bideError } = this.state;

        const floatnumberRegx = /^[+-]?\d+(\.\d+)?$/;
        const numberRegx = /^\d+$/;
        const nameRegx = /^[a-zA-Z\s]+$/;
        if (
            bideProduct.amount === "" ||
            !floatnumberRegx.test(bideProduct.amount) ||
            bideProduct.bidExpiration === "" ||
            bideProduct.packageAndDelivery === "" ||
            bideProduct.payCurrency === "" ||
            bideProduct.shipAddress === "" ||
            bideProduct.city === "" ||
            bideProduct.zipCode === "" ||
            !numberRegx.test(bideProduct.zipCode) ||
            !nameRegx.test(bideProduct.country) ||
            !nameRegx.test(bideProduct.city) ||
            bideProduct.country === ""
        ) {

            this.setState({
                isValidForm: false,
                bideError: {
                    ...bideError,

                    amount:
                        bideProduct.amount === ""
                            ? "Amount is required"
                            : !floatnumberRegx.test(bideProduct.amount)
                                ? "Please enter only number."
                                : "",
                    packageAndDelivery:
                        bideProduct.packageAndDelivery === ""
                            ? "Package and delivery date field is required"
                            : "",
                    payCurrency:
                        bideProduct.payCurrency === ""
                            ? "payCurrency field is required"
                            : "",
                    shipAddress:
                        bideProduct.shipAddress === ""
                            ? "shipping address field is required"
                            : "",

                    city: 
                        bideProduct.city === ""
                        ? "City field is required" 
                        : !nameRegx.test(bideProduct.city)
                        ? "Invalid City"
                        :"",
                    country:
                        bideProduct.country === "" 
                        ? "Country field is required"
                        : !nameRegx.test(bideProduct.country)
                        ? "Invalid Country"
                        : "",
                    zipCode:
                        bideProduct.zipCode === "" 
                        ? "Zip Code field is required" 
                        : !numberRegx.test(bideProduct.zipCode)
                        ? "Please enter only number."
                        : ""

                },
            });
        } else {
            this.setState({
                isValidForm: true,
                bideError: {
                    ...bideError,
                    amount: "",
                    packageAndDelivery: "",
                    payCurrency: "",
                    shipAddress: "",
                    zipCode: "",
                    city: "",
                    country: "",
                    docImage: "",
                },
            });
        }
    };
    bideProduct =async (e) => {
        e.preventDefault();

        await this.checkBidValidation();
        const { bideProduct, isValidForm } = this.state;
        if (isValidForm) {
            let bideProductData = {
                id: bideProduct.product_id,
                bid_expiration: bideProduct.bidExpiration,
                bid_amount: bideProduct.amount,
                packaging_delivery: bideProduct.packageAndDelivery,
                currency_pay: bideProduct.payCurrency,
                pickup_address: bideProduct.shipAddress,
                zipcode: bideProduct.zipCode,
                city: bideProduct.city,
                country: bideProduct.country,
                latitude: bideProduct.latitude.toString(),
                longitude: bideProduct.longitude.toString(),
            }
            this.props.bidProductUpdate(bideProductData).then((resp) => {
                if (resp && resp.ResponseCode === 1) {
                    toast.success("Bid product Updated successfully");
                    this.props.history.push("/product-bid-list");

                } else {
                    toast.error(resp.message);
                }
            });
        }
    };

    render() {
        const {
            bideProduct,
            bideError,
            selectedBidExpiration,
            selectedpackagingDelivery,
            selectedCurrency,
        } = this.state;

        return (
            <main className="page-content edit-shopping-info-page">
                <Header title="Edit Bid Products" />
                <Form onSubmit={this.bideProduct}>
                    <div className="form-wrapp">
                        <div className="row gx-3">
                            <div className="col-12">
                                <Form.Group className="mb-0">
                                    <Form.Label>Bid Amount</Form.Label>
                                </Form.Group>
                            </div>
                            <div className="col-md-12">
                                <THInput
                                    controlId="amount"
                                    id="amount"
                                    name="amount"
                                    placeholder="Enter Bid Amount"
                                    datavalue={bideProduct.amount}
                                    type="text"
                                    inputChangeHandler={this.handleCallback}
                                    errors_msg={bideError.amount}
                                />
                            </div>
                            <div className="col-md-12">
                                <THSelect
                                    controlId="BidExpiration"
                                    labelName="Bid Expiration"
                                    placeholder="Bid Expiration"
                                    name="bidExpiration"
                                    options={Packaging}
                                    id="bidExpiration"
                                    className2="themis-select"
                                    options={BidExpiration}
                                    inputChangeHandler={this.handleBidCallbackSelect}
                                    errors_msg={bideError.bidExpiration}
                                    datavalue={selectedBidExpiration}
                                />
                            </div>

                            <div className="col-md-12">
                                <THSelect
                                    controlId="BidPackagingDelivery"
                                    labelName="Packaging & Delivery"
                                    className2="themis-select"
                                    classNamePrefix="themis-select"
                                    placeholder="Packaging Details"
                                    id="packageAndDelivery"
                                    name="packageAndDelivery"
                                    options={Packaging}
                                    inputChangeHandler={this.handlePackageCallbackSelect}
                                    errors_msg={bideError.packageAndDelivery}
                                    datavalue={selectedpackagingDelivery}
                                />
                            </div>
                            <div className="col-md-12">
                                <THSelect
                                    controlId="BidCurrentPay"
                                    labelName="What currency do you want to pay?"
                                    classNamePrefix="themis-select"
                                    placeholder="$(Dollar)"
                                    className2="themis-select"
                                    options={currency}
                                    id="payCurrency"
                                    name="payCurrency"
                                    inputChangeHandler={this.handleCurrencyCallbackSelect}
                                    errors_msg={bideError.currency}
                                    datavalue={selectedCurrency}
                                />
                            </div>
                            <div className="col-md-12">
                                <THGoogleAddress
                                    controlId="BidLocation"
                                    name="shipAddress"
                                    class=""
                                    classGroup="mb-3 pb-1"
                                    placeholder="Enter Delivery Location"
                                    isLable={true}
                                    labelName="Shipping Address"
                                    handleCallbackGoogle={this.handleCallbackGoogle}
                                    dataValue={bideProduct.shipAddress}
                                    errors_msg={bideError.shipAddress}
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
                                            isLable={false}
                                            datavalue={bideProduct.zipCode}
                                            inputChangeHandler={this.handleCallback}
                                            errors_msg={bideError.zipCode}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <THInput
                                            controlId="BidCity"
                                            type="text"
                                            name="city"
                                            id="city"
                                            placeholder="City"
                                            isLable={false}
                                            datavalue={bideProduct.city}
                                            inputChangeHandler={this.handleCallback}
                                            errors_msg={bideError.city}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <THInput
                                            controlId="BidCountry"
                                            type="text"
                                            name="country"
                                            id="country"
                                            placeholder="Country"
                                            isLable={false}
                                            datavalue={bideProduct.country}
                                            inputChangeHandler={this.handleCallback}
                                            errors_msg={bideError.country}
                                        />
                                    </div>
                                </div>
                            </div>

                            <THButton
                                variant="none"
                                className="primary-btn"
                                type="submit"
                                name="Update"
                            />
                        </div>
                    </div>
                </Form>
            </main>
        );
    }
}

EditProductBid.propsType = {
    getBidProductDetail: PropTypes.func,
    bidProductUpdate: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
    getBidProductDetail: (data) => dispatch(getBidProductDetail(data)),
    bidProductUpdate: (data) => dispatch(bidProductUpdate(data)),
});
const mapStateToProps = (status) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(EditProductBid);
