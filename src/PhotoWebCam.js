import React from 'react';
import Webcam from "react-webcam";
import { useContext, useRef, useState } from "react";

import { Context } from './GlobalContext';


function PhotoWebCam() {


  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const { pipeline, setPipeline } = useContext(Context);

  const takePhoto = (e) => {
    e.preventDefault();
    console.log("Starting webcam...");

    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    setPipeline({ ...pipeline, state: 1 });
  };



  return (
    <div className="container">
 
      {pipeline.state === 0 && <div>
        <Webcam height={600} width={600} ref={webcamRef} />
        <br />
        <button className="primary" onClick={(e) => takePhoto(e)} >Capture Photo</button>
        <br />
      </div>}

      {pipeline.state === 1 && <div>

        {imgSrc && (
          <div>
            <h2>Captured Photo</h2>
            
            <img src={imgSrc} alt="Captured" />

            <br />

            <h3><i>Verification Passed</i></h3>
            <br />
            <button className="primary" onClick={(e) => takePhoto(e)} >Upload</button>
            <br />


          </div>)}
      </div>}

      {pipeline.state === 2 && <h2> State 2 </h2>}



 
    </div>
  );
};

export default PhotoWebCam;