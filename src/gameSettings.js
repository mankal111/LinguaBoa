export const boardSize = 15;
export const snakeInitialSize = 3;
export const snakeLengthIncrease = 3;
export const scorePerFood = 10;
export const initialSpeed = 3; //moves per second
export const speedIncrement = 0.2;
export const limitSpeed = 5;
export const initialSnakePositions = (() => {
    const boardCenter = {x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2)};
    let positionList = [];
    for (let i = 0; i < snakeInitialSize; i++) {
        positionList.push({x: boardCenter.x + i, y: boardCenter.y});
    }

    return positionList;
})()