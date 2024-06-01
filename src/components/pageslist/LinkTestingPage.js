import React, { useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import LinkTestingContent from '../LinkTestingContent/LinkTestingContent';
import { motion } from 'framer-motion';
import panda from '../../images/einstein.png';

function LinkTestingPage(props) {

    const [emailFile, setEmailFile] = useState('');

    const handleTest = (links) => {
        localStorage.setItem('extractedLinks', JSON.stringify(links));
        links.forEach(element => {
            window.open(element, '_blank');
        });
    }

    const handleSameEmail = () => {
         let links = JSON.parse(localStorage.getItem('extractedLinks'));
         links.forEach(element => {
            window.open(element, '_blank');
        });
    }

    const handleFileChange = (files) => {
        console.log('Email file inserted and link extraction started');
        const file = files;

        if (file.name.endsWith('.htm')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const emailContent = e.target.result;

                const parser = new DOMParser();
                const doc = parser.parseFromString(emailContent, "text/html");
                // console.log(doc);

                // Extract and decode links from anchor tags
                const anchorTags = doc.querySelectorAll("a");
                //console.log(doc);

                ////getting the text and subject content of email and storing it into local storage to use further for content testing
                const textContent = doc.body.textContent; //.replace(/\s+/g, ' ').trim()
                // console.log(textContent);

                ////getting the subject from the email
                const subjectRegex = /Subject:\s+\[Test\]:(.*?)(?:\n|\r|$)/;
                const subjectMatch = textContent.match(subjectRegex);
                const subject = subjectMatch ? subjectMatch[1].trim() : 'No Subject Found';
                // console.log("SUBJECT ", subject);
                localStorage.setItem('subject', subject);

                ///getting the preheader
                const preHEaderRegEx = /Subject:\s+\[Test\]:(.*?)(?:\s{2,}\n)([\s\S]*?)\s{2,}View/;
                const preHeaderMatch = textContent.match(preHEaderRegEx);
                const preHeader = preHeaderMatch ? preHeaderMatch[2].trim() : 'No Preheader Found';
                // console.log("PREHEADER ", preHeader);
                localStorage.setItem('pre-header', preHeader);

                ////merging the text all together after view online
                const mergedText = textContent.replace(/\s+/g, ' ').trim();
                const filteredRegEx = /View Online\s([\s\S]*)/;
                const filteredMatch = mergedText.match(filteredRegEx);
                const filteredContent = filteredMatch ? filteredMatch[1] : 'No Content Found';
                // console.log("FILTERED ", filteredContent);
                localStorage.setItem('emailContent', filteredContent);

                const extractedLinks = Array.from(anchorTags).map((anchor) =>
                    decodeURIComponent(anchor.href)
                );
                handleTest(extractedLinks);
            };
            reader.readAsText(file);
        } else {
            window.alert('Invalid file type. Please select a .htm file.');
            setEmailFile();
        }
    };

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
                        <LinkTestingContent
                            dark={props.dark}
                            menuActive={props.menuActive}
                            copyActive={props.copyActive}
                            toggleMenu={props.toggleMenu}
                            toggleAnimation={props.toggleAnimation}
                        />
                        <Footer toggleAnimation={props.toggleAnimation} dark={props.dark} />
                    </div>
                </main>
                {/* <div className={`result-parent ${props.dark ? 'dark' : 'light'
                    } ${props.menuActive ? 'active' : ''} ${props.copyActive ? 'copy' : ''}`}>

                    <motion.div className='verification-card'
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 0.6, display: 'block' }}
                        transition={{
                            default: {
                                duration: 0.5,
                                ease: [0, 0.71, 0.2, 1.01]
                            },
                            scale: {
                                type: "spring",
                                damping: 11,
                                stiffness: 100,
                                restDelta: 0.001
                            }
                        }}
                        layoutId="shahil2"
                    >
                        <div className="table-container">
                            <div className="sales-force">
                                <h1 className='prompt-msg'>{localStorage.getItem('emailName') ? 'Want to test the same email?' : 'Click here to upload the email.'}</h1>
                                {localStorage.getItem('emailName') && <p className="">
                                    {localStorage.getItem('emailName').toString().slice(16, 60)}
                                </p>}
                            </div>

                            <div className='panels-container-einstein'>
                                <div className='left-panel-einstein'>
                                    <img src={panda} className='image' alt=''></img>
                                </div>
                            </div>
                            <div className='button-div'>
                                {localStorage.getItem('emailName') && <div className='buttonMy'>
                                    <button onClick={handleSameEmail} className='same-button'>Same Email</button>
                                </div>}
                                <div className='buttonMy'>
                                    <input value={emailFile} onChange={(e) => { setEmailFile(e.target.value); handleFileChange(e.target.files[0]); localStorage.setItem('emailName', e.target.value) }} id='file-input' name='email file' type='file' accept='.htm' className='image-upload' />
                                    <label htmlFor='file-input' className='upload-label'><i className='fas fa-upload'></i> {localStorage.getItem('emailName') ? 'Other Email' : 'Upload Email'}</label>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div> */}
            </div>
        </>
    )
}

export default LinkTestingPage