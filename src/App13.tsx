import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './App.css';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();

    // 创建一个相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.z = 2;

    // 创建一个渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 创建一个立方体几何体
    const geometry = new THREE.BoxGeometry();

    // 创建一个材质，使用CubeTextureLoader加载立方体贴图
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load(['aircondition.jpg', 'cabinet-hover.jpg']);
    const material = new THREE.MeshBasicMaterial({ map: texture });

    // 创建一个网格对象
    const cube = new THREE.Mesh(geometry, material);

    // 将网格对象添加到场景中
    scene.add(cube);

    // 渲染循环
    function animate() {
      requestAnimationFrame(animate);

      // 旋转立方体
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // 渲染场景和相机
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
