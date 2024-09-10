import React, { useState, useContext } from 'react'
import shapeImage from '../../images/shape.png';
import panda from '../../images/utm.png';
import ContextFile from '../backendLogic/ContextFile';

function UtmCheckerContent(props) {

  const context = useContext(ContextFile);

  const { getAllValidLinks, setLinks } = context;

  const [filteredLinks, setFilteredLinks] = useState([]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [emailFile, setEmailFile] = useState();

  const [content, setContent] = useState();
  const [type, setType] = useState();

  const [doTest, setDoTest] = useState(true);

  const utmPattern = /^(utm_source|utm_medium|utm_campaign|utm_term|utm_EmailName|Platform_Source|Date|utm_id|sfmc_id)=([^&]+)(?:&|$)/g;
  const validLinkRegex = /^https:\/\/\S+/;


  ///////////submitting the links and utm parameters here first I will validate
  ///the utm and links and further proceed with the api call
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('emailName', emailFile);

    const validUtm = utmPattern.test(acceptanceCriteria);
    if (validUtm) {
      filteredLinks.forEach(link => {
        const isValidLink = validLinkRegex.test(link);
        if (isValidLink) {
          setDoTest(true);
        } else {
          setDoTest(false);
        }
      });
    } else {
      window.alert('Invalid UTM');
      setAcceptanceCriteria('');
      return 0;
    }
    if (doTest) {
       getAllValidLinks(acceptanceCriteria, content, type);
      //console.log(result);
    }
  }

  const handleFileChange = (files) => {
    const file = files;
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        let fileType = '';
        
        if (file.name.endsWith('.eml')) {
          fileType = 'eml';
        } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
          fileType = 'html';
        }

        if (fileType) {
          setContent(fileContent);
          setType(fileType);
        }        
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <div>
        <img src={shapeImage} alt="" className="shape" />
        <div className='containers' id='login-container'>
          <div className='forms-container'>
            <div className='signin-signup'>
              <div action="" className='sign-in-form'>
                <h2 className='title'><span>Test UTM Params...</span></h2>
                <div className='input-field'>
                  <i className='fas fa-link'></i>
                  <input value={acceptanceCriteria} onChange={(e) => setAcceptanceCriteria(e.target.value)} name="utm parameters" type='text' placeholder='Acceptance Criteria'></input>
                </div>
                <div className='input-field emailSelector'>
                  <i className='fas fa-envelope'></i>
                  {emailFile && <label htmlFor="file-input">{emailFile.toString().slice(16, 40)}</label>}
                  {!emailFile && <label htmlFor="file-input">Click here to upload the email file</label>}
                  <input value={emailFile} onChange={(e) => { setEmailFile(e.target.value); handleFileChange(e.target.files[0]) }} id='file-input' className='emailFileSelector' accept={'.eml' || '.htm'} name="email file" type='file' placeholder='Click here to upload the email file'></input>
                </div>
                <button disabled={acceptanceCriteria === '' && emailFile === ''} className="submitBtn" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
        <div className='panels-container'>
          <div className='panel left-panel'>
            <img src={panda} className='image' alt=''></img>
          </div>
        </div>
      </div>
    </>
  )
}

export default UtmCheckerContent