import React from "react";
import PropTypes from "prop-types";
import {snakeHead, snakeTail, snakeLShape, snakeIShape} from "./SnakePartAssets";

const SnakePart = ({x, y, type, from, to}) => {
    const directionToDirectionId = dir => {
        const directionId = ['up', 'right', 'down', 'left'].indexOf(dir);
        // I use '4' to encode the fact that no direction is given.
        // By taking the smallest number of 'from' and 'to' we ensure
        // that we only get defined directions.
        if (directionId === -1) return 4;
        return directionId;
    };

    const [fromDirId, toDirId] = [directionToDirectionId(from), directionToDirectionId(to)];

    const changesDirection = ((toDirId - fromDirId) % 2) != 0;
    
    let mainDirectionCode = fromDirId < toDirId ? fromDirId : toDirId;
    // check special left-up case
    if ((fromDirId === 0 && toDirId === 3) || (fromDirId === 3 && toDirId === 0))
        mainDirectionCode = 3;

    const fixedPositionStyle = {position:"fixed"};

    let tileSVG;
    switch(type) {
        case 'head':
            tileSVG = snakeHead;
            break;
        case 'tail':
            tileSVG = snakeTail;
            break;
        default:
            tileSVG = changesDirection ? snakeLShape : snakeIShape;
            break;  
    }
    // TO FIX: For some reason L shape needs a y offset of 1px. Find the reason and remove the offset.
    const yOffset = changesDirection ? 1 : 0;

    // BUG: In some widths there is a non-zero reminder in the division of the columns or the rows
    // and there is a one-pixel gap in some parts of the snake.

    return <div
        style={{
            gridRowStart: y,
            gridColumnStart: x,
            transform: `rotate(${mainDirectionCode*90}deg)`,
            position: 'relative',
            width: '100%',
            height: '100%'
        }}
    >
        <svg style={fixedPositionStyle} width="100%" height="100%" viewBox={`0 ${yOffset} 100 100`} fill="none" xmlns="http://www.w3.org/2000/svg">
            {tileSVG}
        </svg>
    </div>;
}

export default SnakePart;