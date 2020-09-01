import React from "react";
import PropTypes from "prop-types";
import "./Food.css";
import { symbols } from "../words";

export default class SnakePart extends React.Component {

    render() {
        const {x, y} = this.props;
        return <div
            style={{
                gridRowStart: y,
                gridColumnStart: x
            }}
            className={`food`}
        >
            {symbols.numbers[this.props.wordIndex]}
        </div>;
    }
}