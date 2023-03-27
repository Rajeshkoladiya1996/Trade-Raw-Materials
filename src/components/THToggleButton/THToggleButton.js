

const THToggleButton=(props)=>{
    const onToggleSwitchChange=(e)=>{
        props.onToggleSwitchChange(e,props.checked,props.dataValue);
    }

    return (
    <div name={props.name} id={props.id}   className={`toggle ${props.checked && "isChecked"}`} onClick={onToggleSwitchChange}>
        <div id={props.id}   className="toggle-slider"></div>
    </div>
  );
}

export default THToggleButton;