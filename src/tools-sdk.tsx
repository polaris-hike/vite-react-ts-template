import {
  consumerConfig,
  ApiEnv,
  Status,
  ok,
  ToolType,
  Application,
} from '@crc/tools-sdk';
import { IBaseEvent } from '@crc/tools-sdk/types';
import { IApplication } from '@crc/tools-sdk/types';
import { useEffect, useRef } from 'react';

import './App.css';

const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDb2RlbWFvIEF1dGgiLCJ1c2VyX3R5cGUiOiJzdHVkZW50IiwiZGV2aWNlX2lkIjowLCJ1c2VyX2lkIjoxMDAwNzA0MjIyLCJpc3MiOiJBdXRoIFNlcnZpY2UiLCJwaWQiOiIyM0FWWGFsbyIsImV4cCI6MTY4MjMwMzc1OCwiaWF0IjoxNjc4NDE1NzU4LCJqdGkiOiJhNTY0MTZlZi0wZjYxLTQ5YzItOTM1ZC0wYTg0YWM5YjlhODEifQ.obyfpoeEyMJD1U4yEJPKapEB8ki3g16IUhcuLiVTqSs';
const devToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDb2RlbWFvIEF1dGgiLCJ1c2VyX3R5cGUiOiJzdHVkZW50IiwiZGV2aWNlX2lkIjowLCJ1c2VyX2lkIjoxMDAxNDIzNzg3LCJpc3MiOiJBdXRoIFNlcnZpY2UiLCJwaWQiOiIyM0FWWGFsbyIsImV4cCI6MTY5MzA0MjE0OCwiaWF0IjoxNjg5MTU0MTQ4LCJqdGkiOiIyZWI5ZTVhZC1kOWQ1LTQ4ZjItYjFjMi01NzJmZjMzNWFjMWUifQ.tzOf_H0bAygYuczL4QP1ut7SFAI6DrtPJq8VvVtlFp0';

// const testTOken =
//   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDb2RlbWFvIEF1dGgiLCJ1c2VyX3R5cGUiOiJzdHVkZW50IiwiZGV2aWNlX2lkIjowLCJ1c2VyX2lkIjoxMDAwNzA0MjIyLCJpc3MiOiJBdXRoIFNlcnZpY2UiLCJwaWQiOiJZYXhndFVUUSIsImV4cCI6MTY5MDA4MTQ2OSwiaWF0IjoxNjg2MTkzNDY5LCJqdGkiOiI5YTJkOWZiMS02NzgzLTQ4NjQtOTU5YS0zYWQ2NDRiYjk3NmIifQ.jLbcCfE7PbUfegdZikvyiGV1mShn_6tCbMtkwaAb2_4';
function App() {
  const sdkRef = useRef<any>(null);
  async function initConfig() {
    console.log('initConfig');
    const result = await consumerConfig({
      /**
       * 业务方应用的id
       */
      appId: '2',
      /**
       * 签名。用于鉴权。
       */
      signature: '123456',
      /**
       * 登录态Token
       */
      // token: '',
      token:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJDb2RlbWFvIEF1dGgiLCJ1c2VyX3R5cGUiOiJzdHVkZW50IiwiZGV2aWNlX2lkIjowLCJ1c2VyX2lkIjoxMjg0OTM0OCwiaXNzIjoiQXV0aCBTZXJ2aWNlIiwicGlkIjoiWWF4Z3RVVFEiLCJleHAiOjE2OTMwMzk5MjEsImlhdCI6MTY4OTE1MTkyMSwianRpIjoiMmY2MDRiYjMtN2IxNC00ZTFkLWFlZWQtNGQ0NTQ3YTkwNWQ3In0.kyNQxWinRGV6ptKZfQKqck_K2-7Lw3ZRCajiGgAqxIY',
      /**
       * SDK对应的API环境。仅在直接使用webSDK时有效。
       */
      apiEnv: ApiEnv.Test,
      /**
       * 注入的工具配置项
       */
      toolOptions: {
        /**
         * 工具类型
         */
        type: ToolType.Kn,
        debugUrl: 'http://192.168.112.122:3000/editor',
        // debugUrl:
        //   'https://test-tanyue-kn.codemao.cn/editor/?fileUrl=https://dev-cdn-common.codemao.cn/dev/922/user-files/FvXm8qRD4zUTUYe9QSUIJW1EijiA&work_id=33043045',
        /**
         * iframe的容器，一个div dom
         */
        container: document.getElementById('container'),
        /**
         * 事件监听，监听来自工具内部的事件。
         */
        on: (evt: IBaseEvent) => {
          console.log('onEvent: ', evt);
        },
        /**
         * 工具的配置项，不同的工具可支持的配置项不同。
         */
        configuration: {},
        /**
         * 传入作品id，在初始化时会默认加载该作品。
         */
        // workId: 33056446,
        // courseUrl: 'https://staging-neko.codemao.cn/editor?courseCode=QY8joeR2',
        // courseUrl:
        //   'https://test-tanyue-kn.codemao.cn/editor?courseCode=kz1ZYxiq',
        // courseUrl: 'http://192.168.108.130:3001/editor?courseCode=QQkra3E1',
        // courseUrl: 'http://localhost:3001/editor?courseCode=CEbbMDTH',
      },
    });
    // 检查SDK初始化是否成功
    if (ok(result)) {
      const sdk = result.body.cSDK;
      // 待application模块准备完成后，再加载作品
      if (ok(await sdk.application.ready())) {
        // console.log(11111);
        sdkRef.current = sdk;
        // sdk.application.loadWork({
        //   work: {
        //     type: 'courseUrl',
        //     courseUrl: 'http://localhost:3001/editor?courseCode=CEbbMDTH',
        //   },
        // });
        // sdk.application.loadWork({
        //   work: {
        //     type: 'workId',
        //     workId: 33030430,
        //   },
        // });
      }
    }
  }

  const loadWork = () => {
    const sdk = sdkRef.current;
    if (sdk) {
      // sdk.application.loadWork({
      //   work: {
      //     type: 'workId',
      //     workId: 33030430,
      //   },
      // });
    }
  };

  const loadCourse = () => {
    const sdk = sdkRef.current;
    if (sdk) {
      sdk.application.loadWork({
        work: {
          type: 'courseUrl',
          courseUrl: 'http://192.168.108.130:3000?courseCode=sFDkN6T9',
        },
      });
    }
  };

  const loadFile = () => {
    const sdk = sdkRef.current;
    if (sdk) {
      sdk.application.loadWork({
        work: {
          type: 'fileUrl',
          fileUrl: 'http://192.168.108.130:3000?courseCode=sFDkN6T9',
        },
      });
    }
  };

  const saveWork = () => {
    const sdk = sdkRef.current;
    if (sdk) {
      sdk.application.saveWork({
        workName: 'tools',
      });
    }
  };

  useEffect(() => {
    initConfig();
  }, []);
  return (
    <>
      <div id="container"></div>
      <div id="getProject">
        <button>GET_CURRENT_WOOD_PROJECT</button>
      </div>
      <div id="loadWork" onClick={loadWork}>
        <button>loadWork</button>
      </div>
      <div id="loadCourse" onClick={loadCourse}>
        <button>loadCourse</button>
      </div>
      <div id="loadFile" onClick={loadFile}>
        <button>loadFile</button>
      </div>
      <div id="saveWork" onClick={saveWork}>
        <button>saveWork</button>
      </div>
      <div id="saveWork" onClick={saveWork}>
        <button>重做</button>
      </div>
      <div id="addMaterial">
        <button>ADD_MATERIAL_CLASSIFICATION</button>
      </div>
    </>
  );
}

export default App;
