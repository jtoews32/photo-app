import React from 'react';
import Webcam from "react-webcam";
import { useContext, useRef, useState } from "react";
import { Context } from './GlobalContext';
import axios from 'axios';

function getBase64Size(base64String) {
  
  // Remove the data URI prefix if present
  const dataPrefix = "data:image/jpeg;base64,"; // Or other image types
  if (base64String.startsWith(dataPrefix)) {
    base64String = base64String.substring(dataPrefix.length);
  }

  // Calculate the approximate size of the original data
  // Base64 encodes 3 bytes of binary data into 4 characters.
  // We need to account for padding characters ('=') at the end.
  let padding = 0;
  if (base64String.endsWith('==')) {
    padding = 2;
  } else if (base64String.endsWith('=')) {
    padding = 1;
  }

  const decodedSize = (base64String.length * 0.75) - padding;
  return Math.ceil(decodedSize); // Use Math.ceil to ensure whole bytes
}

function PhotoWebCam() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgSrcSize, setImgSrcSize] = useState(0);
 
  const { pipeline, setPipeline } = useContext(Context);

  const takePhoto = (e) => {
    e.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();

    console.log("Captured Image Type:", typeof imageSrc);
    console.log("Captured Image Source:", imageSrc);
    console.log(imageSrc.length);
    console.log("Image Size in Bytes:", getBase64Size(imageSrc));
    setImgSrc(imageSrc);
    setImgSrcSize(getBase64Size(imageSrc));

    setPipeline({ ...pipeline, step: 1 });
  };

  const back = (e) => {
    e.preventDefault();
    setPipeline({ ...pipeline, step: pipeline.step - 1 });
  };

  const uploadPhoto = (e) => {
    e.preventDefault();





    axios.post('http://127.0.0.1:8080/upload', {
      file: imgSrc
    })
      .then((response) => {
        console.log(JSON.stringify(response, null, 2));

      })
      .catch((error) => {
        console.log(error);
      });



    setPipeline({ ...pipeline, step: 2 });
  };

  const buttonGrid = {
    minWidth: "10em",
    maxWidth: "10em"
  };

  return (
    <div className="container">
      {pipeline.step === 0 && <div>
        <h2>Capture Photo Using Interface</h2>
        <Webcam height={600} width={600} ref={webcamRef} screenshotFormat='image/jpeg' />
        <br />
        <button className="  outline" onClick={(e) => takePhoto(e)} >Capture Photo</button>
        <br /> <br />
      </div>}

      {pipeline.step === 1 && <div>

        {imgSrc && (
          <div>
            <h2>Application Verification of Size Requirements</h2>
            

       
        { imgSrcSize > 1000000 && <h5><i>Verification Failed</i></h5> }
        { imgSrcSize <= 1000000 && <h5><i>Verification Passed</i></h5> }
           Image Size: { imgSrcSize}


            <br /> <br />
            <div className="grid" style={buttonGrid}>
              <div> <button className="outline" onClick={(e) => back(e)} >Back</button></div>


              { imgSrcSize < 1000000 && <div> <button className="outline" onClick={(e) => uploadPhoto(e)} >Upload</button></div> }


              
            </div>
            <br /> <br />
          </div>)}
      </div>}

      {pipeline.step === 2 && <div>
        <h2>Upload and Check</h2>

        <span aria-busy="true">Waiting for Upload to Complete</span>  <br />
        <img src={imgSrc} alt="Captured" />
      </div>}

      {pipeline.step === 3 && <div>
        <h2>Upload Presents Image</h2>
        <span aria-busy="true">Waiting for Upload to Complete</span>
        <br />
        <img src={imgSrc} alt="Captured" />
      </div>}
    </div>
  );
};

export default PhotoWebCam;