import React, { useState, useRef, useEffect } from "react";
import salesforce from '../images/salesforce-icon.png';

function Dash() {

    const [ac, setAc] = useState();
    const [Links, setLinks] = useState([]);

    const [utmObj, setUtmObj] = useState({});

    const [results, setResults] = useState([]);

    const utmPattern = /^(utm_source|utm_medium|utm_campaign|utm_term|utm_EmailName|Platform_Source|Date|utm_id|sfmc_id)=([^&]+)(?:&|$)/g;
    const validLinkRegex = /^https:\/\/\S+/;

    const viewResult = useRef(null);
    const closeResult = useRef(null);

    const [doTest, setDoTest] = useState(true);


    function handleKeyDown(e) {
        if (e.key !== "Enter") return
        const value = e.target.value;
        if (!value.trim()) return
        setLinks([...Links, value])
        e.target.value = "";
    }

    function removeSkill(index) {
        setLinks(Links.filter((el, i) => i !== index));
    }

    const removeAll = (e) => {
        e.preventDefault();
        setAc('');
        setLinks([]);
    }

    const handleValidate = (event) => {
        event.preventDefault();
        const validUtm = utmPattern.test(ac);
        if (validUtm) {
            Links.forEach(link => {
                const isValidLink = validLinkRegex.test(link);
                if (isValidLink) {
                    setDoTest(true);
                    parseUTMParameters(ac);
                } else {
                    setDoTest(false);
                }
            });
        } else {
            window.alert('Invalid UTM');
        }
    }

    function parseUTMParameters(utmString) {
        const utmObject = {};
        const searchParams = new URLSearchParams(utmString);

        searchParams.forEach((value, key) => {
            if (key !== 'utm_term') {
                utmObject[key] = value;
            }
        });

        for (const key in utmObject) {
            if (utmObject.hasOwnProperty(key) && typeof utmObject[key] === 'string') {
                utmObject[key] = utmObject[key].replace(/%/g, '');
                utmObject[key] = utmObject[key].replace(/_/g, '_');
                utmObject[key] = utmObject[key].replace(/\u200B/g, "");
            }
        }
        //console.log(utmObject);
        setUtmObj(utmObject);
        viewResult.current.click();
    }

    useEffect(() => {
        if (doTest) {
            const allResults = [];

            Links.forEach(link => {
                const isValid = validateUtmParameters(link);
                const url = new URL(link);
                const searchParams = Object.fromEntries(url.searchParams.entries());
                allResults.push({ name: searchParams.utm_term, res: isValid });
                //console.log(isValid);
            });

            // After processing all links, set the results array
            setResults((prevRes) => [...prevRes, ...allResults]);
        }
    }, [utmObj]);

    function validateUtmParameters(link) {
        const url = new URL(link);
        const searchParams = Object.fromEntries(url.searchParams.entries());
        const errors = [];

        const errorMain = [];

        for (const param in utmObj) {
            if (searchParams[param] !== utmObj[param]) {
                //  console.log(searchParams[param]);
                errors.push({ emailName: searchParams.utm_term, expected: utmObj[param], actual: searchParams[param], param: param, resValue: false });
            } else {
                //  console.log(searchParams[param]);
                errors.push({ emailName: searchParams.utm_term, expected: utmObj[param], actual: searchParams[param], param: param, resValue: true });
            }
        }

        if (errors.every(error => error.resValue === true)) {
            //  console.log('true called');
            errorMain.push({ emailName: `${searchParams.utm_term}`, resValue: true });
        } else {
            //  console.log('false called');
            errorMain.push({ emailName: `${searchParams.utm_term}`, resValue: false });
        }

        return { errorMain, errors }
    }



    const handleClose = (e) => {
        e.preventDefault();
        setResults([]);
    }

    console.log(results);

    return (
        <>
            <nav className="navbar bg-dark">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img src={salesforce} alt="Logo" width="50" height="30" className="d-inline-block align-text-top" />
                    </a>
                </div>
            </nav>

            <div>
                <button ref={viewResult} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#showResult">
                    Launch static backdrop modal
                </button>
                <div className="modal fade modal-lg" id="showResult" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                {doTest && <h1 className="modal-title fs-5" id="staticBackdropLabel">Test Result</h1>}
                                <i style={{ color: '#1798c1', fontSize: '30px' }} className="fa-brands fa-salesforce"></i>
                            </div>
                            {doTest ? <div className="modal-body">
                                <div className="skills me-4">
                                    <div className="skills-bar">
                                        {results.length > 0 && results.map((data, index) => {
                                            return <div className="bar" key={index}>
                                                <div className="info ms-5">
                                                    {!data.resValue && <span style={{ color: 'red', fontSize: '15px' }}><i className="fa-solid fa-triangle-exclamation fa-shake" style={{ color: "red" }}></i> {data.resText}</span>}
                                                    {data.resValue && <span style={{ color: 'green', fontSize: '15px' }}><i className="fa-solid fa-circle-check fa-beat" style={{ color: "green" }}></i> {data.resText}</span>}
                                                </div>
                                            </div>
                                        })}

                                    </div>
                                </div>
                            </div> : <div className="modal-body">
                                <div className="skills me-4">
                                    <div className="skills-bar">
                                        <h3>Invalid Link</h3>
                                    </div>
                                </div>
                            </div>}
                            <div className="modal-footer">
                                <button onClick={handleClose} type="button" style={{ background: "#1798c1", color: "#fff" }} ref={closeResult} className="btn closeBtn" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center acceptance">
                <div className="p-4 col-md-8">
                    <div className="skill-wrapper certificate-card" style={{ marginTop: '30px' }}>
                        <div className="skill-content edit-component">
                            <h6> <i className="fa-solid fa-lightbulb" style={{ color: "#1798c1" }}></i> Acceptance Criteria</h6>
                            <div className="tag-box">
                                <ul>
                                    <input value={ac} onChange={(event) => setAc(event.target.value)} placeholder="Type something" type="text" id="skillInput" />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 justify-content-center skill-nav">
                <div className="skill-wrapper certificate-card" style={{ marginTop: '30px' }}>
                    <div className="skill-content edit-component">
                        <h6> <i className="fa-solid fa-link" style={{ color: "#1798c1" }}></i> Press enter after each link</h6>
                        <div className="tag-box">
                            <ul>
                                {Links.map((skill, index) => (
                                    <li key={index}>{skill.slice(0, 30)}...
                                        <i onClick={() => removeSkill(index)} className="fa-solid fa-xmark" style={{ fontSize: "25px" }}></i></li>
                                ))}
                                <input onKeyDown={handleKeyDown} placeholder="Type something" type="text" id="skillInput" />
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="skill-details">
                    <p><span style={{ color: "#1798c1" }}><strong>{Links.length}</strong></span> links added</p>
                    <div className="text-center p-3">
                        <button className="mx-3 btn remove-b" onClick={removeAll} style={{ background: "#1798c1", color: "#fff" }}>Remove all</button>
                        <button className="mx-3 btn" disabled={ac === '' || Links.length === 0} onClick={handleValidate} style={{ background: "#1798c1", color: "#fff" }}>Validate</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dash;