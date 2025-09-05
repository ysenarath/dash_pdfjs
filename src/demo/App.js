/* eslint no-magic-numbers: 0 */
import React, { useState } from 'react';

import { DashPdfjs } from '../lib';

const App = () => {

    const [state, setState] = useState({value:'', label:'Type Here'});
    const setProps = (newProps) => {
            setState(newProps);
        };

    return (
        <div>
            <DashPdfjs
                setProps={setProps}
                {...state}
            />
        </div>
    )
};


export default App;
