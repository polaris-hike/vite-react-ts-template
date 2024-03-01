import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './App.css';

function App() {
  useEffect(() => {
    // 创建场景和相机
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.z = 5;
    const gridHelper = new THREE.GridHelper(2, 2);
    scene.add(gridHelper);

    // 2
    const geometry = new THREE.PlaneGeometry(2, 2);

    // 创建平面对象的材质
    const material = new THREE.MeshBasicMaterial();
    // geometry.rotateX(-Math.PI / 2);
    // 创建平面对象
    const plane = new THREE.Mesh(geometry, material);

    // 将平面对象添加到场景中
    scene.add(plane);

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
