import {
  StyleProvider,
  legacyLogicalPropertiesTransformer,
} from '@ant-design/cssinjs';
import ReactDOM from 'react-dom/client';
import App from './Cesium';
import './index.css';
import './input.css';

// import('vconsole').then((module) => {
//   const VConsole = module.default;
//   (window as any).vConsole = new VConsole();
// });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StyleProvider
    hashPriority="high"
    transformers={[legacyLogicalPropertiesTransformer]}>
    <App />
  </StyleProvider>
);
