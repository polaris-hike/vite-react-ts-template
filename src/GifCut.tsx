import { decompressFrames, parseGIF } from 'gifuct-js';
import { useEffect, useState } from 'react';
import images from './images.jpg';
// import gif from './test.gif';
import './App.css';

const GIF_URL = 'https://creation.codemao.cn/884/1hpnprgsqkjk00.gif';
const GIF_URL1 =
  'https://dev-cdn-common.codemao.cn/dev/873/user-files/Fr8poDe6QDTqDm88XJFzFm-d-_8a';

function enhanceContrast(imageData: any, contrast: any) {
  const data = imageData;
  const factor = (contrast + 1) / 2; // 计算对比度增强倍数
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    data[i] = (data[i] - 128) * factor + 128; // 更新红色通道
    data[i + 1] = (data[i + 1] - 128) * factor + 128; // 更新绿色通道
    data[i + 2] = (data[i + 2] - 128) * factor + 128; // 更新蓝色通道
  }
}

function enhanceBrightness(imageData: any, brightness: any) {
  const data = imageData;
  const factor = brightness; // 计算亮度增强倍数
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    data[i] *= factor; // 更新红色通道
    data[i + 1] *= factor; // 更新绿色通道
    data[i + 2] *= factor; // 更新蓝色通道
  }
}

export async function parseGIFToBlobList(url: string, cb: any) {
  try {
    const waitings: Promise<any | null>[] = [];
    const tempCanvas = document.createElement('canvas');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tempCtx = tempCanvas.getContext('2d')!;
    const gifCanvas = document.createElement('canvas');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const gifCtx = gifCanvas.getContext('2d')!;
    const resp = await fetch(url);
    const buff = await resp.arrayBuffer();
    const gif = parseGIF(buff);
    const frames = decompressFrames(gif, true);
    const newGif = new GIF({
      workers: 2,
      workerScript: '/gif.worker.js',
      quality: 1,
    });
    console.log(newGif);
    gifCanvas.width = frames[0].dims.width;
    gifCanvas.height = frames[0].dims.height;
    let frameImageData: ImageData | undefined;
    for (const frame of frames) {
      if (frame.disposalType >= 2) {
        gifCtx.clearRect(0, 0, gifCanvas.width, gifCanvas.height);
      }
      const dims = frame.dims;
      if (
        !frameImageData ||
        dims.width !== frameImageData.width ||
        dims.height !== frameImageData.height
      ) {
        tempCanvas.width = dims.width;
        tempCanvas.height = dims.height;
        frameImageData = tempCtx.createImageData(dims.width, dims.height);
      }
      frameImageData.data.set(frame.patch);
      const data = frameImageData.data;
      // console.log(frame.patch);
      // for (let i = 0; i < data.length; i += 4) {
      //   const r = data[i];
      //   const g = data[i + 1];
      //   const b = data[i + 2];

      //   const gray = Math.round((r + g + b) / 3);

      //   data[i] = gray;
      //   data[i + 1] = gray;
      //   data[i + 2] = gray;
      // }
      // enhanceContrast(data, 10);
      tempCtx.putImageData(frameImageData, 0, 0);
      gifCtx.drawImage(tempCanvas, dims.left, dims.top);
      newGif.addFrame(gifCanvas, { delay: frame.delay, copy: true });
      // console.log(frameImageData.data);
      // debugger;
      waitings.push(
        new Promise<any | null>((resolve) => {
          const grayDataURL = gifCanvas.toDataURL('image/png', 1);
          // gifCanvas.toBlob((blob) => resolve(blob), 'image/png', 1);
          resolve(grayDataURL);
        })
      );
    }
    newGif.on('finished', function (blob) {
      // cb(URL.createObjectURL(blob));
      // window.open(URL.createObjectURL(blob));
    });
    console.log('newGif:', newGif);

    newGif.render();
    return Promise.all(waitings);
  } catch (error) {
    console.info('parse gif failed: ' + url);
    console.error(error);
    return [];
  }
}

function createGifFromImages(imageUrls, delay, callback) {
  const gif = new GIF({
    workers: 2,
    workerScript: '/gif.worker.js',
    quality: 10,
    transparent: '#fff',
  });

  function loadImage(url, callback) {
    const image = new Image();
    image.onload = function () {
      callback(image);
    };
    image.src = url;
    console.log(url);
  }

  function loadImages(images, index) {
    if (index < images.length) {
      loadImage(images[index], function (image) {
        // console.log(image);
        // const canvas = document.createElement('canvas');
        // const ctx = canvas.getContext('2d');
        // canvas.width = image.naturalWidth;
        // canvas.height = image.naturalHeight;
        // ctx.drawImage(image, 0, 0);

        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // const threshold = 128;
        // for (let i = 0; i < imageData.data.length; i += 4) {
        //   imageData.data[i + 3] = 255 * (imageData.data[i + 3] > threshold);
        // }
        // ctx.putImageData(imageData, 0, 0);

        // // and add the canvas as the frame instead of the image
        // gif.addFrame(canvas, { delay: delay });
        gif.addFrame(image, { delay: delay });
        loadImages(images, index + 1);
      });
    } else {
      gif.render();

      if (typeof callback === 'function') {
        gif.on('finished', function (blob) {
          callback(URL.createObjectURL(blob));
        });
      }
    }
  }

  loadImages(imageUrls, 0);
}

function App() {
  const [src, setSrc] = useState(
    'https://dev-cdn-common.codemao.cn/dev/873/user-files/FndZCeAAXRHfxNB1uYUwn-FFR_Ju'
  );
  const [pictures, setPictures] = useState<any[]>([]);
  useEffect(() => {
    async function init() {
      const p = await parseGIFToBlobList(
        'https://dev-cdn-common.codemao.cn/dev/873/user-files/FndZCeAAXRHfxNB1uYUwn-FFR_Ju',
        setSrc
      );
      // console.log(p);
      createGifFromImages(p, 80, (blob) => {
        console.log(blob);
        setPictures([blob]);
      });
      setPictures(p);
    }
    init();
  }, []);
  return (
    <div id="container">
      <img src={src} alt="" />
      <h1>11</h1>
      {pictures.map((p, index) => (
        <img key={index} src={p} alt="" />
      ))}
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
