import { StyleProvider } from '@ant-design/cssinjs';
import { Button, ConfigProvider, theme, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import styles from './app.module.css';
function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#00B96B',
        },
        components: {
          Layout: {
            colorBgBody: '',
          },
        },
      }}>
      <StyleProvider hashPriority="high">
        <AntdApp>
          <div className={styles.app}>
            <div className={styles.container}>
              Hello World，这是<span>React课程第一节</span>
              <Button
                type="primary"
                className="!bg-lime-400 !text-emerald-900"
                target="_blank">
                点此打开
              </Button>
            </div>
          </div>
        </AntdApp>
      </StyleProvider>
    </ConfigProvider>
  );
}

export default App;
