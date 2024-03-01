import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './App.css';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // 创建点的几何体
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 10 - 5;
      const y = Math.random() * 10 - 5;
      const z = Math.random() * 10 - 5;
      positions.push(x, y, z);
    }
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    // 创建点的材质
    const material = new THREE.PointsMaterial({ size: 0.1, color: 0xffffff });

    // 创建点对象
    const points = new THREE.Points(geometry, material);

    // 将点对象添加到场景中
    scene.add(points);

    // 渲染场景和相机
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }, []);
  return (
    <div id="container">
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
