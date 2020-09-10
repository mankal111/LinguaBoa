import React from "react";
import PropTypes from "prop-types";
import "./Food.css";
import { symbols } from "../words";

class Food extends React.Component {
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

Food.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    language: PropTypes.string,
    subject: PropTypes.string,
    wordIndex: PropTypes.number,
}

export default Food;