import {
  MeshBasicMaterial,
  MeshStandardMaterial,
  Mesh,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Texture,
  TextureLoader,
  WebGLRenderer,
  Vector2,
  HemisphereLight,
  DirectionalLight,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// GLTF 模型加载器
const gltfLoader = new GLTFLoader();
//射线投射器，可基于鼠标点和相机，在世界坐标系内建立一条射线，用于选中模型
const raycaster = new Raycaster();
//鼠标在裁剪空间中的点位
const pointer = new Vector2();

export default class MachineRoom {
  // 渲染器
  renderer: WebGLRenderer;
  // 场景
  scene: Scene;
  // 相机
  camera: PerspectiveCamera;
  // 轨道控制器
  controls: OrbitControls;
  // 存放模型文件的目录
  modelPath: string;
  maps: Map<string, Texture> = new Map();
  cabinets: Mesh[] = [];
  //鼠标划入的机柜
  //鼠标划入的机柜
  curCabinet?: Mesh;

  // 初始化场景
  constructor(canvas: HTMLDivElement, modelPath = './models/') {
    console.log('contructor');
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer = new WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(width, height);
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.set(0, 10, 15);
    this.camera.lookAt(0, 0, 0);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => {
      this.animate(); //执行渲染操作
    }); //监听鼠标、键盘事件
    this.modelPath = modelPath;

    const hemiLight = new HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);

    const dirLight = new DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    this.scene.add(dirLight);
    canvas.appendChild(this.renderer.domElement);
    this.crtTexture('cabinet-hover.jpg');
  }
  selectCabinet(x: number, y: number) {
    const { cabinets, renderer, camera, maps, curCabinet } = this;
    const { width, height } = renderer.domElement;

    // 鼠标的canvas坐标转裁剪坐标
    pointer.set((x / width) * 2 - 1, -(y / height) * 2 + 1);
    // 基于鼠标点的裁剪坐标位和相机设置射线投射器
    raycaster.setFromCamera(pointer, camera);
    // 选择机柜
    const intersect = raycaster.intersectObjects(cabinets)[0];
    const intersectObj = intersect ? (intersect.object as Mesh) : null;
    // 若之前已有机柜被选择，且不等于当前所选择的机柜，取消之前选择的机柜的高亮
    if (curCabinet && curCabinet !== intersectObj) {
      const material = curCabinet.material as MeshBasicMaterial;
      material.setValues({
        map: maps.get('cabinet.jpg'),
      });
    }
    /* 
    若当前所选对象不为空：
      触发鼠标在机柜上移动的事件。
      若当前所选对象不等于上一次所选对象：
        更新curCabinet。
        将模型高亮。
        触发鼠标划入机柜事件。
    否则若上一次所选对象存在：
      置空curCabinet。
      触发鼠标划出机柜事件。
  */
    if (intersectObj) {
      this.onMouseMoveCabinet(x, y);
      if (intersectObj !== curCabinet) {
        this.curCabinet = intersectObj;
        const material = intersectObj.material as MeshBasicMaterial;
        material.setValues({
          map: maps.get('cabinet-hover.jpg'),
        });
        this.onMouseOverCabinet(intersectObj);
      }
    } else if (curCabinet) {
      this.curCabinet = null;
      this.onMouseOutCabinet();
    }
  }

  changeMat(obj: Mesh, map: Texture | null, color: Color) {
    if (map) {
      obj.material = new MeshBasicMaterial({
        map: this.crtTexture(map.name),
      });
    } else {
      obj.material = new MeshBasicMaterial({ color });
    }
  }

  crtTexture(imgName: string) {
    let curTexture = this.maps.get(imgName);
    if (!curTexture) {
      curTexture = new TextureLoader().load(this.modelPath + imgName);
      curTexture.flipY = false;
      curTexture.wrapS = 1000;
      curTexture.wrapT = 1000;
      this.maps.set(imgName, curTexture);
    }
    return curTexture;
  }

  // 加载GLTF模型
  loadGLTF(modelName = '') {
    gltfLoader.load(this.modelPath + modelName, ({ scene: { children } }) => {
      children.forEach((obj: any) => {
        const { map, color } = obj.material as MeshStandardMaterial;
        this.changeMat(obj, map, color);
        if (obj.name.includes('cabinet')) {
          this.cabinets.push(obj);
        }
      });
      this.scene.add(...children);
      setTimeout(() => {
        this.animate();
      }, 100);
    });
  }

  // 连续渲染
  animate() {
    // console.log('animate');
    this.renderer.render(this.scene, this.camera);
    // requestAnimationFrame(() => {
    //   this.animate();
    // });
  }
}
