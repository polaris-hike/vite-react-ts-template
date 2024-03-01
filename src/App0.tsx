import { useEffect, useRef, useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      setLoading(true);
      console.log(
        'Started loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.'
      );
    };

    manager.onLoad = function () {
      console.log('Loading complete!');
      setLoading(false);
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      console.log(
        'Loading file: ' +
        url +
        '.\nLoaded ' +
        itemsLoaded +
        ' of ' +
        itemsTotal +
        ' files.'
      );
    };

    manager.onError = function (url) {
      console.log('There was an error loading ' + url);
    };
    // NOTE： 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.CubeTextureLoader(manager).load(CUBE_FILES);

    // NOTE: 相机设置
    const width = window.innerWidth;
    const height = window.innerHeight;
    const k = width / height;
    const camera = new THREE.PerspectiveCamera(60, k, 1, 10000);
    camera.position.set(0, 0, 5000);
    camera.lookAt(scene.position);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current!.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
      render();
    });
    function render() {
      renderer.render(scene, camera);
    }

    // NOTE: 添加星球
    const loader = new THREE.TextureLoader(manager);
    const sun = new THREE.Group(); //建立一个组
    const sunParent = new THREE.Group();
    scene.add(sunParent); //把组都添加到场景里
    loader.load(太阳, (texture) => {
      const geometry = new THREE.SphereGeometry(500, 50, 50); //球体模型
      const material = new THREE.MeshBasicMaterial({ map: texture }); //材质 将图片解构成THREE能理解的材质
      const mesh = new THREE.Mesh(geometry, material); //网孔对象 第一个参数是几何模型(结构),第二参数是材料(外观)
      sun.add(mesh); //添加到组里
      sunParent.add(sun);
      render();
    });

    function createPlanet(
      planetUrl: string,
      radius: number,
      widthSegments: number,
      heightSegments: number,
      xSpeed: number,
      newParent?: THREE.Group
    ) {
      const planet = new THREE.Group(); //建立一个组
      const parent = new THREE.Group();
      newParent ? newParent.add(parent) : sunParent.add(parent);
      loader.load(planetUrl, (texture) => {
        const geometry = new THREE.SphereGeometry(
          radius,
          widthSegments,
          heightSegments
        ); //球体模型
        const material = new THREE.MeshBasicMaterial({ map: texture }); //材质 将图片解构成THREE能理解的材质
        const mesh = new THREE.Mesh(geometry, material); //网孔对象 第一个参数是几何模型(结构),第二参数是材料(外观)
        planet.position.x -= xSpeed;
        planet.add(mesh); //添加到组里
        parent.add(planet);
        render();
      });
      return { planet, parent };
    }

    // NOTE: 创建水星
    const { planet: mercury, parent: mercuryParent } = createPlanet(
      水星,
      25,
      50,
      50,
      600
    );
    // NOTE: 设置金星
    const { planet: venus, parent: venusParent } = createPlanet(
      金星,
      100,
      50,
      50,
      700
    );
    // NOTE: 设置地球
    const { planet: earth, parent: earthParent } = createPlanet(
      地球,
      100,
      50,
      50,
      900
    );
    // NOTE: 设置月球
    const { planet: moon, parent: moonParent } = createPlanet(
      月球,
      30,
      50,
      50,
      150,
      earth
    );
    // NOTE: 设置火星
    const { planet: mars, parent: marsParent } = createPlanet(
      水星,
      85,
      50,
      50,
      1200
    );
    // NOTE: 设置木星
    const { planet: jupiter, parent: jupiterParent } = createPlanet(
      木星,
      150,
      50,
      50,
      1500
    );
    // NOTE: 设置土星
    const { planet: saturn, parent: saturnParent } = createPlanet(
      土星,
      120,
      50,
      50,
      1800
    );
    // NOTE: 设置天王星
    const { planet: uranus, parent: uranusParent } = createPlanet(
      天王星,
      50,
      50,
      50,
      2100
    );
    // NOTE: 设置海王星
    const { planet: neptune, parent: neptuneParent } = createPlanet(
      海王星,
      50,
      50,
      50,
      2300
    );
    const revolution = () => {
      mercuryParent.rotation.y += 0.015;
      venusParent.rotation.y += 0.0065;
      earthParent.rotation.y += 0.025;
      moonParent.rotation.y += 0.2;
      marsParent.rotation.y += 0.03;
      jupiterParent.rotation.y += 0.01;
      saturnParent.rotation.y += 0.02;
      uranusParent.rotation.y += 0.02;
      neptuneParent.rotation.y += 0.01;
    };

    //设置自转
    const selfRotation = () => {
      sun.rotation.y += 0.004;
      mercury.rotation.y += 0.002;
      venus.rotation.y += 0.005;
      earth.rotation.y += 0.01;
      moon.rotation.y += 0.01;
      mars.rotation.y += 0.01;
      jupiter.rotation.y += 0.08;
      saturn.rotation.y += 1.5;
      uranus.rotation.y += 1;
      neptune.rotation.y += 0.1;
    };

    // 循环场景 、相机、 位置更新
    const loop = () => {
      requestAnimationFrame(loop);
      revolution();
      selfRotation();
      render();
    };

    loop();
  }, []);
  return (
    <>
      <div className="App" ref={containerRef}></div>
      {loading && <div className="loading">loading...</div>}
      {/* <div className="loading">loading...</div> */}
    </>
  );
}

export default App;
