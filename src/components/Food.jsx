import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { symbols } from '../words';

const FoodTile = styled.div`
  color: #A46A23;
  text-shadow: 1px 1px 2px #004200;
  text-align: center;
  grid-row-start: ${props => props.x};
  grid-column-start: ${props => props.y};
`

const Food = ({x, y, subject, wordIndex}) => {
  const symbol = symbols[subject][wordIndex];

  return (
    <FoodTile
      style={{
        gridRowStart: y,
        gridColumnStart: x,
      }}
    >
      {symbol}
    </FoodTile>
  );
}

Food.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  subject: PropTypes.string.isRequired,
  wordIndex: PropTypes.number.isRequired,
};

export default Food;
