/*
 * @Description:
 * @Author: ldx
 * @Date: 2022-06-26 12:25:37
 * @LastEditors: ldx
 * @LastEditTime: 2022-06-26 16:20:11
 */
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// shape转数组
export function parseShape(shape) {
  return shape.split(' ').map((coord) => coord.split(',').map(Number));
}

const zUnitVector = new THREE.Vector3(0, 0, 1); //沿着z轴方向单位向量

// 计算车道边线
export function extrudeLine(cords, offset) {
  if (cords.length < 2) return []; // 少于两个点，不成线段
  const pointsArray = [];
  if (offset == 0) return cords;
  let tangent, vertical;
  const [p1, p2] = getAdjacentPoints(cords, 0);
  tangent = p1.clone().sub(p2).normalize();
  // 切线绕z轴旋转90度计算垂线
  // 绘制顺序会影响旋转后轴的角度
  vertical = tangent.clone().applyAxisAngle(zUnitVector, Math.PI / 2);

  /** 边线 */
  const first = p1.clone().add(vertical.clone().multiplyScalar(offset));
  pointsArray.push(first);

  for (let i = 1; i < cords.length - 1; i++) {
    // 三个点坐标
    const p1 = cords[i - 1];
    const p2 = cords[i];
    const p3 = cords[i + 1];
    // 计算三个点构成的两条线的方向
    const dir1 = p1.clone().sub(p2).normalize();
    const dir2 = p3.clone().sub(p2).normalize();
    // 两条直线角平分线方向
    const angleBisector = dir2.clone().add(dir1).normalize(); // 角平分线
    const angCos = dir1.clone().dot(dir2); //两条直线方向向量夹角余弦值
    const ang = Math.acos(angCos);

    // 对边 / 斜边 = sin  sideLength = 对边(车道宽度的一半) / sin
    let sideLength = Math.abs(offset) / Math.sin(ang / 2); //圆心与两条直接交叉点距离
    const z = dir1.clone().cross(dir2).z;
    if (offset > 0) {
      if (z < 0) {
        // 两个向量的叉乘得到的z方向
        sideLength = -sideLength;
      }
    } else {
      if (z > 0) {
        sideLength = -sideLength;
      }
    }

    if ((ang * 180) / Math.PI < 35) {
      const point = p2
        .clone()
        .add(angleBisector.clone().multiplyScalar(sideLength));
      pointsArray.push(point);
      // }
    } else {
      const point = p2
        .clone()
        .add(angleBisector.clone().multiplyScalar(sideLength));
      pointsArray.push(point);
    }
  }

  const [p3, p4] = getAdjacentPoints(cords, cords.length - 1);
  tangent = p3.clone().sub(p4).normalize();
  // 切线绕z轴旋转90度计算垂线
  vertical = tangent.clone().applyAxisAngle(zUnitVector, Math.PI / 2);
  const second = cords[cords.length - 1];
  const endpoint = second.clone().add(vertical.clone().multiplyScalar(offset));
  pointsArray.push(endpoint);

  return pointsArray;
}
/** 获取前后相邻两个点 */
export function getAdjacentPoints(cords, i) {
  let p1 = null;
  let p2 = null;
  if (cords[i + 1]) {
    p1 = cords[i];
    p2 = cords[i + 1];
  } else {
    p1 = cords[i - 1];
    p2 = cords[i];
  }
  return [p1, p2];
}
// 包装成数组
export function forceArray(t) {
  return Array.isArray(t) ? t : [t];
}

export function loadOBJFile(url, material) {
  return new Promise((resolve, reject) => {
    const objLoader = new OBJLoader();
    objLoader.load(
      `/src/案例-城市/assets/${url}`,
      (obj) => {
        if (material) {
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = material;
            }
          });
        }
        resolve(obj);
      },
      () => {
        //
      },
      reject
    );
  });
}
