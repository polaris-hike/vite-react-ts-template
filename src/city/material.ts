/*
 * @Description:
 * @Author: ldx
 * @Date: 2022-04-25 22:12:44
 * @LastEditors: ldx
 * @LastEditTime: 2022-06-26 18:44:32
 */
import * as THREE from 'three';

// 线条渲染模式
export const laneLineMaterial = new THREE.LineDashedMaterial({
  color: 0xffffff, //线条颜色
  dashSize: 2, // 虚线的大小
  gapSize: 3, // 两个虚线直接间隙的大小
});
export const laneYellowMaterial = new THREE.LineBasicMaterial({
  color: 0xffff00, //线条颜色
});
export const laneMaterial = new THREE.MeshLambertMaterial({
  color: 0x3c3b3b,
  side: THREE.DoubleSide, // 显示的面 THREE.FrontSide	背面 THREE.BackSide	前面 THREE.DoubleSide	双面
});

export const junctionMaterial = new THREE.MeshLambertMaterial({
  color: 0x3c3b3b,
  reflectivity: 0.2,
  polygonOffset: true,
  polygonOffsetFactor: -2,
  polygonOffsetUnits: 1,
  side: THREE.DoubleSide,
});

export const buildingMaterial = new THREE.MeshPhysicalMaterial({
  // color:0x5e5d5d,
  color: new THREE.Color(`rgb(255,230,230)`),
  side: THREE.DoubleSide,
});
export const linematerial = new THREE.LineBasicMaterial({ color: 0xffffff });
