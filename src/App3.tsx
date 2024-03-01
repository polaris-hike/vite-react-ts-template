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
    const width = window.innerWidth; //宽度
    const height = window.innerHeight; //高度

    const axesHelper = new THREE.AxesHelper(1500);
    scene.add(axesHelper);

    // 添加一个辅助网格地面
    // const gridHelper = new THREE.GridHelper(3000, 25, 0x004444, 0x004444);
    // scene.add(gridHelper);
    const geometry = new THREE.PlaneGeometry(1000, 1000);
    const texture = new THREE.TextureLoader().load(earth);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 10);
    const material = new THREE.MeshBasicMaterial({
      // color: 0x7cfc00,
      map: texture,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    mesh.rotateX(-Math.PI / 2);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(292, 109, 268); //设置相机位置

    camera.lookAt(0, 0, 0);
    // 改变相机观察目标点
    // camera.lookAt(1000, 0, 1000);

    const tetureTree = new THREE.TextureLoader().load(rain);
    const group = new THREE.Group();
    for (let i = 0; i < 400; i++) {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: tetureTree,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(8, 10, 1);
      const k1 = Math.random() - 0.5;
      const k2 = Math.random() - 0.5;
      const k3 = Math.random() - 0.5;
      sprite.position.set(1000 * k1, 300 * Math.random(), 1000 * k2);
      group.add(sprite);
    }
    scene.add(group);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });

    // const ambientLight = new THREE.AmbientLight(0xffffff);
    // scene.add(ambientLight);
    // // 平行光，类似于生活中的太阳光
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(400, 200, 300);
    // scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(1000, 0, 1000);
    controls.update(); //update()函数内会执行camera.lookAt(controls.targe)
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function () {
      renderer.render(scene, camera); //执行渲染操作
    }); //监听鼠标、键盘事件

    renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
    document.getElementById('root')!.appendChild(renderer.domElement);

    const stats = new Stats();
    document.getElementById('root')!.appendChild(stats.domElement);
    function render() {
      stats.update();
      group.children.forEach((sprite) => {
        // 雨滴的y坐标每次减1
        sprite.position.y -= 2;
        if (sprite.position.y < 0) {
          // 如果雨滴落到地面，重置y，从新下落
          sprite.position.y = 200;
        }
      });
      renderer.render(scene, camera); //执行渲染操作
      requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
    }

    render();
  }, []);
  return (
    <div id="container">
      <div id="per"> </div>
    </div>
  );
}

export default App;
