import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pageslist/LandingPage";
import UTMPage from './components/pageslist/UTMPage';
import StateFile from "./components/backendLogic/StateFile";
import ContentTestingPage from "./components/pageslist/ContentTestingPage";
import LinkTestingPage from "./components/pageslist/LinkTestingPage";
import EmailLinkExtractor from '../src/components/EmailLinkExtractor';
import CompareImage from "./components/CompareImage";

const App = () => {

  const [dark, setDark] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [copyActive, setCopyActive] = useState(false);

  const toggleAnimation = () => {
    setCopyActive(true);
    setDark(!dark);
    localStorage.setItem('dark', dark);
    setTimeout(() => {
      setCopyActive(false);
    }, 1000);
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <>
      <BrowserRouter>
        <StateFile>
          <Routes>
            <Route exact path="/" element={<LandingPage toggleAnimation={toggleAnimation} toggleMenu={toggleMenu} dark={dark} menuActive={menuActive} copyActive={copyActive} />}></Route>
            <Route exact path="/utm-test" element={<UTMPage toggleAnimation={toggleAnimation} toggleMenu={toggleMenu} dark={dark} menuActive={menuActive} copyActive={copyActive} />}></Route>
            <Route exact path="/content-test" element={<ContentTestingPage toggleAnimation={toggleAnimation} toggleMenu={toggleMenu} dark={dark} menuActive={menuActive} copyActive={copyActive} />}></Route>
            <Route exact path="/link-test" element={<LinkTestingPage toggleAnimation={toggleAnimation} toggleMenu={toggleMenu} dark={dark} menuActive={menuActive} copyActive={copyActive} />}></Route>
            <Route exact path="/email" element={<EmailLinkExtractor toggleAnimation={toggleAnimation} toggleMenu={toggleMenu} dark={dark} menuActive={menuActive} copyActive={copyActive} />}></Route>
            {/* <Route exact path="/link" element={<PDFParser toggleAnimation={toggleAnimation} toggleMenu={toggleMenu} dark={dark} menuActive={menuActive} copyActive={copyActive} />}></Route> */}
          </Routes>
        </StateFile>
      </BrowserRouter>
    </>
  )
}

export default App;