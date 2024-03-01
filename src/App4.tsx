import { useEffect } from 'react';
import * as THREE from 'three';
// 引入轨道控制器扩展库OrbitControls.js
import Stats from 'three/examples/js/libs/stats.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import rain from './assets/rain.png';
import earth from './assets/地球.png';

import './App.css';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xa0a0a0);
    // scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(1, 2, -3);
    camera.lookAt(0, 1, 0);
    const axesHelper = new THREE.AxesHelper(1500);
    scene.add(axesHelper);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);

    // const mesh = new THREE.Mesh(
    //   new THREE.PlaneGeometry(100, 100),
    //   new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    // );
    // mesh.rotation.x = -Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add(mesh);

    const loader = new GLTFLoader();
    loader.load(
      'https://threejs.org/examples/models/gltf/Soldier.glb',
      (gltf) => {
        const model = gltf.scene;
        model.position.set(1, 0, 0);
        scene.add(model);
        renderer.render(scene, camera);
      }
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', function () {
      renderer.render(scene, camera); //执行渲染操作
    }); //监听鼠标、键盘事件

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    document.getElementById('root')!.appendChild(renderer.domElement);
    renderer.render(scene, camera);
  }, []);
  return (
    <div id="container">
      <div id="per"> </div>
    </div>
  );
}

export default App;
