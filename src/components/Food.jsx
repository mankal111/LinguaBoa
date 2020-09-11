import React from 'react';
import PropTypes from 'prop-types';
import './Food.css';
import { symbols } from '../words';

function Food(props) {
  const {
    x, y, subject, wordIndex,
  } = props;
  return (
    <div
      style={{
        gridRowStart: y,
        gridColumnStart: x,
      }}
      className="food"
    >
      {symbols[subject][wordIndex]}
    </div>
  );
}

Food.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  subject: PropTypes.string.isRequired,
  wordIndex: PropTypes.number.isRequired,
};

export default Food;
