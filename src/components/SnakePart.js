import React from "react";
import PropTypes from "prop-types";
import "./SnakePart.css";

export default class SnakePart extends React.Component {
    render() {
        const {x, y, type, from, to} = this.props;
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
}