import '@picocss/pico';
import PhotoWebCam from "./PhotoWebCam";
import { useEffect, useContext, useState } from 'react';

import { Context } from './GlobalContext';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const { pipeline, setPipeline } = useContext(Context);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {

    if (!localStorage?.getItem('name') || localStorage.getItem('name') == null) {
      const uniqueId = uuidv4();
      localStorage.setItem('name', uniqueId);
      setPipeline({ ...pipeline, name: uniqueId });
    } else {
      setPipeline({ ...pipeline, name: localStorage.getItem('name') });
    }

  document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <div  > 
      <main className="container">
        <center>
          <h1>Photo App</h1>
          <br />
          <PhotoWebCam />
        </center>
      </main>

      <br /><br />
      <center>
        Session ID/Filename: <span>{pipeline.name} </span>
      </center>
    </div>
  );
}

export default App;
