import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './App.css';

function App() {
  useEffect(() => {
    // 创建场景和相机
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // 定义圆形的参数
    const radius = 1;
    const segments = 64;
    const thetaStart = 0;
    const thetaLength = Math.PI * 2;

    // 创建圆形对象的几何体
    const geometry = new THREE.CircleGeometry(
      radius,
      segments,
      thetaStart,
      thetaLength
    );

    // 创建圆形对象的材质
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      // side: THREE.DoubleSide,
    });

    // 创建圆形对象
    const circle = new THREE.Mesh(geometry, material);
    console.log(circle.click);

    // 将圆形对象添加到场景中
    scene.add(circle);

    // 渲染场景和相机
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
      renderer.render(scene, camera); // 鼠标、键盘操作导致了相机变化会触发回调
    }); //监听鼠标、键盘事件
  }, []);
  return (
    <div id="container">
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
