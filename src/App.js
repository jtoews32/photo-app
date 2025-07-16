import '@picocss/pico';
import PhotoWebCam from "./PhotoWebCam";
import { useEffect, useContext } from 'react';

import { Context } from './GlobalContext';
import { v4 as uuidv4 } from 'uuid';

function App() {


  const { pipeline, setPipeline } = useContext(Context);

  useEffect(() => {

    if (!localStorage?.getItem('name') || localStorage.getItem('name') == null) {
      const uniqueId = uuidv4();
      localStorage.setItem('name', uniqueId);
      setPipeline({ ...pipeline, name: uniqueId });
    } else {
      setPipeline({ ...pipeline, name: localStorage.getItem('name') });
    }


  }, []);


  return (
    <div className="App" data-theme="light"> 
      <main className="container">
        <center>
          <h1>Photo App</h1>


          <br />
          <PhotoWebCam />
        </center>
      </main>

      <br /><br />
      <center>
        Name ID: <span>{pipeline.name} </span>
      </center>
    </div>
  );
}

export default App;
