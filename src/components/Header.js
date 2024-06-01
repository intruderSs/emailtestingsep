import React from 'react';
import salesforceLogo from '../images/salesforce-icon.png';
import { useNavigate } from 'react-router-dom';

function Header(props) {

    const navigate = useNavigate();

    const navigateToUTM = () => {
        navigate('/utm-test');
    }

    const navigateToHome = () => {
        navigate('/');
    }

    const navigateToContent = () => {
        navigate('/content-test');
    }

    const navigateToLink = () => {
        navigate('/link-test');
    }

    return (
        <header>
            <div className="container">
                <div className="logo" onClick={navigateToHome}>
                    <img src={salesforceLogo} alt="Logo" />
                    <h3>Marketing Cloud</h3>
                </div>
                <div className="links">
                    <ul>
                        {window.location.pathname !== '/utm-test' && <li>
                            <button className="customButton mx-2" onClick={navigateToUTM}>UTM Testing<span className='spans'></span></button>
                        </li>}
                        {window.location.pathname !== '/content-test' &&
                            <li>
                                <button className="customButton mx-2" onClick={navigateToContent}>Content Testing<span className='spans'></span></button>
                            </li>}
                        {window.location.pathname !== '/link-test' &&
                            <li>
                                <button onClick={navigateToLink} className="customButton mx-2">Link Testing<span className='spans'></span></button>
                            </li>}
                    </ul>
                </div>
                <div className="overlay"></div>
                <div className="hamburger-menu" onClick={props.toggleMenu}>
                    <div className="bar"></div>
                </div>
            </div>
        </header>
    );
}

export default Header;
