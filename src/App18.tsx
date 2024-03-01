import { Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import {
  jpeg_encode,
  quant_process,
  optipng_compress,
  get_string_img_info,
  get_base64_img_from_array_buffer,
} from '@crc/compress-img';
const src2 =
  'https://creation.codemao.cn/873/user-files/Ftqi-v3EDojSdN7pMc1W4EZKU6kY';
const src1 =
  'https://dev-cdn-common.codemao.cn/dev/873/user-files/lige__iG4qyU7jfPofS2eL7KFenT';
function App() {
  const [src, setSrc] = useState('');
  useEffect(() => {
    async function init() {
      const info = await get_string_img_info(src1);
      console.log('info.image_data:', info.image_data);
      const compressed_buffer = (await jpeg_encode(
        info.image_data
      )) as ArrayBuffer;
      const base64_img = get_base64_img_from_array_buffer(
        compressed_buffer,
        info.type
      );
      // pica
      //   .resize(from, to)
      //   .then((result) => pica.toBlob(result, 'image/jpeg', 0.9))
      //   .then((blob) => console.log('resized to canvas & created blob!'));
      setSrc(base64_img);
      console.log(base64_img);
    }
    init();
  }, []);

  return (
    <div id="container">
      <img src={src} alt="" />
    </div>
  );
}

export default App;
