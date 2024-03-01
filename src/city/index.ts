/*
 * @Description:
 * @Author: ldx
 * @Date: 2022-06-26 11:05:04
 * @LastEditors: ldx
 * @LastEditTime: 2022-06-26 23:12:37
 */
import _ from 'lodash';
import * as THREE from 'three';
import additional1 from './json/city1/additional.json';
import roadnet1 from './json/city1/roadnet.json';
import additional2 from './json/city2/additional.json';
import roadnet2 from './json/city2/roadnet.json';
import {
  laneLineMaterial,
  laneYellowMaterial,
  laneMaterial,
  junctionMaterial,
  buildingMaterial,
  linematerial,
} from './material';
const city2 = {
  additional: additional2,
  roadnet: roadnet2,
};

import { parseShape, extrudeLine } from './utils/index.js';
import View from './view';

const city1 = {
  additional: additional1,
  roadnet: roadnet1,
};

export default class City extends View {
  roadnet: any;
  additional: any;
  group: any;
  constructor(options?: any) {
    super(options);
    super.createGui();
    this.createGui();
  }
  async init(options?: any) {
    this.group && this.scene.remove(this.group);
    this.group = new THREE.Group();
    this.roadnet = options.roadnet;
    this.additional = options.additional;
    this.createLand();
    this.createEdge();
    this.createJunction();
    this.createBuilding();
    this.group.rotateX(-Math.PI / 2);
    const [left, top, right, bottom] = this.roadnet.net.location.convBoundary
      .split(',')
      .map(Number);
    this.group.translateX(-(right - left) / 2);
    this.group.translateY(-(bottom - top) / 2);
    this.scene.add(this.group);
    this.render();
  }
  sumoXYZToThreeXYZ([x, y, z = 0]) {
    const [left, top] = this.roadnet.net.location.netOffset
      .split(',')
      .map(Number);
    return new THREE.Vector3(x - left, y - top, z);
  }
  /** 创建地面 */
  createLand() {
    const { roadnet } = this;
    const [left, top, right, bottom] = roadnet.net.location.convBoundary
      .split(',')
      .map(Number);
    const landGeometry = new THREE.BufferGeometry();

    const points = [
      [left, top, 0],
      [right, top, 0],
      [left, bottom, 0],

      [right, bottom, 0],
      [left, bottom, 0],
      [right, top, 0],
    ];
    const uvs = new Float32Array([0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1]);
    const positions = [];
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      positions.push(...point);
    }
    landGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    landGeometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);

    landGeometry.computeVertexNormals();

    const landMaterial = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 1,
      color: 0x5e5d5d,
      side: THREE.DoubleSide,
      polygonOffset: true, // 解决深度冲突
      polygonOffsetFactor: 10,
      polygonOffsetUnits: 1,
    });
    const landMesh = new THREE.Mesh(landGeometry, landMaterial);
    landMesh.name = 'Land'; // 地面
    landMesh.receiveShadow = true; // 接收光照阴影
    // landMesh.renderOrder = -10
    this.group.add(landMesh);
  }
  /** 创建车道 */
  createEdge() {
    const { edge: _edge } = this.roadnet.net;
    const group = new THREE.Group();
    group.name = 'Edge';
    _edge.forEach((edge: any) => {
      (Array.isArray(edge.lane) ? edge.lane : [edge.lane]).map(
        (lane: any, index: number) => {
          const cords = parseShape(lane.shape).map(
            (coord: any) => new THREE.Vector3(coord[0], coord[1])
          );
          /** 计算车道边线 */
          // 获取车道宽度
          const width = lane.width || 3.2;
          // 计算车道左右两条边线的顶点坐标
          const left = extrudeLine(cords, width / 2);
          const right = extrudeLine(cords, -width / 2);
          if (index < edge.lane.length - 1) {
            // 绘制车道线
            const geometry = new THREE.BufferGeometry().setFromPoints(right);

            // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
            const line = new THREE.Line(geometry, laneLineMaterial);
            line.computeLineDistances();
            line.renderOrder = 10;
            // 把物体添加进场景中
            group.add(line);
          }
          if (lane.id.startsWith('-')) {
            // 绘制双黄线
            const y1 = extrudeLine(cords, -width / 2 + 0.5);
            const y2 = extrudeLine(cords, -width / 2 - 0.5);
            const geometry1 = new THREE.BufferGeometry().setFromPoints(y1);
            const geometry2 = new THREE.BufferGeometry().setFromPoints(y2);
            // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
            const line1 = new THREE.Line(geometry1, laneYellowMaterial);
            const line2 = new THREE.Line(geometry2, laneYellowMaterial);
            line1.renderOrder = 10;
            line2.renderOrder = 10;
            // 把物体添加进场景中
            group.add(line1, line2);
          }
          // 根据顶点坐标自定义形状
          const heartShape = new THREE.Shape(left.concat(right.reverse()));
          // 创建一个顶点缓冲几何体
          const laneGeometry = new THREE.ShapeGeometry(heartShape);
          // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
          const laneMesh = new THREE.Mesh(laneGeometry, laneMaterial);
          laneMesh.name = `车道${index + 1}`;
          // 把物体添加进场景中
          group.add(laneMesh);
        }
      );
    });
    this.group.add(group);
  }
  /** 创建连接路口 */
  createJunction() {
    const { junction } = this.roadnet.net;
    const group = new THREE.Group();
    group.name = 'Junction';
    junction.map((junction) => {
      if (junction.type === 'internal') return;
      const cords = parseShape(junction.shape).map(
        (coord) => new THREE.Vector3(coord[0], coord[1])
      );
      if (cords.length < 3) return;
      const shape = new THREE.Shape(cords);
      const shapeGeometry = new THREE.ShapeGeometry(shape, 40);

      const mesh = new THREE.Mesh(shapeGeometry, junctionMaterial);
      group.add(mesh);
    });
    group.renderOrder = 12;
    this.group.add(group);
  }
  /** 创建建筑 */
  createBuilding() {
    const { additional } = this;
    if (!additional) return;
    const { poly } = additional.additional;
    if (!poly) {
      console.assert('建筑数据不存在');
      return;
    }
    const buildingGroup = new THREE.Group();
    //  const waterGroup = new THREE.Group()
    buildingGroup.name = 'Building';
    // waterGroup.name = 'Water'
    for (let i = 0; i < poly.length; i++) {
      const polygon = poly[i];
      if (polygon.type !== 'water') {
        const points = parseShape(polygon.shape).map(
          (coord) => new THREE.Vector3(coord[0], coord[1])
        );
        const shape = new THREE.Shape(points);
        const building = new THREE.ExtrudeGeometry(shape, {
          //拉伸造型
          depth: Math.random() * 20 + 10, //拉伸长度
          bevelEnabled: false, //无倒角
        });

        const mesh = new THREE.Mesh(building, buildingMaterial);
        buildingGroup.add(mesh);

        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const line = new THREE.LineSegments(edges, linematerial);
        buildingGroup.add(line);
      }
    }
    this.group.add(buildingGroup);
  }
  createGui() {
    const citys: any = {
      city1,
      city2,
    };
    const cityF = this.gui.addFolder('citys');
    cityF
      .add(
        {
          city: 'city1',
        },
        'city',
        ['city1', 'city2']
      )
      .onChange((value) => {
        console.log('----', value);
        this.init(citys[value]);
      });
    cityF.open();
  }
}
