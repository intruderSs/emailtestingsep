import React, { useState, useEffect } from 'react';
import resemble from 'resemblejs';
import sample from "../images/sample2.jpg";
import creative from '../images/sample3.jpg';

const CompareImage = () => {
  const [diffImage, setDiffImage] = useState(null);

  useEffect(() => {
    // Function to compare the images
    const compareImages = async () => {
      const image1 = await fetch(sample).then(res => res.blob());
      const image2 = await fetch(creative).then(res => res.blob());

      resemble(image1).compareTo(image2).onComplete(data => {
        console.log(data.rawMisMatchPercentage);
        if (data.rawMisMatchPercentage !== 0) {
          const diffImage = new Image();
          diffImage.src = data.getImageDataUrl();
          setDiffImage(diffImage);
        }
      });
    };

    compareImages();
  }, []);

  return (
    <div>
      <div>
        <h3>Original Screenshot</h3>
        <img style={{width: '600px'}} src={sample} alt="Original Screenshot" />
      </div>
      <div>
        <h3>Modified Screenshot</h3>
        <img style={{width: '600px'}} src={creative} alt="Modified Screenshot" />
      </div>
      {diffImage && (
        <div>
          <h3>Differences</h3>
          <img style={{width: '600px'}} src={diffImage.src} alt="Differences Highlighted" />
        </div>
      )}
      {!diffImage && (
        <div>
          <h3>No differences found</h3>
        </div>
      )}
    </div>
  );
};

export default CompareImage;
