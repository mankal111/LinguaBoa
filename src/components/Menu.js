import React, { useState } from 'react';

function Menu(props) {
    const [language, setLanguage] = useState(undefined);
    const [subject, setSubject] = useState(undefined);
    const { returnLanguage, returnSubject } = props;
    const clickHandler = () => {
        returnLanguage('english');
        returnSubject('numbers');
    }

    return (
      <div className="Menu">
            <button onClick={clickHandler}>
                Play
            </button>
      </div>
    );
  }
  
  export default Menu;