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
    camera.position.set(0, 0, 10);

    // 添加灯光到场景中
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 添加雾效到场景中
    // scene.fog = new THREE.FogExp2(0x000000, 0.1);

    // 添加几何体到场景中
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 50,
    });
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load(['aircondition.jpg', '1cabinet-hover.jpg']);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.position.set(-2, 0, 0);
    const h1 = sphere.clone();
    console.log(h1.uuid);
    scene.add(sphere);
    scene.add(h1);
    console.log(sphere.uuid);

    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 50,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(2, 0, 0);
    scene.add(cube);
    console.log(cube.uuid);
    // 渲染场景和相机
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    function animate() {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.01;
      cube.rotation.y -= 0.01;
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
