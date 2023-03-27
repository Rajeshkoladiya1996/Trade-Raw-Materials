import { Link } from "react-router-dom";

const THLink = (props)=> {

  const handleChange = () => {
    props.type &&
      props.type === "profileChange" &&
      document.getElementById("uploadProfile").click();
     props.type && 
      props.type === "logout" && 
        props.parentCallback()

  };

    return (
      <Link
        to={props.to}
        className={props.class}
        onClick={handleChange}
      >
        {props.labelName}
      </Link>
    );

}

export default THLink;
