import { useEffect, useRef, useState } from 'react';

import './App.css';

function App() {
  const [urlWords, setUrlWords] = useState('');
  useEffect(() => {
    const url = new URL(window.location.href);
    const words = url.searchParams.get('w');
    console.log(words);
    words && setUrlWords(words);
  }, []);
  return (
    <div id="container">
      {urlWords}
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
