import React, {useState} from 'react';
import PropTypes from 'prop-types';

/**
 * ExampleTextbox is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
const ExampleTextbox = (props) => {
    const {id, label, setProps, value} = props;

    const handleInputChange = (e) => {
        /*
         * Send the new value to the parent component.
         * setProps is a prop that is automatically supplied
         * by dash's front-end ("dash-renderer").
         * In a Dash app, this will update the component's
         * props and send the data back to the Python Dash
         * app server if a callback uses the modified prop as
         * Input or State.
         */
        setProps({value: e.target.value});
    };

    return (
        <div id={id}>
            ExampleComponent: {label}&nbsp;
            <input value={value} onChange={handleInputChange} />
        </div>
    );
};

ExampleTextbox.defaultProps = {};

ExampleTextbox.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * A label that will be printed when this component is rendered.
     */
    label: PropTypes.string.isRequired,

    /**
     * The value displayed in the input.
     */
    value: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,
};

export default ExampleTextbox;
