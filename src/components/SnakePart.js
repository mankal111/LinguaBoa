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

    const fixedPositionStyle = {position:"fixed"};
    let tileSVG;
    switch(type) {
        case 'head':
            tileSVG = (<svg style={fixedPositionStyle}  width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M31.2743 85L18.2847 45.7249C13.7743 30 15.7743 25 25.7847 15.2249V0H75.7847V15.2249C85.7743 25 87.7743 30 83.2847 45.7249L76.7795 65.3624L70.2743 85C65.7743 95 60.7743 99.5 50.7743 99.5C40.7743 99.5 35.7743 95 31.2743 85Z" fill="#63EC2E"/>
            <path d="M25.0104 0V15.2249C15 25 13 30 17.5104 45.7249L30.5 85C35 95 40 99.5 50 99.5C60 99.5 65 95 69.5 85L76.0052 65.3624L82.5104 45.7249C87 30 85 25 75.0104 15.2249V0" stroke="#004200" stroke-width="3"/>
            <circle cx="72.5" cy="52.5" r="11" fill="#0082B4" stroke="#004200" stroke-width="3"/>
            <circle cx="27.5" cy="52.5" r="11" fill="#0082B4" stroke="#004200" stroke-width="3"/>
            <path d="M25 42C17.4 44 16.5 50.5 17 53.5C23 46.7 33.5 47.6667 38 49C35.2 41.8 28.1667 41.3333 25 42Z" fill="#63EC2E"/>
            <path d="M75.64 42.3576C82.7049 44.555 83.1742 50.1469 82.5257 52.6682C77.2544 46.4888 67.2748 46.628 62.9439 47.47C66.0123 41.5231 72.6864 41.5838 75.64 42.3576Z" fill="#63EC2E"/>
            <circle cx="27.5" cy="52.5" r="11" stroke="#004200" stroke-width="3"/>
            <circle cx="72.5" cy="52.5" r="11" stroke="#004200" stroke-width="3"/>
            <path d="M41 50.257C31.5 44.9926 18.5 49.7784 14 56" stroke="#004200" stroke-width="3"/>
            <path d="M59 50.257C68.5 44.9926 81.5 49.7784 86 56" stroke="#004200" stroke-width="3"/>
            <path d="M60 88C60 85.3333 60.8498 80 64.2492 80C64.8158 80 65.609 80.8 64.2492 84" stroke="#004200" stroke-width="3"/>
            <path d="M40 88C40 85.3333 39.1502 80 35.7508 80C35.1842 80 34.391 80.8 35.7508 84" stroke="#004200" stroke-width="3"/>
            <path d="M35 15C45 15 49 55 50 70C51.5 55 55 15 65.5 15C57.5 5 42 5 35 15Z" fill="#004200"/>
            </svg>
            
            );
            break;
        case 'tail':
            tileSVG = (<svg style={fixedPositionStyle} width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 99.5C45 99.5 25 35 25 0H75C75 35 55 99.5 50 99.5Z" fill="#63EC2E"/>
            <path d="M25 0C25 35 45 99.5 50 99.5C55 99.5 75 35 75 0" stroke="#004200" stroke-width="3"/>
            <path d="M60.5 60.5C59.4412 69.5 55.5 74 50.5 74C45.5 74 41 68.5 39.5 60.5C38 52.5 39.5 48 50.5 48C60.5 48 61.3823 53 60.5 60.5Z" fill="#004200"/>
            <path d="M67.5 19C66 29.5 67.4999 36 49.9999 36C33.9999 36 35.0173 31.5 32 19C29.7447 9.65658 32 2 49.9999 2C69.5 2 69 8.5 67.5 19Z" fill="#004200"/>
            </svg>
            
            );
            break;
        default:
            tileSVG = changesDirection ? (<svg style={fixedPositionStyle}  width="100%" height="100%" viewBox="0 1 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 26C87 26 75 14 75 1H25C25 40 61 76 100 76V26Z" fill="#63EC2E"/>
            <path d="M75 1C75 14 87 26 100 26" stroke="#004200" stroke-width="3"/>
            <path d="M25 1C25 40 61 76 100 76" stroke="#004200" stroke-width="3"/>
            <path d="M85 26C100 34.5 96.5 44 93.5 57.5C90.5 71 65.0362 64.433 52 52.5C38.9638 40.567 33 20 52 10C71 1.84302e-05 73.8838 19.7008 85 26Z" fill="#004200"/>
            </svg>
            
            ) : (<svg style={fixedPositionStyle}  width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 100V0H75V100H25Z" fill="#63EC2E"/>
            <path d="M25 0V100M75 0V100" stroke="#004200" stroke-width="3"/>
            <path d="M70.4687 50.5C70.4687 81 65.5 91 47.4687 88C29.4375 85 29.9687 68.1731 29.9687 50.5C29.9687 32.8269 24.4687 17.5 47.4687 12.5C70.4687 7.5 70.4687 28.8552 70.4687 50.5Z" fill="#004200"/>
            </svg>
            
             
);
            break;  
    }
    return <div
        style={{
            gridRowStart: y,
            gridColumnStart: x,
            transform: `rotate(${mainDirectionCode*90}deg)`,
            position: 'relative',
            width: '100%',
            height: '100%'
        }}
        //className={`snake-part snake-part-${type} ${directionStyle}`}
    >
        {tileSVG}
    </div>;
}

export default SnakePart;