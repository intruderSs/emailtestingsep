import React from 'react';
import Header from '../Header';
import LandingContent from '../LandingContent';
import Footer from '../Footer';

function LandingPage(props) {
    
    return (
        <>
            <div>
                <main id="mains">
                    <div
                        className={`big-wrapper ${props.dark ? 'dark' : 'light'
                            } ${props.menuActive ? 'active' : ''} ${props.copyActive ? 'copy' : ''}`}
                    >
                        <Header dark={props.dark}
                            menuActive={props.menuActive}
                            copyActive={props.copyActive} 
                            toggleMenu={props.toggleMenu}
                            />
                        <LandingContent
                            dark={props.dark}
                            menuActive={props.menuActive}
                            copyActive={props.copyActive}
                            toggleMenu={props.toggleMenu}
                            toggleAnimation={props.toggleAnimation}
                        />
                        <Footer toggleAnimation={props.toggleAnimation} dark={props.dark} />
                    </div>
                </main>
            </div>
        </>

    );
}

export default LandingPage;
