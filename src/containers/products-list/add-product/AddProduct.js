import React, { Component } from "react";
import { Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Header from "../../../components/header/Header";
import THInput from "../../../components/THInput/THInput";
import THButton from "../../../components/THButton/THButton";
import THSelect from "../../../components/THSelect/THSelect";
import {
	getcategoryList,
	productStore,
	getproductDetail,
	productUpdate,
} from "../../../actions";

class AddProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isTitle: "Add",
			isImagePreview: "",
			isLoading: true,
			isValidForm: true,
			categoryList: [],
			product: {
				image: "",
				name: "",
				category_id: "",
				description: "",
				min_quality: "",
				max_quality: "",
			},
			emailErrMsg: "",
			passwordErrMsg: "",
			isError: false,
			selectedCategory: {},
			errors: {
				image: "",
				name: "",
				category: "",
				description: "",
				min_quality: "",
				max_quality: "",
			},
		};
	}

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

	previewImage = async (e) => {
		const file = e.target.files[0];
		if (file !== undefined) {
			var fileType = file.type.split("/").pop().toLowerCase();
			if (fileType !== "jpeg" && fileType !== "jpg" && fileType !== "png") {
				this.setState({
					errors: {
						...this.state.errors,
						image: "Please select a valid image file",
					},
					product: {
						...this.state.product,
						image: "",
					},
					isImagePreview: "",
				});
			} else {
				const base64Image = await this.getBase64Image(file);
				this.setState({
					isImagePreview: base64Image,
					product: {
						...this.state.product,
						image: base64Image,
					},
					errors: {
						...this.state.errors,
						image: "",
					},
				});
			}
		}
	};

	handleSubmit = (files, allFiles) => {
		allFiles.forEach((f) => f.remove());
	};

	componentDidMount() {

		if (this.props.match.params.id !== undefined) {
			this.setState({
				isTitle: "Edit",
			});
			const { product } = this.state;
			this.props.getproductDetail(this.props.match.params.id).then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					this.props.getcategoryList("").then((resp1) => {
						if (resp1 && resp1.ResponseCode === 1) {
							this.setState(
								{
									isLoading: false,
									categoryList: resp1.data,
								},
								() => {
									const { categoryList } = this.state;
									const filtered = categoryList.filter(
										(item) => item.value === resp.data.category_id
									);
									this.setState({
										isLoading: false,
										selectedCategory: filtered[0],
										product: {
											...product,
											name: resp.data.name,
											category_id: resp.data.category_id,
											description: resp.data.description,
											min_quality: resp.data.min_quality,
											max_quality: resp.data.min_quality,
											id: resp.data.id,
										},
										isImagePreview: resp.data.image,
									});
								}
							);
						}
					});
				} else {
					this.props.history.push("/products");
				}
			});
		} else {
			this.props.getcategoryList("").then((resp) => {
				if (resp && resp.ResponseCode === 1) {
					this.setState({
						isLoading: false,
						categoryList: resp.data,
					});
				}
			});
		}
	}

	inputChangeHandler = (event) => {
		let { value, name } = event.target;
		value = value ? value.trimStart() : "";

		this.setState({
			product: { ...this.state.product, [name]: value },
		}, () => {
			this.checkValidation();
			console.log(this.state)
		});
	};
	inputSelectHandler = (event) => {
		let { value } = event;
		this.setState(
			{
				selectedCategory: event,
				product: { ...this.state.product, category_id: value },
			},
			() => {
				this.checkValidation();
			}
		);
	};

	checkValidation = () => {
		const { product, errors } = this.state;

		if (this.state.isTitle === "Add") {
			if (product.image === "") {
				this.setState({
					isValidForm: false,
					errors: {
						...errors,
						image: product.image === "" ? "Image field is required" : "",
					},
				});
			} else {
				this.setState({
					isValidForm: true,
					errors: {
						...errors,
						image: "",
					},
				});
			}
		}
		const numberRegx = /^[0-9\b]+$/;
		if (
			product.name === "" ||
			product.category_id === "" ||
			product.description === "" ||
			product.min_quality === "" ||
			!numberRegx.test(product.min_quality) ||
			product.max_quality === "" ||
			!numberRegx.test(product.max_quality)
		) {
			this.setState({
				isValidForm: false,
				errors: {
					...errors,
					name: product.name === "" ? "Name is required" : "",
					category: product.category_id === "" ? "Category is required" : "",
					description:
						product.description === "" ? "Description is required" : "",
					min_quality: product.min_quality === "" 
						? "Minimum Quality field is required" :
							!numberRegx.test(product.min_quality) 
								? "Please enter only number." : "",
					max_quality: product.max_quality === "" 
						? "Maximum Quality field is required" : 
							!numberRegx.test(product.max_quality) 
								? "Please enter only number." : "",
				},
			});
		} else {
			this.setState({
				isValidForm: true,
				errors: {
					...errors,
					name: "",
					category: "",
					description: "",
				},
			});
		}
	};

	addProduct = async (e) => {
		e.preventDefault();
		const { product, errors } = this.state;
		await this.checkValidation();
		if (this.state.isTitle === "Add") {
			if (product.image === "") {
				this.setState({
					isValidForm: false,
				});
			}
		}

		if (
			product.name === "" ||
			product.category_id === "" ||
			product.description === ""
		) {
			this.setState({
				isValidForm: false,
			});
		} else {
			this.setState({
				isValidForm: true,
			});
		}

		if (this.state.isValidForm) {
			// Add Products
			if (this.state.isTitle === "Add") {
				this.props.productStore(product).then((resp) => {

					if (resp && resp.data && resp.data.ResponseCode === 1) {

						toast.success("Product added successfully.");
						setTimeout(() => {
							this.props.history.push("/products");
						}, 500);
					} else {
						this.setState({
							errors: {
								...errors,
								name: resp.data.message,
							},
						});
					}
				});
			} else {
				// Update Product detail
				this.props.productUpdate(product).then((resp) => {
					if (resp && resp.ResponseCode === 1) {
						toast.success("Product update successfully.");
						this.setState({
							product: {
								image: "",
								name: "",
								category_id: "",
								description: "",
							},
						});
						setTimeout(() => {
							this.props.history.push("/products");
						}, 500);
					} else {
						this.setState({
							errors: {
								...errors,
								name: resp.message,
							},
						});
					}
				});
			}
		}
	};

	render() {
		const stylingDropdown = {
			control: (styles) => ({ ...styles, backgroundColor: "#f5f8fa" }),
			option: (styles, { isFocused, isSelected, isActive, isVisited }) => {
				return {
					...styles,
					backgroundColor: isActive
						? "#7d91b2"
						: isSelected
							? "#d9ebf7"
							: isVisited
								? "#7d91b2"
								: isFocused
									? "#f5f8fa"
									: null,
				};
			},
		};

		const { categoryList, product, errors, selectedCategory } = this.state;
		return (
			<main className="page-content add-product-page">
				<Header title={this.state.isTitle + " Product"} />

				<div className="main-content">
					<div className="form-wrapp mt-0">
						<Form onSubmit={this.addProduct}>
							<Row>
								<div className="col-12">
									<Form.Group>
										<Form.Label>Upload Product Image</Form.Label>
										<div
											className={`themis-custom-file ${this.state.isImagePreview && "img-preview"
												}`}>
											<label
												htmlFor="uploadProductImage"
												className="themis-img-preview">
												<img
													src={this.state.isImagePreview}
													alt=""
													className="img-fluid img-contain"
												/>
												<span className="themis-lbl-text">
													Click here to upload your .png, .jpg, .jpeg product
													image.
												</span>
											</label>
											<div className="themis-file-inputbox">
												<input
													id="uploadProductImage"
													type="file"
													title=""
													onChange={this.previewImage}
													accept=".png,jpg,jpeg"
												/>
											</div>
										</div>
										<span className="error-msg">{errors.image}</span>
									</Form.Group>
								</div>
								<div className="col-12">
									<THInput
										name="name"
										placeholder="Product Name"
										errors_msg={errors.name}
										inputChangeHandler={this.inputChangeHandler}
										datavalue={product.name}
									/>
								</div>

								<div className="col-12">
									<THSelect
										name="category"
										className2="themis-select"
										placeholder="Product Category"
										options={categoryList}
										inputChangeHandler={this.inputSelectHandler}
										styles={stylingDropdown}
										errors_msg={errors.category}
										datavalue={selectedCategory}
									/>
								</div>
								<div className="col-12">
									<THInput
										id="MinQuality"
										name="min_quality"
										placeholder="Minimum Quality"
										inputChangeHandler={this.inputChangeHandler}
										errors_msg={errors.min_quality}
										datavalue={product.min_quality}
									/>
								</div>
								<div className="col-12">
									<THInput
										id="MaxQuality"
										name="max_quality"
										placeholder="Maximum Quality"
										inputChangeHandler={this.inputChangeHandler}
										errors_msg={errors.max_quality}
										datavalue={product.max_quality}
									/>
								</div>
								<div className="col-12">
									<THInput
										id="Description"
										name="description"
										placeholder="Description"
										as="textarea"
										rows={10}
										type="textarea"
										inputChangeHandler={this.inputChangeHandler}
										errors_msg={errors.description}
										datavalue={product.description}
									/>
								</div>

							</Row>
							<THButton
								variant="none"
								className="primary-btn"
								type="submit"
								name="Save"
							/>
							<Link to="/products" className="btn secondary-btn">
								{" "}
								Cancel{" "}
							</Link>
						</Form>
					</div>
				</div>
			</main>
		);
	}
}

AddProduct.propsType = {
	getcategoryList: PropTypes.func,
	productStore: PropTypes.func,
	getproductDetail: PropTypes.func,
	productUpdate: PropTypes.func,
};
const mapDispatchToProps = (dispatch) => ({
	getcategoryList: (data) => dispatch(getcategoryList(data)),
	productStore: (data) => dispatch(productStore(data)),
	getproductDetail: (data) => dispatch(getproductDetail(data)),
	productUpdate: (data) => dispatch(productUpdate(data)),
});
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
