import { Button, Popover } from 'antd';
import { useEffect, useRef, useState } from 'react';

import './App.css';

function App() {
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );
  return (
    <div id="container">
      <Popover trigger="click" content={content} title="Title">
        <Button type="primary">Hover me</Button>
      </Popover>
    </div>
  );
}

export default App;
