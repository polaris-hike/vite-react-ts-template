import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 土星 from './assets/土星.png';
import 地球 from './assets/地球.png';
import 天王星 from './assets/天王星.png';
import BK from './assets/天空盒/BK.jpg';
import DN from './assets/天空盒/DN.jpg';
import FR from './assets/天空盒/FR.jpg';
import LF from './assets/天空盒/LF.jpg';
import RT from './assets/天空盒/RT.jpg';
import UP from './assets/天空盒/UP.jpg';
import 太阳 from './assets/太阳.jpeg';
import 月球 from './assets/月球.jpeg';
import 木星 from './assets/木星.png';
import 水星 from './assets/水星.png';
import 海王星 from './assets/海王星.png';
import 火星 from './assets/火星.png';
import 金星 from './assets/金星.png';

import './App.css';

const CUBE_FILES = [
  // 场景背景图片
  BK,
  DN,
  FR,
  LF,
  RT,
  UP,
];

function App() {
  useEffect(() => {
    // NOTE： 创建场景
    const scene = new THREE.Scene();

    // NOTE: 相机设置
    const width = window.innerWidth;
    const height = window.innerHeight;
    const k = width / height;
    const camera = new THREE.PerspectiveCamera(50, k);
    camera.position.set(0, 0, 300);
    const loader = new THREE.TextureLoader();

    const geometry = new THREE.BoxGeometry(100, 50, 100); //球体模型
    const material = new THREE.MeshBasicMaterial(); //材质 将图片解构成THREE能理解的材质
    const t = loader.load(
      'https://creation.codemao.cn/873/user-files/Fn9sLBi0FDVgQVO44qMMOqqIqjP-'
    );
    const phoneMa = new THREE.MeshPhongMaterial({
      map: t,
    });

    const base = new THREE.Mesh(geometry, material); //网孔对象 第一个参数是几何模型(结构),第二参数是材料(外观)
    base.position.set(0, -72, 0);

    base.material = phoneMa;
    base.frustumCulled = false;
    console.log(base);
    scene.add(base);

    const geometry1 = new THREE.CylinderGeometry(50, 50, 5, 50); //球体模型
    const sundial = new THREE.Mesh(geometry1, material); //网孔对象 第一个参数是几何模型(结构),第二参数是材料(外观)
    sundial.rotation.x = 3.14 * 1.4;
    sundial.receiveShadow = true;
    sundial.material = phoneMa;
    scene.add(sundial);
    const geometry2 = new THREE.CylinderGeometry(1, 1, 50, 50); //球体模型
    const needle = new THREE.Mesh(geometry2, material); //网孔对象 第一个参数是几何模型(结构),第二参数是材料(外观)
    needle.rotation.x = 3.14 * 0.4;
    needle.position.set(0, 0, 0);
    needle.castShadow = true;

    needle.material = new THREE.MeshPhongMaterial({
      color: '#7C7C7C',
    });
    scene.add(needle);

    const light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(0, 0, 100);
    light.castShadow = true;
    console.log(light);

    scene.add(light);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      // precision: 'highp',
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    const maxsize = renderer.capabilities.maxTextureSize;
    light.shadow.mapSize.set(maxsize, maxsize);
    document.body.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
      render();
    });
    function render() {
      needle.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    setTimeout(() => {
      renderer.render(scene, camera);
    }, 3000);

    // 循环场景 、相机、 位置更新
    const loop = () => {
      requestAnimationFrame(loop);
      render();
    };

    loop();
  }, []);
  return <div className="App"></div>;
}

export default App;
