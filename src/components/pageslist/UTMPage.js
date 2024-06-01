import React, { useState, useContext } from 'react';
import Header from '../Header';
import UtmCheckerContent from '../UTM CheckerContent/UtmCheckerContent';
import Footer from '../Footer';
import Loading from '../Loading/Loading';
import { motion } from 'framer-motion';
import ContextFile from '../backendLogic/ContextFile';


function UTMPage(props) {

    const context = useContext(ContextFile);

    const { results, loadings, setGotResult, gotResult, setResults } = context;

    const [loading, setLoading] = useState(false);

    const [viewMoreData, setViewMoreData] = useState();

    const closeResult = () => {
        setGotResult(false);
        console.log(results);
        setResults([]);
    }

    const viewMore = (item) => {
        //console.log(item);
        setViewMoreData(item);
        document.getElementById('result-main-view').classList.add('blur-the-bg');
    }

    const closeViewMore = () => {
        setViewMoreData();
        document.getElementById('result-main-view').classList.remove('blur-the-bg');
    }

    return (
        <>
            {loadings && <div className={`big-wrapper ${props.dark ? 'dark' : 'light'
                } ${props.menuActive ? 'active' : ''} ${props.copyActive ? 'copy' : ''}`}>
                <Loading />
            </div>}
            {!loadings && <div id='utm-main-page' className={`utm-parent ${gotResult ? 'blur-the-bg' : ''}`}>
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
                        <UtmCheckerContent
                            dark={props.dark}
                            menuActive={props.menuActive}
                            copyActive={props.copyActive}
                            toggleMenu={props.toggleMenu}
                            toggleAnimation={props.toggleAnimation}
                            loading={loading}
                            setLoading={setLoading}
                        />
                        <Footer toggleAnimation={props.toggleAnimation} dark={props.dark} />
                    </div>
                </main>
            </div>}
            {gotResult &&
                <div id='result-main-view' className={`result-parent ${props.dark ? 'dark' : 'light'
                    } ${props.menuActive ? 'active' : ''} ${props.copyActive ? 'copy' : ''}`}>
                    <motion.div className='verification-card'
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            default: {
                                duration: 0.3,
                                ease: [0, 0.71, 0.2, 1.01]
                            },
                            scale: {
                                type: "spring",
                                damping: 11,
                                stiffness: 100,
                                restDelta: 0.001
                            }
                        }}
                        layoutId="shahil"
                    >
                        <motion.i className="fa-solid fa-xmark fa-lg cancel" onClick={closeResult}></motion.i>
                        <div className="table-container">
                            {/*table should be placed here*/}
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>Link Name ({results.length})</th>
                                        <th>Status</th>
                                        <th>Find Out More</th>
                                    </tr>
                                </thead>
                                <tbody className='fix-body'>
                                    {results.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.res.errorMain[0].resValue ? 'Passed' : 'Failed'}</td>
                                                <td><button onClick={() => viewMore(item.res.errors)} className='view-more' style={{ backgroundColor: item.res.errorMain[0].resValue ? '#79AC78' : '#F45050' }}>view more</button></td>
                                            </tr>
                                        )
                                    })}
                                    {/* <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#79AC78' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr>
                                    <tr>
                                        <td>Shahil gdvgjvfevfe</td>
                                        <td>Passednhfbehfhebf</td>
                                        <td><button className='view-more' style={{ backgroundColor: '#F45050' }}>view more</button></td>
                                    </tr> */}

                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            }
            {viewMoreData &&
                <div className={`result-parent ${props.dark ? 'dark' : 'light'
                    } ${props.menuActive ? 'active' : ''} ${props.copyActive ? 'copy' : ''}`}>
                    <motion.div className='verification-card'
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 0.9, display: 'block' }}
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
                        <motion.i className="fa-solid fa-xmark fa-lg cancel" onClick={closeViewMore}></motion.i>
                        <div className="table-container">
                            {/*table should be placed here*/}
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>UTM Term</th>
                                        <th>UTM Parameter</th>
                                        <th>Expected Value</th>
                                        <th>Actual Value</th>
                                    </tr>
                                </thead>
                                <tbody className='fix-body'>
                                    {viewMoreData.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='bold-content'>{item.emailName}</td>
                                                <td className='bold-content'>{item.param}</td>
                                                <td className='bold-content'>{item.expected}</td>
                                                <td className='bold-content' style={{ color: item.resValue ? '#79AC78' : '#F45050' }}>{item.actual}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            }
        </>

    );
}

export default UTMPage;
