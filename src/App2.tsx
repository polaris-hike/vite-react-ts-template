import { useEffect } from 'react';
import * as THREE from 'three';
import City from './city';
import additional1 from './city/json/city1/additional.json';
import roadnet1 from './city/json/city1/roadnet.json';

import './App.css';

const city1 = {
  additional: additional1,
  roadnet: roadnet1,
};

function App() {
  useEffect(() => {
    const city = new City({
      container: document.getElementById('root'),
    });
    city.init(city1);
  }, []);
  return <div className="App"></div>;
}

export default App;
