import React from "react";
import Header from "../../components/header/Header";
import { Link } from "react-router-dom";
import THDatatable from "../../components/THdatatable/THDatatable";
import { getWarehouseList, warehouseDelete, warehouseStatusChange } from "../../actions";
import THDeleteModal from "../../components/THmodal/THDeleteProductModal";
import THProductStatusModal from "../../components/THmodal/THProductStatusModal.js";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import cx from "classnames";
import { toast } from "react-toastify";

class WarehouseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      deleteModalShow: false,
      productListModalShow: false,
      warehouseList: [],
      warehouseId: ""
    };
  }

  componentDidMount() {
    this.warehouseList();
  }
  warehouseList = () => {
    this.props.getWarehouseList("").then((resp) => {
      if (resp && resp.ResponseCode === 1) {
        this.setState({
          isLoading: false,
          warehouseList: resp.data,
        });
      }
    });
  }

  setDeleteModalShow = (e, id, index) => {
    e.preventDefault();
    this.setState({
      warehouseId: id,
      deleteModalShow: !this.state.deleteModalShow,
    });
  };

  deleteWarehouse = (status) => {
    const { warehouseId } = this.state;
    if (status === 1) {
      this.props.warehouseDelete(warehouseId).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          this.warehouseList();
          toast.success("Warehouse deleted successfully.");
        }
      });
    }
    this.setState({
      warehouseId: "",
      deleteModalShow: !this.state.deleteModalShow,
    });
  };
  setProductListModalShow = (e, id, index, status) => {
    e.preventDefault();
    this.setState({
      warehouseId: id,
      status: status,
      productListModalShow: !this.state.productListModalShow,
    });
  };
  hadleButtonClick = () => {
    this.props.history.push("/warehouse/add");
  };
  chengeStatus = (status) => {
    const { warehouseId } = this.state;
    if (status === 1) {
      this.props.warehouseStatusChange(warehouseId).then(async (resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success("Warehouse status chnage successfully.");
          this.warehouseList();
        }
      });
    }
    this.setState({
      warehouseId: "",
      productListModalShow: !this.state.productListModalShow,
    });
  };
  render() {
    const { warehouseList, status } = this.state;

    const columns = [
      {
        dataField: "name",
        text: "Name",
        sort: true,
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            <h4>
              {row.name}
            </h4>
          );
        },
      },
      {
        dataField: "price",
        text: "Price",
      },
      {
        dataField: "currency_pay",
        text: "Currency",
      },
      {
        dataField: "address",
        text: "Location",
      },
      {
        dataField: "Status",
        text: "Status",
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            <Link
              to="#"
              className={cx("action-link", {
                "status-green": row.status,
                "text-danger": row.status!=1,
              })}
              onClick={(e) =>
                this.setProductListModalShow(e, row.uuid, rowIndex, row.status)
              }>
              {row.status!=0 ? "Active" : "De-Active"}
            </Link>
          );
        },
      },
      {
        dataField: "Action",
        text: "Action",
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            <div className="d-flex align-items-center">
              <Link to={"/warehouse/" + row.uuid + "/edit"} className="action-link me-2">
                Edit
              </Link>
              <Link
                to="#"
                onClick={(e) => this.setDeleteModalShow(e, row.uuid)}
                className="action-link text-danger">
                Delete
              </Link>
            </div>
          );
        },
      },
    ];

    const paginationOptions = {
      withFirstAndLast: false,
      hidePageListOnlyOnePage: true,
      showTotal: true,
      hideSizePerPage: true,
      sizePerPage: 10,
      alwaysShowAllBtns: true,
      prePageText: <i className="ri-arrow-left-s-line"></i>,
      nextPageText: <i className="ri-arrow-right-s-line"></i>,
    };
    const statusText = `Are you sure, you want to  ${status || status === true ? "De-active" : "Active"} warehouse ?`;
    return (

      <main className="page-content admin-products-list text-left">
        <Header title="Warehouse List" />
        <div className="main-content">
          <THDatatable
            name="ItemName"
            paginationOptions={paginationOptions}
            columns={columns}
            dataList={warehouseList}
            isButtonVisible={true}
            btnLabelText="Add Warehouse"
            hadleButtonClick={this.hadleButtonClick}
          />
        </div>
        <THDeleteModal show={this.state.deleteModalShow} onHide={(status) => this.deleteWarehouse(status)} />
        <THProductStatusModal statustext={statusText} show={this.state.productListModalShow} onHide={(status) => this.chengeStatus(status)} />
      </main>
    );
  }
}
WarehouseList.propsType = {
  getWarehouseList: PropTypes.func,
  warehouseDelete: PropTypes.func,
  warehouseStatusChange: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  getWarehouseList: (data) => dispatch(getWarehouseList(data)),
  warehouseDelete: (data) => dispatch(warehouseDelete(data)),
  warehouseStatusChange: (data) => dispatch(warehouseStatusChange(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseList);
