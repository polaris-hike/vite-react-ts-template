import { GUI } from 'dat.gui';
import * as THREE from 'three';
import Stats from 'three/examples/js/libs/stats.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import waternormals from './assets/waternormals.jpg';
/** 环境光 */
const AMBIENT_LIGHT_COLOR = 0xffffff;
/** 平行光 */
const DIRECTIONAL_LIGHT_COLOR = 0xffffff;
/** 投影空间大小 */
const SCALE = 65;

const parameters = {
  elevation: 0,
  azimuth: -67,
};
export default class View {
  /** canvas对象 */
  container: any;
  /** 场景 */
  scene: any;
  /** 组 */
  road: any;
  /** 相机 */
  camera: any;
  /** 渲染 */
  renderer: any;
  /** 控制器 */
  controls: any;
  pmremGenerator: any;
  /** 太阳 */
  sun = new THREE.Vector3();
  /** 水 */
  water: any;
  /** 天空盒 */
  sky: any;
  /** 容器宽度 */
  width: any;
  /** 容器高度 */
  height: any;
  /** 性能监视 */
  stats = new Stats();
  gui = new GUI();
  intersection: any;
  options: any;
  ambientLight: any;
  sunLight: any;
  constructor(options?: any) {
    this.container = options.container;
    const { clientWidth, clientHeight } = this.container;
    this.width = options?.width || clientWidth;
    this.height = options?.height || clientHeight;

    this.options = options;

    this.initScene();
    this.updateSun();
    this.initOrbitControls();
    // this.addAxis()
    this.render();
  }
  /** 初始化场景 */
  initScene() {
    const { container, width, height } = this;
    /** 创建场景 */
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xffffff, 10, 6000);
    /** 创建光照 */
    this.ambientLight = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR);
    this.scene.add(this.ambientLight);
    const obj3d = new THREE.Object3D();
    obj3d.position.set(0, 0, 0);
    this.sunLight = new THREE.DirectionalLight(DIRECTIONAL_LIGHT_COLOR, 1);
    this.sunLight.position.set(0, 0, 500);
    this.sunLight.target = obj3d;
    this.scene.add(obj3d);
    this.scene.add(this.sunLight);
    // Skybox
    this.sky = new Sky();
    this.sky.scale.setScalar(20000);
    this.scene.add(this.sky);
    const skyUniforms = this.sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    // Water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        waternormals,
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: this.scene.fog !== undefined,
      // transparent: true,/
    });
    this.water.rotation.x = -Math.PI / 2;
    // this.scene.add( this.water );

    /** 创建相机 */
    const k = width / height;
    this.camera = new THREE.PerspectiveCamera(55, k, 1, 10000);
    this.camera.position.set(800, 400, 100);
    // this.camera.lookAt(new THREE.Vector3(500,100,0))
    /** 创建渲染器 */
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, //开启抗锯齿
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.setClearColor(0xffffff);
    container && container.appendChild(this.renderer.domElement);
    container && container.appendChild(this.stats.dom);
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
  }
  /** 更新太阳 */
  updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    this.sun.setFromSphericalCoords(1, phi, theta);
    this.sunLight.position.copy(this.sun);

    this.sunLight.intensity = parameters.elevation / 200;
    this.ambientLight.intensity = parameters.elevation === 0 ? 0.3 : 0.8;
    this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
    this.water.material.uniforms['sunDirection'].value
      .copy(this.sun)
      .normalize();
    this.scene.environment = this.pmremGenerator.fromScene(this.sky).texture;
    this.render();
  }
  /** 初始化相机控制器 */
  initOrbitControls() {
    // 创建控件对象
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI * 0.45;
    this.controls.target.set(0, 10, 0);
    this.controls.minDistance = 40.0;
    this.controls.maxDistance = 3000.0;
    this.controls.addEventListener('change', () => {
      this.render();
    }); //监听鼠标、键盘事件
    // this.controls.update();
  }
  createGui() {
    const sun = this.gui.addFolder('sun');
    sun
      .add(parameters, 'elevation', 0, 90, 0.1)
      .onChange(this.updateSun.bind(this));
    sun
      .add(parameters, 'azimuth', -180, 180, 0.1)
      .onChange(this.updateSun.bind(this));
    sun.open();
  }
  /** 更新渲染 */
  render() {
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
  }
  addAxis() {
    const axis = new THREE.AxesHelper(300);
    this.scene.add(axis);
  }
}
