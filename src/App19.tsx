import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import './App.css';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#3266B3');
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    // 渲染场景和相机
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    // 创建字母的材质
    const fontLoader = new FontLoader();
    console.log('fontLoader:', fontLoader);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
      renderer.render(scene, camera); // 鼠标、键盘操作导致了相机变化会触发回调
    }); //监听鼠标、键盘事件
    fontLoader.load(
      'https://teaching-aes.codemao.cn/material/font/点点像素体-方形_Regular.json',
      (font) => {
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

        // 生成随机字母的数组
        const randomLetters = [];
        for (let i = 65; i <= 90; i++) {
          randomLetters.push(String.fromCharCode(i));
        }

        // 生成50个随机字母的立体文本对象，并添加到场景中
        const number: any[] = [];
        for (let i = 0; i < 50; i++) {
          const letter =
            randomLetters[Math.floor(Math.random() * randomLetters.length)];

          const textGeometry = new TextGeometry(letter, {
            font: font,
            size: 3,
            height: 1,
          });
          const textMesh = new THREE.Mesh(textGeometry, material);

          const x = Math.random() * 100 - 50;
          const y = Math.random() * 100 - 50;
          const z = Math.random() * 100 - 50;
          textMesh.position.set(x, y, z);
          scene.add(textMesh);
          number.push(textMesh);
        }
        function animate() {
          for (let i = 0; i < number.length; i++) {
            const textMesh = number[i];
            textMesh.position.y -= 0.5;
            if (textMesh.position.y < -50) {
              textMesh.position.x = Math.random() * 100 - 50;
              textMesh.position.y = 50;
              textMesh.position.z = Math.random() * 100 - 50;
            }
          }
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }
        animate();
      }
    );
  }, []);
  return (
    <div id="container">
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
