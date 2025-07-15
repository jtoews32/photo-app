import '@picocss/pico';
import PhotoWebCam from "./PhotoWebCam";

function App() {

  return (
    <div className="App">
      <main className="container">
        <center>
          <h1>Photo App</h1>

          <PhotoWebCam />
        </center>
      </main>
    </div>
  );
}

export default App;
