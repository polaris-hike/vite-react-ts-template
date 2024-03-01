import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './App.css';

function App() {
  const ball_texture = [
    'https://dev-cdn-common.codemao.cn/dev/873/user-files/FrL-BK4UUy4WEVfVcBVNcih0I0Vy',
    'https://dev-cdn-common.codemao.cn/dev/873/user-files/FrpRyVUD1y8z3acmYC90uQ2_DDfk',
    'https://dev-cdn-common.codemao.cn/dev/873/user-files/Ft3DmV9vxMC9AzGWAC5U5L8ZFI0z',
  ];
  const ball: any = [];
  useEffect(() => {
    const width = 265;
    const height = 225;
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0, 0, 500);
    // camera.position.set(800, 400, 360); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

    for (let i = 0; i < 3; i++) {
      const spheregeometry = new THREE.SphereGeometry(50);
      const material = new THREE.MeshBasicMaterial();
      const cube = new THREE.Mesh(spheregeometry, material);
      const texture = new THREE.TextureLoader().load(ball_texture[i]);
      cube.material.map = texture;
      cube.position.set((i - 1) * 150, 0, 0);
      cube.speed = i + 1;
      scene.add(cube);
      ball.push(cube);
    }
    /** 创建渲染器对象 */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸

    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      // for (let i in ba)
      for (const b of ball) {
        if (b.position.y > 100 || b.position.y < -100) {
          b.speed = -b.speed;
        }
        b.position.y -= b.speed;
      }
    }
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
      renderer.render(scene, camera); // 鼠标、键盘操作导致了相机变化会触发回调
    }); //监听鼠标、键盘事件
    animate();
  }, []);
  return (
    <div id="container">
      {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
    </div>
  );
}

export default App;
