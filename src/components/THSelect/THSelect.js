import React from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import { isEmpty } from "lodash";

class THSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  inputChangeHandlers = (e) => {
    this.props.inputChangeHandler(e);
  };

  render() {
    return (
      <>
        <Form.Group controlId={this.props.id} className={this.props.className1}>
          <Select
            classNamePrefix={this.props.className2}
            name={this.props.name}
            placeholder={this.props.placeholder}
            options={this.props.options}
            styles={this.props.styles}
            onChange={this.inputChangeHandlers}
            value={
              isEmpty(this.props.datavalue)
                ? this.props.placeholder
                : this.props.datavalue
            }
          />
          <span className="error-msg">{this.props.errors_msg}</span>
        </Form.Group>
      </>
    );
  }
}

export default THSelect;
