import React from "react";
import { Form } from "react-bootstrap";
import THButton from "../../components/THButton/THButton";
import THInput from "../../components/THInput/THInput";
import THDatepicker from "../../components/THDatepicker/THDatepicker";
import THSelect from "../../components/THSelect/THSelect";
import Header from "../../components/header/Header";
import { getWareProductDetail, warehouseProductUpdate, getWarehouseList } from "../../actions";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

class EditWarehouseProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidForm: true,
      warehouseList: [],
      selectedWarehouse: "",
      sellProduct: {
        product_id: "",
        availableQty: "",
        minOrderQty: "",
        price: "",
        expiryDate: new Date(),
        quality: "",
      },
      sellError: {
        availableQty: "",
        minOrderQty: "",
        price: "",
        expiryDate: "",
        quality: "",
      },
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.getWarehouseList().then((resp) => {
      if (resp.ResponseCode) {
        if (resp.data) {
          this.setState({
            warehouseList: resp.data.map((item) => {
              var res = {
                "label": item.name + " - " + item.address,
                "value": item.id
              }
              return res
            })
          })
        }

      }
    });

    this.props.getWareProductDetail(id).then((resp) => {
      if (resp.ResponseCode) {
        const { warehouseList } = this.state;
        const warehouseFiltered = warehouseList.filter(
          (item) => item.value === resp.data.warehouse.id
        );
        this.setState({
          isValidForm: true,
          selectedWarehouse: warehouseFiltered[0],
          sellProduct: {
            ...this.state.sellProduct,
            product_id: resp.data.uuid,
            warehouse_id: resp.data.warehouse_id,
            availableQty: resp.data.availble_quantity,
            minOrderQty: resp.data.min_order_quantity,
            price: resp.data.price,
            expiryDate: new Date(resp.data.expiry_date),
            quality: resp.data.quality,
          },
        });
      }
    });
  }
  handleWarehouseCallback(name, data) {
    this.setState({
      selectedWarehouse: name,
      sellProduct: { ...this.state.sellProduct,"warehouse_id": name.value },
    },
      () => {
        this.checkSellerValidation();
      });
  }

  handleDateCallback = (date) => {
    this.setState(
      {
        sellProduct: { ...this.state.sellProduct, expiryDate: date },
      },
      () => {
        this.checkSellerValidation();
      }
    );
  };

  handleCallback = (e) => {
    const { value, name } = e.target;

    this.setState(
      {
        sellProduct: { ...this.state.sellProduct, [name]: value },
      },
      () => {
        this.checkSellerValidation();
      }
    );
  };

  checkSellerValidation = () => {
    console.log(this.state);
    const { sellProduct, sellError } = this.state;
    const numberRegx = /^[0-9\b]+$/;
    if (
      sellProduct.availableQty === "" ||
      sellProduct.warehouse_id === "" ||
      sellProduct.minOrderQty === "" ||
      !numberRegx.test(sellProduct.minOrderQty) ||
      sellProduct.price === "" ||
      !numberRegx.test(sellProduct.price) ||
      sellProduct.quality === "" ||
      !numberRegx.test(sellProduct.quality) ||
      sellProduct.expiryDate === ""
    ) {
      this.setState({
        isValidForm: false,
        sellError: {
          ...sellError,
          availableQty:
            sellProduct.availableQty === ""
              ? "Quantity is required"
              : "",
          price:
            sellProduct.price === ""
              ? "Price is required"
              : !numberRegx.test(sellProduct.price)
                ? "Please enter only number."
                : "",
          quality:
            sellProduct.quality === ""
              ? "Quality is required"
              : !numberRegx.test(sellProduct.quality)
                ? "Please enter only number."
                : "",
          warehouse_id:
            sellProduct.warehouse_id === ""
              ? "Warehouse field is required"
              : "",
          minOrderQty:
            sellProduct.minOrderQty === ""
              ? "MinOrder quantity is required"
              : !numberRegx.test(sellProduct.minOrderQty)
                ? "Please enter only number."
                : sellProduct.minOrderQty > sellProduct.availableQty
                  ? "Minimum quantity less than available quantity"
                  : "",
          expiryDate:
            sellProduct.expiryDate === ""
              ? "Expiry date field is required"
              : "",
        },
      });
    } else {
      this.setState({
        isValidForm: true,
        sellError: {
          ...sellError,
          product_id: "",
          availableQty: "",
          minOrderQty: "",
          quality: "",
          price: "",
          expiryDate: "",
          warehouse_id: "",
        },
      });
    }
  };

  sellProduct = async (e) => {
    e.preventDefault();

    await this.checkSellerValidation();
    const { sellProduct, sellError, isValidForm } = this.state;

    if (isValidForm) {
      let sellProductData = {
        id: sellProduct.product_id,
        availble_quantity: sellProduct.availableQty,
        min_order_quantity: sellProduct.minOrderQty,
        price: sellProduct.price,
        expiry_date: sellProduct.expiryDate,
        quality: sellProduct.quality,
        warehouse_id: sellProduct.warehouse_id,
      }
    
      this.props.warehouseProductUpdate(sellProductData).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success("sell product successfully");
          this.props.history.push("/sell-product");

        } else {
          toast.error(resp.message);
        }
      });
    }
  };
  render() {
    const { sellProduct, sellError, warehouseList, selectedWarehouse } = this.state;

    return (
      <main className="page-content edit-shopping-info-page">
        <Header title="Edit Products On Sale" />
        <Form onSubmit={this.sellProduct}>
          <div className="row gx-5">
            <div className="col">
              <div className="form-wrapp">
                <div className="row gx-3">
                  <div className="col-6">
                    <THSelect
                      className2="themis-select"
                      controlId="Warehouse"
                      labelName="Which Warehouse do you want?"
                      placeholder="Warehouse"
                      options={warehouseList}
                      id="Warehouse"
                      name="warehouse_id"                      inputChangeHandler={(name, value) =>
                        this.handleWarehouseCallback(name, value)
                      }
                      datavalue={selectedWarehouse}
                      errorMessage={sellError.warehouse_id}

                    />
                  </div>
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
                      dataValue={sellProduct.expiryDate}
                      errorMessage={sellError.expiryDate}
                      parentDateCallback={(data) => this.handleDateCallback(data)}
                    />
                  </div>
                  <div className="col-md-6">
                    <THInput
                      controlId="Quality"
                      type="text"
                      name="quality"
                      id="quality"
                      class=""
                      placeholder="Quality"
                      datavalue={sellProduct.quality}
                      inputChangeHandler={this.handleCallback}
                      errors_msg={sellError.quality}
                    />
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
        </Form>
      </main>
    );
  }
}

EditWarehouseProduct.propsType = {
  getWareProductDetail: PropTypes.func,
  userStatusChange: PropTypes.func,
  warehouseProductUpdate: PropTypes.func,
  getWarehouseList: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
  getWareProductDetail: (data) => dispatch(getWareProductDetail(data)),
  warehouseProductUpdate: (data) => dispatch(warehouseProductUpdate(data)),
  getWarehouseList: (data) => dispatch(getWarehouseList(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EditWarehouseProduct);