import { Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [value, setValue] = useState('文本1111');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleBlur = () => {
    console.log('blur');
  };
  const originalHeight =
    document.documentElement.clientHeight || document.body.clientHeight;
  const handleResize = () => {
    const resizeHeight =
      document.documentElement.clientHeight || document.body.clientHeight;
    if (resizeHeight - 0 < originalHeight - 0) {
      //当软键盘弹起，在此处操作
    } else {
      //当软键盘收起，在此处操作
      console.log('收起键盘');
    }
  };

  const handleFocus = () => {
    setTimeout(() => {
      const input = inputRef.current;
      if (!input) return;
      input.select();
    });
  };

  const handleKeyDown = (e: any) => {
    console.log('handleKeyDown');
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize, false);
    window.addEventListener('scroll', handleResize, false);
    return () => {
      window.removeEventListener('resize', handleResize, false);
    };
  }, []);
  return (
    <div id="container">
      <Input
        // ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        type="text"
        value={value}
        onInput={handleInput}
        autoFocus
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export default App;
