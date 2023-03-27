import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";

const THDatepicker = (props)=> {

  const handleChange = (date) => {
    props.parentDateCallback(date);
  };

    return (
      <Form.Group controlId={props.controlId}>
        <Form.Label className={props.labelClass}>
          <div className="datepicker-wrapper">
            <DatePicker
              id={props.id}
              selected={props.dataValue}
              className={props.class}
              onChange={handleChange}
              dateFormat={props.dateFormat}
              placeholderText={props.placeholderText}
              name={props.name}
              minDate={new Date()}
            />
            <i className="ri-calendar-event-line calendar-icon"></i>
          </div>
          <span className="error-msg">{props.errors_msg}</span>
        </Form.Label>
      </Form.Group>
    );
}

export default THDatepicker;
