import { useEffect, useRef } from 'react';
import svgpath from 'svgpath';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import './App.css';

const transformed = svgpath(
  'm 18,0 H 192.375 a 18 18 0 0 1 18 18 a 18 18 0 0 1 -18 18 H 18 a 18 18 0 0 1 -18 -18 a 18 18 0 0 1 18 -18 z'
)
  .scale(60 / 36)
  .toString();
console.log('transformed:', transformed);
function App() {
  return <div id="container"></div>;
}

export default App;
