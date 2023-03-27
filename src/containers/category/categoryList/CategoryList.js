import React from "react";
import Header from "../../../components/header/Header";
import THProductStatusModal from "../../../components/THmodal/THProductStatusModal.js";
import THDeleteModal from "../../../components/THmodal/THDeleteProductModal.js";
import {Link} from "react-router-dom";
import THDatatable from "../../../components/THdatatable/THDatatable";
import {getallCategoryList, categoryStatusChange,categoryAdd,categoryDetail,categoryUpdate,categoryDetele } from "../../../actions";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {toast} from "react-toastify";
import cx from "classnames";
import ModalForm from "../../../components/THmodal/THModalForm";

class CategoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryListModalShow: false,
      addCategoryModalShow: false,
      deleteModalShow: false,
      isLoading: true,
      cateId: "",
      cateIndex: "index",
      categoryList: [],
      name:"",
      categoryNameError:"",
      isValidForm:false,
      title:"Add Category"
    };
  }

  getallCategoryList = ()=>{
    this.props.getallCategoryList("").then((resp) => {
      if (resp && resp.ResponseCode === 1) {
        this.setState({
          isLoading: false,
          categoryList: resp.data,
        });
      }
    });
  }
  
  componentDidMount() {
    this.getallCategoryList();
  }

  setCategoryListModalShow = (e, id, index, status) => {
    e.preventDefault();
    this.setState({
      cateId: id,
      cateIndex: index,
      status: status,
      categoryListModalShow: !this.state.categoryListModalShow,
    });
  };

  chengeStatus = (status) => {
    const {cateId} = this.state;
    if (status === 1) {
      this.props.categoryStatusChange(cateId).then(async (resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success("Category status change successfully.");
          this.props.getallCategoryList("").then((resp) => {
            if (resp && resp.ResponseCode === 1) {
              this.setState({
                isLoading: false,
                categoryList: resp.data,
              });
            }
          });
        }
      });
    }
    this.setState({
      cateId: "",
      prodIndex: "",
      categoryListModalShow: !this.state.categoryListModalShow,
    });
  };
  CategoryModal = (data) => {
    this.setState({
      addCategoryModalShow: !this.state.addCategoryModalShow,
      name:"",
      categoryNameError:"",
    });
  };
  setDeleteModalShow = (e, id, index) => {
    e.preventDefault();
    this.setState({
      cateId: id,
      prodIndex: index,
      deleteModalShow: !this.state.deleteModalShow,
    });
  };

  deleteProduct = (status) => {
    const {cateId} = this.state;
    if (status === 1) {
      this.props.categoryDetele(cateId).then((resp) => {
        if (resp && resp.ResponseCode === 1) {
          toast.success("Category delete successfully.");
          this.getallCategoryList();
        }
      });
    }
    this.setState({
      cateId: "",
      prodIndex: "",
      deleteModalShow: !this.state.deleteModalShow,
    });
  };

  showCategoryModal = (e,title,id) => {
    this.setState({
      title:title
    });
    this.props.categoryDetail(id).then((resp)=>{
      if (resp && resp.ResponseCode === 1) {
        this.setState({
          name:resp.data.name,
          cateId:resp.data.uuid
        });
      }
    })
    e.preventDefault();
    this.setState({addCategoryModalShow: true});
  };

  hadleButtonClick = (e,title) => {
    this.setState({
      addCategoryModalShow: !this.state.addCategoryModalShow,
      title:title
    });
  };

  inputChangeHandler = (e) =>{
    this.setState({
      name:e.target.value
    },()=>{
      this.checkValidation();
    });
  }

  checkValidation = ()=>{
    const {name}=this.state;
    if (name === ""){
      this.setState({
        isValidForm:false,
        categoryNameError:"This field is Required"
      });
    }else{
      this.setState({
        isValidForm:true,
        categoryNameError:""
      });
    }
  }
  submitCategory =async (e,title) =>{
    e.preventDefault();
    await this.checkValidation();
    const {isValidForm,name,cateId}=this.state;
    // Add Category
    if(title === "Add Category"){
      if (isValidForm) {
        this.props.categoryAdd(name).then((resp)=>{
          if(resp && resp.data && resp.data.ResponseCode === 1){
            toast.success(resp.data.message);
            this.getallCategoryList();
            this.setState({
              addCategoryModalShow: !this.state.addCategoryModalShow,
              name:"",
              categoryNameError:"",
            });
          }else{
            this.setState({
              categoryNameError:resp.data.message
            });
          }
        })
      }
    }
    //Edit Category
    else{
      if (isValidForm) {
        this.props.categoryUpdate({name,cateId}).then((resp)=>{
          if(resp && resp.ResponseCode === 1){
            toast.success(resp.message);
            this.getallCategoryList();
            this.setState({
              addCategoryModalShow: !this.state.addCategoryModalShow,
              name:"",
              categoryNameError:"",
            });
          }else{
            this.setState({
              categoryNameError:resp.data.message
            });
          }
        })
      }
    }
  }

  render() {
    const {status, categoryList,categoryNameError,name} = this.state;

    const columns = [
      {
        dataField: "name",
        text: "Name",
        sort: true,
        headerStyle: () => {
          return {width: "30%"};
        },
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            <div className="open-orders-wrap">
              <div className="order-info-wrap">
                <div className="order-details">
                  <h4>{row.name}</h4>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        dataField: "Status",
        text: "Status",
        editable: true,
        formatter: (cell, row, rowIndex, formatExtraData) => {
          return (
            <Link
              to="#"
              className={cx("action-link", {"status-green": row.status, "text-danger": !row.status})}
              onClick={(e) => this.setCategoryListModalShow(e, row.uuid, rowIndex, row.status)}
            >
              {row.status ? "Active" : "De-Active"}
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
              <Link to="#" onClick={(e)=>this.showCategoryModal(e,'Edit Category',row.uuid)} className="action-link me-2">
                Edit
              </Link>
              <Link to="#" onClick={(e) => this.setDeleteModalShow(e, row.uuid)} className="action-link text-danger">
                Delete
              </Link>
            </div>
          );
        },
      },
    ];
    // {"/category/" + row.uuid + "/edit"}
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

    const statusText = `Are you sure, you want to  ${status || status === true ? "De-active" : "Active"} category ?`;

    return (
      <main className="page-content admin-products-list text-left">
        <Header title="Category List" />

        <div className="main-content">
          {/* <Link onClick={this.showCategoryModal} className="table-option-btn ms-auto">
            Add Category
          </Link> */}
          <THDatatable
            name="name"
            paginationOptions={paginationOptions}
            columns={columns}
            dataList={categoryList}
            isButtonVisible={true}
            btnLabelText="Add Category"
            hadleButtonClick={this.hadleButtonClick}
          />
        </div>
        <ModalForm
          CategoryModalText={this.state.title}
          show={this.state.addCategoryModalShow}
          inputChangeHandler={this.inputChangeHandler}
          onHideModal={(status) => this.CategoryModal(status)}
          errors_msg={categoryNameError}
          datavalue={name}
          submitCategory={this.submitCategory}
        ></ModalForm>
        <THProductStatusModal 
        statustext={statusText} 
        show={this.state.categoryListModalShow} 
        onHide={(status) => this.chengeStatus(status)} />
        <THDeleteModal 
          show={this.state.deleteModalShow} 
          onHide={(status) => this.deleteProduct(status)} />
      </main>
    );
  }
}
CategoryList.propsType = {
  getallCategoryList: PropTypes.func,
  categoryStatusChange: PropTypes.func,
  categoryAdd:PropTypes.func,
  categoryDetail:PropTypes.func,
  categoryUpdate:PropTypes.func,  
  categoryDetele:PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  getallCategoryList: (data) => dispatch(getallCategoryList(data)),
  categoryStatusChange: (data) => dispatch(categoryStatusChange(data)),
  categoryAdd:(data)=>dispatch(categoryAdd(data)),
  categoryDetail:(data)=>dispatch(categoryDetail(data)),
  categoryUpdate:(data)=>dispatch(categoryUpdate(data)),
  categoryDetele:(data)=>dispatch(categoryDetele(data))
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
