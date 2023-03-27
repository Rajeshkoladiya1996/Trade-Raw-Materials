import React from "react";
import { Image } from "react-bootstrap";

const THImage=(props)=> {
 
    return( <Image src={props.src} className={props.class} alt={props.alt}></Image>);
  
}

export default THImage;
