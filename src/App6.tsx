import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import './App.css';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    // 创建一个立方缓冲几何体
    const geometry = new THREE.SphereGeometry(500);
    // 创建材质
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    // 生成带有材质的物体
    const cube = new THREE.Mesh(geometry, material);
    const direction = new THREE.Vector3(1, 0, 1);
    cube.clicl;
    // Set the speed of the box's movement
    const speed = 1;
    cube.position.y = 50;

    // const cube1 = new THREE.Mesh(geometry, material);
    // 把物体添加进场景中
    scene.add(cube);
    cube.remove();
    const axesHelper = new THREE.AxesHelper(1500);
    axesHelper.position.y = 1;
    scene.add(axesHelper);
    const size = 10000; // 网格大小
    const divisions = 100; // 网格细分数
    const colorCenterLine = 0x444444; // 中心线颜色
    const colorGrid = 0x888888; // 网格线颜色
    const gridHelper = new THREE.GridHelper(
      size,
      divisions,
      colorCenterLine,
      colorGrid
    );

    // 将网格添加到场景中
    scene.add(gridHelper);
    // scene.add(cube1);
    // 创建光源
    // 环境光，没有特定的方向
    const ambientLight = new THREE.AmbientLight(0x444444);
    scene.add(ambientLight);
    // 平行光，类似于生活中的太阳光
    const directionalLight = new THREE.DirectionalLight(0x00ff00, 1);
    directionalLight.position.set(400, 200, 300);
    scene.add(directionalLight);
    /** 相机设置 */
    const width = window.innerWidth; //窗口宽度
    const height = window.innerHeight; //窗口高度
    const k = width / height; //窗口宽高比
    const s = 400; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    const camera = new THREE.PerspectiveCamera(75, k, 0.1, 10000);
    camera.position.set(0, 0, 1000);
    // camera.position.set(800, 400, 360); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

    /** 创建渲染器对象 */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(width, height); //设置渲染区域尺寸

    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

    // renderer.render(scene, camera); //执行渲染操作
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // window.addEventListener('click', () => {
    //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //   // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    //   raycaster.setFromCamera(mouse, camera);

    //   // 获取raycaster直线和所有模型相交的数组集合
    //   const intersects = raycaster.intersectObjects(scene.children);
    //   if (intersects.length == 0) {
    //     const geometry1 = new THREE.BoxGeometry(100, 100, 100);
    //     const material1 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    //     const newCube = new THREE.Mesh(geometry1, material1);
    //     newCube.position.x = raycaster.ray.origin.x;
    //     newCube.position.y = raycaster.ray.origin.y;
    //     newCube.position.z = raycaster.ray.origin.z + 1000;
    //     // newCube.position.copy(raycaster.ray.origin);
    //     // scene.add(newCube);
    //   }
    // });

    function moveBox() {
      // console.log(direction.multiplyScalar(speed));
      // console.log(cube.position.x);
      // cube.position.add(direction.multiplyScalar(speed));
      // camera.position.set(cube.position);
    }

    function animate() {
      requestAnimationFrame(animate);
      moveBox();
      renderer.render(scene, camera);
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
