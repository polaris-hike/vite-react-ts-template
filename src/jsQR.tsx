import jsQR from 'jsqr';
import { useEffect, useState } from 'react';
import images from './images.jpg';
import gif from './test.gif';
import './App.css';
console.log(jsQR);
function App() {
  const [src, setSrc] = useState('');
  useEffect(() => {
    // console.log('gif:', gif);
    // fetch(gif)
    //   .then((response) => response.arrayBuffer())
    //   .then((buffer) => {
    //     const content = '中文哈哈哈测试，你好呀';
    //     const options = {
    //       text: content,
    //       size: 400,
    //       margin: 30,
    //       colorDark: '#000000',
    //       colorLight: '#000',
    //       correctLevel: AwesomeQR.CorrectLevel.H,
    //       // backgroundImage: images,
    //       autoColor: false,
    //       maskPattern: 10,
    //       components: {
    //         data: {
    //           scale: 0.4,
    //         },
    //         timing: {
    //           scale: 1,
    //           protectors: true,
    //         },
    //         alignment: {
    //           scale: 1,
    //           protectors: true,
    //         },
    //         cornerAlignment: {
    //           scale: 1,
    //           protectors: true,
    //         },
    //       },
    //       gifBackground: buffer,
    //       backgroundDimming: 'rgba(0,0,0,0)',
    //     };
    //     const qrcode = new AwesomeQR(options);
    //     qrcode.draw().then((dataUrl) => {
    //       console.log('dataUrl: ' + dataUrl);
    //       dataUrl && setSrc(dataUrl);
    //     });
    //     // Use the buffer here
    //   });
    // Define the content and options for the QR code
    fetch(
      'https://dev-cdn-common.codemao.cn/dev/873/user-files/FstzruV1EbZ9REXov9Lv0WmLsInI'
    )
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();

        reader.onload = function () {
          const base64 = reader.result;
          console.log(base64);
          if (base64) {
            // const code = jsQR(base64, 400, 400);
            // console.log(code);
          }
        };

        reader.readAsDataURL(blob);
      });
  }, []);
  return (
    <div id="container">
      <img src={src} alt="" />
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
