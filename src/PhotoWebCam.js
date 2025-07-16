import React from 'react';
import Webcam from "react-webcam";
import { useContext, useRef, useState } from "react";
import { Context } from './GlobalContext';
import axios from 'axios';

const MAX_BYTE_CUT_OFF = 1000000; // 1 MB

function getBase64Size(str) {
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(str);
  return byteArray.length;
}

function PhotoWebCam() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgSrcSize, setImgSrcSize] = useState(0);

  const { pipeline, setPipeline } = useContext(Context);

  const takePhoto = (e) => {
    e.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();

    setImgSrc(imageSrc);
    setImgSrcSize(getBase64Size(imageSrc));

    setPipeline({ ...pipeline, step: 1 });
  };

  const back = (e) => {
    e.preventDefault();
    setPipeline({ ...pipeline, step: pipeline.step - 1 });
  };

  const goToStartScreen = (e) => {
    e.preventDefault();
    setPipeline({ ...pipeline, step: 0 });
  };

  const viewUpload = (e) => {
    e.preventDefault();
    setPipeline({ ...pipeline, step: 4 });
  };


  const uploadPhoto = (e) => {
    e.preventDefault();
    setPipeline({ ...pipeline, step: 2 });

    axios.post('http://127.0.0.1:8080/upload', {
      name: pipeline.name,
      payload: imgSrc
    })
      .then((response) => {
        console.log(JSON.stringify(response, null, 2));
        setImgSrc(null);

        axios.post('http://127.0.0.1:8080/download', {
          name: pipeline.name,
          payload: ""
        })
          .then((response) => {
            console.log(JSON.stringify(response, null, 2));

            setPipeline({ ...pipeline, step: 3 });

            setImgSrc(response.data.payload);

          })
          .catch((error) => {

            console.error("Error downloading image:", error);
            setPipeline({ ...pipeline, step: -1, error: error.message });

          });

      })
      .catch((error) => {
        setPipeline({ ...pipeline, step: -1, error: error.message });
        setImgSrc(null);

      });
  };

  const buttonGrid = {
    minWidth: "10em",
    maxWidth: "10em"
  };

  return (
    <div className="container">
      {pipeline.step === 0 && <div>
        <h4>Take a Screen Capture</h4>
        <Webcam height={600} width={600} ref={webcamRef} screenshotFormat='image/jpeg' />
        <br />
        <button className="  outline" onClick={(e) => takePhoto(e)} >Capture Photo</button>
        <br />
      </div>}

      {pipeline.step === 1 && <div>

        {imgSrc && (
          <div>
            <h4>Photo Verification</h4>


            {imgSrcSize > MAX_BYTE_CUT_OFF && <h5><i>Photo Size Verification Failed. Image Exceeds 1 MB</i></h5>}
            {imgSrcSize <= MAX_BYTE_CUT_OFF && <h5><i>Photo Size Verification Passed. Image Less Than 1 MB</i></h5>}
            Image Source Size: {imgSrcSize} Bytes


            <br /> <br />
            <div className="grid" style={buttonGrid}>
              <div> <button className="outline" onClick={(e) => back(e)} >Back</button></div>


              {imgSrcSize <= MAX_BYTE_CUT_OFF && <div> <button className="outline" onClick={(e) => uploadPhoto(e)} >Upload</button></div>}
              {imgSrcSize > MAX_BYTE_CUT_OFF && <div> <button className="outline" disabled>Upload</button></div>}


            </div>
            <br /> <br />
          </div>)}
      </div>}

      {pipeline.step === 2 && <div>
        <h3>Upload and Check</h3>

        <span aria-busy="true">Waiting for Upload to Complete</span>  <br />

      </div>}

      {pipeline.step === -1 && <div>
        <h3>Something Went Wrong</h3>
        <span>{pipeline.error}</span>

      </div>}

      {pipeline.step === 3 && <div>
        <h4>Upload Confirmation</h4>

        {imgSrc == null && <span aria-busy="true">Waiting...</span>}

        {imgSrc && <div  ><i>Successful Upload</i><br />    <br /><button className="outline" onClick={(e) => viewUpload(e)} >View Uploaded Image </button>  </div>}
      </div>}

      {pipeline.step === 4 && <div>

        <h5> Your Upload </h5>
        {imgSrc && <img src={imgSrc} alt="Captured" />}
        <br /><br />

        <span> Image Saved As {pipeline.name} </span>
        <br />

        <button className="outline" onClick={(e) => goToStartScreen(e)} > Take Another Capture </button>

      </div>}

    </div>
  );
};

export default PhotoWebCam;