/* eslint no-magic-numbers: 0 */
import React, { useState } from 'react';

import { DashPdfjs } from '../lib';

const App = () => {

    const [state, setState] = useState({value:'', label:'Type Here'});
    const setProps = (newProps) => {
            setState({...state, ...newProps});
        };

    return (
        <div>
            <DashPdfjs
                setProps={setProps}
                {...state}
            />
            <div style={{marginTop:20}}>
                <h3>Value:</h3>
                <pre>{state.value}</pre>
            </div>
        </div>
    )
};


export default App;
