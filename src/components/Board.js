import React from "react";
import "./Board.css";
import Snake from "./Snake.js"

export default class Board extends React.Component {
    render() {
        return <div className="board">
            <Snake x={10} y={10} />
        </div>;
    }
}