import React from 'react';
import PropTypes from 'prop-types';
import './Dialog.css';

function Dialog(props) {
  const { exit, restart } = props;
  return (
    <div className="dialog">
      <div className="dialog-message">
        Sometimes you win and sometimes you learn.
      </div>
      <div className="dialog-buttons">
        <button type="button" onClick={restart}>Play again</button>
        <button type="button" onClick={exit}>Back to main Menu</button>
      </div>
    </div>
  );
}

Dialog.propTypes = {
  exit: PropTypes.func.isRequired,
  restart: PropTypes.func.isRequired,
};

export default Dialog;
