import { useEffect } from 'react';
import * as THREE from 'three';
// 引入轨道控制器扩展库OrbitControls.js
import Stats from 'three/examples/js/libs/stats.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import rain from './assets/rain.png';
import earth from './assets/地球.png';

import './App.css';
import MachineRoom from './maschineRoom';

function App() {
  useEffect(() => {
    const room = new MachineRoom(document.getElementById('root'));
    room.loadGLTF('machineRoom.gltf');
    room.animate();
  }, []);
  return (
    <div id="container">
      <div id="per"> </div>
    </div>
  );
}

export default App;
