import React from "react";
import {Button, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import Select from "react-select";
import Header from "../../components/header/Header";

const stylingDropdown = {
  control: (styles) => ({...styles, backgroundColor: "#f5f8fa"}),
  option: (styles, {isFocused, isSelected, isActive, isVisited}) => {
    return {
      ...styles,
      backgroundColor: isActive ? "#7d91b2" : isSelected ? "#d9ebf7" : isVisited ? "#7d91b2" : isFocused ? "#f5f8fa" : null,
    };
  },
};
const countryName = [
  {value: "india", label: "India"},
  {value: "pakistan", label: "Pakistan"},
  {value: "srilanka", label: "Sri Lanka"},
  {value: "bangladesh", label: "BanglaDesh"},
];
const stateName = [
  {value: "gujarat", label: "Gujarat"},
  {value: "telangana", label: "Telangana"},
  {value: "tamilnadu", label: "Tamilnadu"},
  {value: "rajasthan", label: "Rajasthan"},
];
const cityName = [
  {value: "suraj", label: "Suraj"},
  {value: "chennai", label: "Chennai"},
  {value: "mumbai", label: "Mumbai"},
  {value: "delhi", label: "Delhi"},
];
class EditShippingInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main className="page-content edit-shopping-info-page">
        <Header title="Settings" />
        <div className="form-wrapp">
          <Form action="">
            <h4>Shipping Info</h4>
            <div className="row gx-3">
              <div className="col-md-6">
                <Form.Group controlId="FirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="First Name" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="LastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Last Name" />
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group controlId="Address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows={2} placeholder="Address" />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="Country">
                  <Form.Label>Country</Form.Label>
                  <Select classNamePrefix="themis-select" placeholder="Select Country" options={countryName} styles={stylingDropdown} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="State">
                  <Form.Label>State</Form.Label>
                  <Select classNamePrefix="themis-select" placeholder="Select State" options={stateName} styles={stylingDropdown} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="City">
                  <Form.Label>City</Form.Label>
                  <Select classNamePrefix="themis-select" placeholder="Select City" options={cityName} styles={stylingDropdown} />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="ZipCode">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control type="text" placeholder="012345" />
                </Form.Group>
              </div>
            </div>
            <Button variant="none" className="primary-btn" type="submit">
              Save
            </Button>
            <Link to="/settings" className="btn secondary-btn">
              Cancel
            </Link>
          </Form>
        </div>
      </main>
    );
  }
}

export default EditShippingInfo;
