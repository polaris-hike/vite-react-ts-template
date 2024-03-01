import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './App.css';

function App() {
  const renderRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const snapshow = () => {
    const image = new Image();
    const renderer = renderRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    renderer.render(scene, camera); //renderer为three.js里的渲染器，scene为场景 camera为相机

    const imgData = renderer.domElement.toDataURL('image/jpeg'); //这里可以选择png格式jpeg格式
    image.src = imgData;
    document.body.appendChild(image); //这样就可以查看截出来的图片了
  };
  useEffect(() => {
    // 创建场景
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 创建 Group 对象
    const group = new THREE.Group();

    // 创建多个立方体
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cube.position.x = i * 1.5; // 水平间隔为 1.5
      group.add(cube); // 将立方体添加到 Group 对象中
    }

    // 将 Group 对象添加到场景中
    scene.add(group);

    // 渲染循环
    function animate() {
      requestAnimationFrame(animate);

      // 对 Group 对象进行旋转
      group.rotation.x += 0.01;
      group.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();
  }, []);
  return (
    <div id="container">
      <button
        onClick={snapshow}
        style={{
          color: '#fff',
        }}>
        截图
      </button>
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
