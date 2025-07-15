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

    setPipeline({ ...pipeline, step: 1 });
  };

  const back = (e) => {
    e.preventDefault();
    console.log("Going back to webcam...");
    setPipeline({ ...pipeline, step: pipeline.step - 1 });
  };

  const uploadPhoto = (e) => {
    e.preventDefault();
    console.log("Uploading photo...");
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
        <Webcam height={600} width={600} ref={webcamRef} />
        <br />
        <button className="  outline" onClick={(e) => takePhoto(e)} >Capture Photo</button>
        <br /> <br />
      </div>}

      {pipeline.step === 1 && <div>

        {imgSrc && (
          <div>
            <h2>Application Verification of Size Requirements</h2>

            <h5><i>Verification Passed</i></h5>
            <br />
            <img src={imgSrc} alt="Captured" />

            <br /> <br />


            <div className="grid" style={buttonGrid}>
              <div> <button className="   outline" onClick={(e) => back(e)} >Back</button></div>
              <div> <button className="   outline" onClick={(e) => uploadPhoto(e)} >Upload</button></div>

            </div>



            <br /> <br />


          </div>)}
      </div>}

      {pipeline.step === 2 && <div>
        <h2>Upload and Check</h2>

        <span aria-busy="true">Waiting for Upload to Complete</span>


      </div>}


      {pipeline.step === 3 && <div>
        <h2>Upload Presents Image</h2>

        <span aria-busy="true">Waiting for Upload to Complete</span>


      </div>}




    </div>
  );
};

export default PhotoWebCam;