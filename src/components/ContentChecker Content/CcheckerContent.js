import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import shape from '../../images/shape.png';
import Loading from '../Loading/Loading';

function CcheckerContent(props) {

  const [imageFile, setImageFile] = useState(null);

  const { setPrompt, smallLoading, setText, para1, para2, showResult, setSmallLoading } = props;


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    (async () => {
      setSmallLoading(true);
      const worker = await createWorker('eng');
      const ret = await worker.recognize(file);
      console.log(ret.data.text.replace(/\s+/g, ' ').trim());
      setText(ret.data.text.replace(/\s+/g, ' ').trim());
      await worker.terminate();
      setPrompt(true);
    })();
  };

  return (
    <>
      <div className='main-body'>
        <div>
          <img src={shape} alt="" className="shape" />
          <div className={`${imageFile ? 'shifted' : 'container-img'}`}>  {/*className={`${imageFile ? 'shifted' : 'container-img'}`}  className='shifted'*/}
            <figure className='image-container'>
              {imageFile &&
                <img id='choose-img' src={URL.createObjectURL(imageFile)} />}
              <figcaption id='file-name'>
                 {imageFile ? imageFile.name : 'File Name'}
              </figcaption>
            </figure>
            <input onChange={handleImageUpload} type='file' id='upload-button' accept='image/*' className='image-upload' />
            <label htmlFor='upload-button' className='upload-label'><i className='fas fa-upload'></i> Choose an image</label>
          </div>
          {smallLoading &&
            <div className='small-loading'>
              <Loading />
            </div>}
        </div>
        {showResult &&
        <div className='content-result-div'>
          <div>
            <h2>Acceptance Criteria:</h2>
            <p dangerouslySetInnerHTML={{ __html: para1 }}></p>
          </div>
          <div>
            <h2>Email Content:</h2>
            <p dangerouslySetInnerHTML={{ __html: para2 }}></p>
          </div>
        </div>}
      </div>
    </>
  );
}

export default CcheckerContent;


// <h1>Paragraph Comparison</h1>
// <div>
//   <h2>Paragraph 1:</h2>
//   <p dangerouslySetInnerHTML={{ __html: para1 }}></p>
// </div>
// <div>
//   <h2>Paragraph 2:</h2>
//   <p dangerouslySetInnerHTML={{ __html: para2 }}></p>
// </div> 