import React from "react";
import PropTypes from "prop-types";
import "./Food.css";
import { symbols } from "../words";

export default class SnakePart extends React.Component {

    render() {
        const {x, y, subject} = this.props;
        return <div
            style={{
                gridRowStart: y,
                gridColumnStart: x
            }}
            className={`food`}
        >
            {symbols[subject][this.props.wordIndex]}
        </div>;
    }
}