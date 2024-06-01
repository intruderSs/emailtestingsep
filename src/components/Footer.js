// Footer.js
import React from 'react';

function Footer(props) {
    return (
        <div className="bottom-area">
            <div className="container">
                <button className="toggle-btn" onClick={props.toggleAnimation}>
                    <i className="far fa-moon"></i>
                    <i className="far fa-sun"></i>
                </button>
            </div>
        </div>
    );
}

export default Footer;
