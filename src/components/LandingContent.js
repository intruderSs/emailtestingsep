import React from 'react';
import shapeImage from '../images/shape.png';
import bodyImage from '../images/funda.png';
import { useTypewriter, Cursor } from 'react-simple-typewriter';

function Content({ dark }) {

    const [autoText] = useTypewriter({
        words: ['Test Email Content', 'Test Link Redirects', 'Test UTM Parameters'],
        loop: {},
        typeSpeed: 120,
        deleteSpeed: 50
    })

    return (
        <div>
            <img src={shapeImage} alt="" className="shape" />
            <div className="showcase-area">
                <div className="container">
                    <div className="left">
                        <div className="big-title">
                            <h1><span>{autoText} </span><Cursor cursorStyle='>' cursorColor={dark ? '#FF6C22' : '#0D9DDA'} /></h1>
                        </div>
                        <p className="text">
                            This website has been exclusively designed to streamline the email testing process within Marketing Cloud.
                        </p>
                    </div>
                    <div className="right">
                        <img src={bodyImage} alt="Salesforce" className="person" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Content;
