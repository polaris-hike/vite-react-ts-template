import { AwesomeQR } from 'awesome-qr';
import { useEffect, useState } from 'react';
import images from './images.jpg';
import './App.css';

function App() {
  const gifImageUrl =
    'https://dev-cdn-common.codemao.cn/dev/873/user-files/FndZCeAAXRHfxNB1uYUwn-FFR_Ju';
  const pngImageUrl =
    'https://dev-cdn-common.codemao.cn/dev/873/user-files/FstzruV1EbZ9REXov9Lv0WmLsInI';
  const [src, setSrc] = useState('');
  useEffect(() => {
    fetch(gifImageUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const content = '中文哈哈哈测试，你好呀';
        const options = {
          text: 'AwesomeQR by Makito - Awesome, right now.',
          size: 400,
          // margin: 30,
          // correctLevel: AwesomeQR.CorrectLevel.H,
          // autoColor: false,
          // maskPattern: 10,
          components: {
            data: {
              scale: 0.4,
            },
            timing: {
              scale: 1,
              protectors: true,
            },
            alignment: {
              scale: 1,
              protectors: true,
            },
            cornerAlignment: {
              scale: 1,
              protectors: true,
            },
          },
          gifBackground: buffer,
        };
        const qrcode = new AwesomeQR(options);
        qrcode.draw().then((dataUrl) => {
          console.log('dataUrl: ' + dataUrl);
          dataUrl && setSrc(dataUrl);
        });
        // Use the buffer here
      });
    // Define the content and options for the QR code

    // fetch(gifImageUrl)
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     const reader = new FileReader();

    //     reader.onload = function () {
    //       const base64 = reader.result;
    //       const content = '中文哈哈哈测试，你好呀';
    //       const options = {
    //         text: content,
    //         margin: 30,
    //         maskPattern: 2,
    //         version: 5,
    //         correctLevel: AwesomeQR.CorrectLevel.H,
    //         autoColor: false,
    //         backgroundImage: base64,
    //         components: {
    //           data: {
    //             scale: 0.4,
    //           },
    //           timing: {
    //             scale: 1,
    //             protectors: true,
    //           },
    //           alignment: {
    //             scale: 1,
    //             protectors: true,
    //           },
    //           cornerAlignment: {
    //             scale: 1,
    //             protectors: true,
    //           },
    //         },
    //       };
    //       // Generate the QR code with custom design
    //       const qrcode = new AwesomeQR(options);
    //       qrcode.draw().then((dataUrl) => {
    //         dataUrl && setSrc(dataUrl);
    //       });
    //     };

    //     reader.readAsDataURL(blob);
    //   });
  }, []);
  return (
    <div id="container">
      <img src={src} alt="" />
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
