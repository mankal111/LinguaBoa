import React from "react";
import PropTypes from "prop-types";
import "./SnakePart.css";

const SnakePart = ({x, y, type, from, to}) => {
    const directionToIntCode = dir => {
        const code = ['up', 'right', 'down', 'left'].indexOf(dir);
        // I use '4' to encode the fact that no direction is given.
        // By taking the smallest number of 'from' and 'to' we ensure
        // that we only get defined directions.
        if (code === -1) return 4;
        return code;
    };

    const [fromCode, toCode] = [directionToIntCode(from), directionToIntCode(to)];

    const changesDirection = ((toCode - fromCode) % 2) != 0;
    
    let mainDirectionCode = fromCode < toCode ? fromCode : toCode;
    // check special left-up case
    if ((fromCode === 0 && toCode === 3) || (fromCode === 3 && toCode === 0))
        mainDirectionCode = 3;

    let tileImage;
    switch(type) {
        case 'head':
            tileImage = 'W';
            break;
        case 'tail':
            tileImage = 'V';
            break;
        default:
            tileImage = changesDirection ? 'L' : 'I';
            break;  
    }
    return <div
        style={{
            gridRowStart: y,
            gridColumnStart: x,
            transform: `rotate(${mainDirectionCode*90}deg)`
        }}
        //className={`snake-part snake-part-${type} ${directionStyle}`}
    >
        {tileImage}
    </div>;
}

export default SnakePart;