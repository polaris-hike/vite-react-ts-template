import {
  Viewer,
  Ion,
  Terrain,
  Cartesian3,
  Math as CesiumMath,
  createOsmBuildingsAsync,
  Entity,
  Color,
  JulianDate,
  ClockRange,
  TimeIntervalCollection,
  TimeInterval,
  VelocityOrientationProperty,
  SampledPositionProperty,
} from 'cesium';
import React, { useEffect, useRef } from 'react';
(window as any).CESIUM_BASE_URL = '/';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { testPointData } from './testData';

const robotUrl = 'http://127.0.0.1:5173/models/Cesium_Air.glb';
const towerUrl = 'http://127.0.0.1:5173/models/tower-processed.glb';

export default function Cesium() {
  const viewRef = useRef<Viewer | null>(null);
  const robotRef = useRef<Entity | null>(null);
  const initCesium = async () => {
    Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNTZkMDc0Mi0xNTkzLTQ3MGUtODk5Ny01NzM1ZDFiMTJiOGUiLCJpZCI6MzAyMjgsImlhdCI6MTY1OTIzOTI4NX0.yiWJC0H0LZPln2zT2ZGVzy246AX-shccVbmCuZEA7ig';

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const viewer = new Viewer('cesiumContainer', {
      terrain: Terrain.fromWorldTerrain(),
      animation: false,
      shouldAnimate: false,
      timeline: false, //时间线不显示
      baseLayerPicker: false,
      fullscreenButton: false, //全屏按钮不显示
      navigationHelpButton: false, //是否显示帮助信息控件
      infoBox: false,
      homeButton: false, //是否显示home键
      geocoder: false, //是否显示地名查找控件        如果设置为true，则无法查询
      sceneModePicker: false, //是否显示投影方式控件  三维/二维
    });
    viewRef.current = viewer;
    // 去除 cesium logo
    (viewer as any)._cesiumWidget._creditContainer.style.display = 'none';
    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    // viewer.camera.flyTo({
    //   destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
    //   orientation: {
    //     heading: CesiumMath.toRadians(0.0),
    //     pitch: CesiumMath.toRadians(-15.0),
    //   },
    // });

    // // Add Cesium OSM Buildings, a global 3D buildings layer.
    // const buildingTileset = await createOsmBuildingsAsync();
    // viewer.scene.primitives.add(buildingTileset);

    setRobot();
  };

  const setRobot = () => {
    const viewer = viewRef.current;
    if (!viewer) return;
    const target = Cartesian3.fromDegrees(
      testPointData[0].position[0],
      testPointData[0].position[1],
      50.5
    );
    const offset = new Cartesian3(
      -37.048378684557974,
      -24.852967044804245,
      12.352023653686047
    );
    // 设置三维地图的聚焦点
    viewer.scene.camera.lookAt(target, offset);
    const pointArray1 = [];
    const topLineArray = [];
    const bottomLineArray = [];
    for (const i of testPointData) {
      // 将经纬度坐标转为 3d 地图的坐标
      const position = Cartesian3.fromDegrees(i.position[0], i.position[1], 50); // 顶部line有高度
      const position1 = Cartesian3.fromDegrees(i.position[0], i.position[1]); // 底部line 没有高度
      pointArray1.push({
        name: i.name,
        position: Cartesian3.fromDegrees(i.position[0], i.position[1]),
      });
      // 增加机器人运动轨迹以及机器人高度
      /*  property.addSample(Cesium.JulianDate.addSeconds(start, num += 10, new Cesium.JulianDate()),
            Cesium.Cartesian3.fromDegrees(i.position[0], i.position[1], 48));*/
      topLineArray.push(position);
      bottomLineArray.push(position1);
    }
    // 创建机器人
    const robot = viewer.entities.add({
      name: 'robot',
      position: topLineArray[0],
      //orientation: new Cesium.VelocityOrientationProperty(property),
      model: {
        uri: robotUrl,
        scale: 0.5,
      },
    });
    robotRef.current = robot;
    // 创建电塔模型
    for (const i of pointArray1) {
      viewer.entities.add({
        name: i.name,
        position: i.position,
        model: {
          // uri: this.towerUrl,
        },
      });
    }
    // 灯塔顶点连线
    const topLine = viewer.entities.add({
      polyline: {
        show: true,
        positions: topLineArray,
        width: 1,
        material: Color.WHITE,
      },
    });
    // 灯塔底部连线
    const bottomLine = viewer.entities.add({
      polyline: {
        show: true,
        positions: bottomLineArray,
        width: 5,
        material: Color.YELLOW,
      },
    });

    robotMove();
  };

  const robotMove = () => {
    const property = new SampledPositionProperty();

    const viewer = viewRef.current;
    const robot = robotRef.current;
    if (!viewer || !robot) return;
    const start = JulianDate.fromDate(new Date(2015, 2, 25, 16));
    const stop = JulianDate.addSeconds(
      start,
      testPointData.length,
      new JulianDate()
    );
    console.log(testPointData);
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = ClockRange.LOOP_STOP; //Loop at the end
    viewer.clock.multiplier = 0.1; // 倍速
    viewer.clock.shouldAnimate = true; // 控制是否能够移动
    let num = 0;
    property.addSample(
      JulianDate.addSeconds(start, num, new JulianDate()),
      Cartesian3.fromDegrees(
        testPointData[0].position[0],
        testPointData[0].position[1],
        48
      )
    );
    for (const i of testPointData) {
      // 增加机器人运动轨迹以及机器人高度
      property.addSample(
        JulianDate.addSeconds(start, (num += 1), new JulianDate()),
        Cartesian3.fromDegrees(i.position[0], i.position[1], 48)
      );
    }
    robot.position = property;
    robot.orientation = new VelocityOrientationProperty(property);
    robot.availability = new TimeIntervalCollection([
      new TimeInterval({
        start: start,
        stop: stop,
      }),
    ]);
    viewer.trackedEntity = robot;
  };

  useEffect(() => {
    initCesium();
  }, []);

  return <div id="cesiumContainer" />;
}
