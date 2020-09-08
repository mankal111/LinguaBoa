import React from 'react';
import "./Dialog.css";

function Dialog(props) {
    const { exit, restart } = props;
    return (
        <div className="dialog">
            <div className="dialog-message">
                Sometimes you win and sometimes you learn.
            </div>
            <div className="dialog-buttons">
                <button onClick={restart}>Play again</button>
                <button onClick={exit}>Back to main Menu</button>
            </div>
        </div>
    );
  }
  
  export default Dialog;