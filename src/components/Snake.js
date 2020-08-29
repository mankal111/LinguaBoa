import React from "react";
import PropTypes from "prop-types";
import SnakePart from "./SnakePart.js";

export default class Snake extends React.Component {
    constructor(props) {
        super(props);
        const {x, y} = this.props;
        this.state = {
            partsList: [
                {x, y},
                {x: x+1, y},
                {x: x+2, y},
                {x: x+2, y: y-1},
                {x: x+2, y: y-2},
            ] 
        }
    }

    getDirectionFromCoordinates(fromCoordinates, toCoordinates) {
        if (!fromCoordinates || !toCoordinates) return
        const { x: fromX, y: fromY } = fromCoordinates;
        const { x: toX, y: toY } = toCoordinates;
        const [xDiff, yDiff] = [fromX-toX, fromY-toY];
        if (yDiff === 0) {
            if (xDiff === 1) return 'left';
            if (xDiff === -1) return 'right';
        }
        if (xDiff === 0) {
            if (yDiff === 1) return 'up';
            if (yDiff === -1) return 'down';
        }
    }

    getPartElementByIndex(index) {
        const { partsList } = this.state;
        const coordinates = partsList[index];
        const type = index === 0 ? 'head' : (index === partsList.length - 1 ? 'tail' : 'middle');
        const prevCoordinates = type === 'tail' ? undefined : partsList[index + 1];
        const nextCoordinates = type === 'head' ? undefined : partsList[index - 1];
        return <SnakePart  
            x={coordinates.x}
            y={coordinates.y}
            type={type}
            from={this.getDirectionFromCoordinates(coordinates, prevCoordinates)}
            to={this.getDirectionFromCoordinates(coordinates, nextCoordinates)}
        />
    }

    render() {
        const {x, y} = this.props;
        const {partsList} = this.state;
        return partsList.map((part, index) => this.getPartElementByIndex(index));
    }
}