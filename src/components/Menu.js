import React, { useState } from 'react';

function Menu(props) {
    const [language, setLanguage] = useState(undefined);
    const [subject, setSubject] = useState(undefined);
    const { returnLanguage, returnSubject } = props;
    return (
      <div className="Menu">
            <button
                onClick={
                    () => {
                        returnLanguage('english');
                        returnSubject('numbers');
                    }
                }>
                Play
            </button>
      </div>
    );
  }
  
  export default Menu;