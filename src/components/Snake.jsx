import React from 'react';
import PropTypes from 'prop-types';
import SnakePart from './SnakePart';

class Snake extends React.Component {
  constructor(props) {
    super(props);
  }

  getDirectionFromCoordinates(fromCoordinates, toCoordinates) {
    if (!fromCoordinates || !toCoordinates) return;
    const { x: fromX, y: fromY } = fromCoordinates;
    const { x: toX, y: toY } = toCoordinates;
    const [xDiff, yDiff] = [fromX - toX, fromY - toY];
    if (yDiff === 0) {
      if (xDiff === 1) return 'left';
      else if (xDiff === -1) return 'right';
    } else if (xDiff === 0) {
      if (yDiff === 1) return 'up';
      else if (yDiff === -1) return 'down';
    }
  }

  getPartElementByIndex(index) {
    const { snakePositions: partsList } = this.props.store;
    const coordinates = partsList[index];
    const type = index === 0 ? 'head' : (index === partsList.length - 1 ? 'tail' : 'middle');
    const prevCoordinates = type === 'tail' ? undefined : partsList[index + 1];
    const nextCoordinates = type === 'head' ? undefined : partsList[index - 1];
    return (
      <SnakePart  
        x={coordinates.x}
        y={coordinates.y}
        type={type}
        from={this.getDirectionFromCoordinates(coordinates, prevCoordinates)}
        to={this.getDirectionFromCoordinates(coordinates, nextCoordinates)}
        key={`${coordinates.x}-${coordinates.y}`}
      />
    );
  }

  render() {
    const { snakePositions } = this.props.store;
    return snakePositions.map((part, index) => this.getPartElementByIndex(index));
  }
}

Snake.propTypes = {
  store: PropTypes.object,
};

export default Snake;