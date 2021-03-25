import React from "react";
import PropTypes from "prop-types";
import "./SnakePart.css";

const SnakePart = ({x, y, type, from, to}) => {
    const directionStyle = `${from ? `snake-part-from-${from} ` : ''}${to ? `snake-part-to-${to}` : ''}`
    return <div
        style={{
            gridRowStart: y,
            gridColumnStart: x
        }}
        className={`snake-part snake-part-${type} ${directionStyle}`}
    >
    </div>;
}

export default SnakePart;