import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message }) => {
    return (
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{message}</p>
            <p className="error-help">Please try again or search for a different city.</p>
        </div>
    );
};

export default ErrorMessage;