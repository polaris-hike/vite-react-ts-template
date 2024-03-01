import { decompressFrames, parseGIF } from 'gifuct-js';
import { useEffect, useRef, useState } from 'react';
import images from './images.jpg';
// import gif from './test.gif';
import './App.css';

const GIF_URL =
  'https://dev-cdn-common.codemao.cn/dev/873/user-files/FqKjr1TsKT6L6EnQfoXT1URV76YN';
const GIF_URL1 =
  'https://dev-cdn-common.codemao.cn/dev/873/user-files/Fr8poDe6QDTqDm88XJFzFm-d-_8a';
const ori =
  'https://dev-cdn-common.codemao.cn/dev/873/user-files/FioRH5_xVsUdHLVKbVMGfN_WMk7f';
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
    // console.log('newGif:', newGif);

    newGif.render();
    return Promise.all(waitings);
  } catch (error) {
    console.info('parse gif failed: ' + url);
    console.error(error);
    return [];
  }
}
async function beautifyQRCode(picture, qrCodeWithBg, qrCodeWithoutBg) {
  return new Promise((resolve, reject) => {
    // 创建画布
    const canvasA = document.createElement('canvas');
    const ctxA = canvasA.getContext('2d');

    const canvasB = document.createElement('canvas');
    const ctxB = canvasB.getContext('2d');

    const canvasC = document.createElement('canvas');
    const ctxC = canvasC.getContext('2d');

    // 加载图片 A
    const imageA = new Image();
    imageA.onload = function () {
      // 加载图片 B
      const imageB = new Image();
      imageB.onload = function () {
        // 设置画布 A 的大小为图片 B 的大小
        canvasA.width = imageB.width;
        canvasA.height = imageB.height;
        // 设置画布 B 的大小为图片 B 的大小
        canvasB.width = imageB.width;
        canvasB.height = imageB.height;
        ctxA.drawImage(imageA, 0, 0, canvasA.width, canvasA.height);

        // 将图片 B 绘制到画布 B 上
        ctxB.drawImage(imageB, 0, 0);

        // 遍历像素点，识别透明像素点
        const imageDataA = ctxA.getImageData(
          0,
          0,
          canvasA.width,
          canvasA.height
        );
        const imageDataB = ctxB.getImageData(
          0,
          0,
          canvasB.width,
          canvasB.height
        );
        for (let i = 0; i < imageDataA.data.length; i += 4) {
          // 获取图片 A 像素点的透明度
          const alphaA = imageDataA.data[i + 3];

          // 判断透明度是否为 0
          if (alphaA === 0) {
            // 将对应位置的图片 B 像素点设置为透明
            imageDataB.data[i + 3] = 0;
          }
        }

        // 将修改后的像素数据重新绘制到画布 B 上
        ctxB.putImageData(imageDataB, 0, 0);

        // 加载图片 C
        const imageC = new Image();
        imageC.onload = function () {
          // 设置画布 C 的大小为图片 C 的大小
          const borderWidth = 20;
          const canvasWidth = imageC.width + borderWidth * 2;
          const canvasHeight = imageC.height + borderWidth * 2;
          canvasC.width = imageC.width + borderWidth * 2;
          canvasC.height = imageC.height + borderWidth * 2;

          // 将图片 C 绘制到画布 C 上
          ctxC.fillStyle = '#ffffff';
          ctxC.fillRect(0, 0, canvasWidth, canvasHeight);
          ctxC.drawImage(imageC, borderWidth, borderWidth);

          // 将修改后的图片 B 绘制到画布 C 上
          ctxC.drawImage(canvasB, borderWidth, borderWidth);

          // 将画布 C 转换为包含合并后图片的 Data URL
          const mergedImageDataURL = canvasC.toDataURL();
          resolve(mergedImageDataURL);
        };

        // 设置图片 C 的源
        imageC.crossOrigin = 'anonymous';
        imageC.src = qrCodeWithoutBg;
      };
      imageB.crossOrigin = 'anonymous';
      // 设置图片 B 的源
      imageB.src = qrCodeWithBg;
    };
    imageA.crossOrigin = 'anonymous';
    // 设置图片 A 的源
    imageA.src = picture;
  });
}
function createGifFromImages(imageUrls, delay, callback) {
  const gif = new GIF({
    workers: 2,
    workerScript: '/gif.worker.js',
    quality: 1,
  });

  function loadImage(url, callback) {
    const image = new Image();
    image.onload = function () {
      callback(image);
    };
    image.src = url;
  }

  function loadImages(images, index) {
    if (index < images.length) {
      loadImage(images[index], function (image) {
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

// async function createGifFromImages(imageUrls, delay) {
//   return new Promise(function (resolve, reject) {
//     const gif = new GIF({
//       workers: 2,
//       workerScript: '/gif.worker.js',
//       quality: 1,
//     });
//     function loadImage(url) {
//       return new Promise(function (resolve, reject) {
//         const image = new Image();
//         image.onload = function () {
//           resolve(image);
//         };
//         image.onerror = function () {
//           reject(new Error('Failed to load image: ' + url));
//         };
//         image.src = url;
//       });
//     }

//     function loadImages(images, index) {
//       if (index < images.length) {
//         loadImage(images[index])
//           .then(function (image) {
//             gif.addFrame(image, { delay: delay });
//             return loadImages(images, index + 1);
//           })
//           .then(resolve)
//           .catch(reject);
//       } else {
//         gif.render();
//         gif.on('finished', function (blob) {
//           console.log(blob);
//           resolve(URL.createObjectURL(blob));
//         });
//       }
//     }

//     loadImages(imageUrls, 0);
//   });
// }

function App() {
  const [src, setSrc] = useState('');
  const [pictures, setPictures] = useState<any[]>([]);
  const resRef = useRef([]);
  useEffect(() => {
    async function init() {
      const p = await parseGIFToBlobList(GIF_URL, setSrc);
      const p2 = await parseGIFToBlobList(GIF_URL1, setSrc);
      // p.forEach(async (item, i) => {
      //   const x = await beautifyQRCode(item, p2[i], ori);
      //   resRef.current.push(x);
      // });
      for (let i = 0; i < p.length; i++) {
        const x = await beautifyQRCode(p[i], p2[i], ori);
        resRef.current.push(x);
      }
      // const res = await createGifFromImages(resRef.current, 80);
      // console.log('res:', res);
      // setPictures([res]);
      createGifFromImages(resRef.current, 80, (blob) => {
        console.log(blob);
        setPictures([blob]);
      });
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
