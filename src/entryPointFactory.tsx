/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'antd/dist/antd.min.css';
import 'app/assets/fonts/iconfont.css';
import {DatartContext, ElementType} from 'app/contexts/DatartContext';
import 'core-js/features/string/replace-all';
import React, { Fragment } from 'react';
import 'react-app-polyfill/ie11'; // TODO(Stephen): check if need it
import 'react-app-polyfill/stable'; // TODO(Stephen): check if need it
import { Inspector } from 'react-dev-inspector';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { configureAppStore } from 'redux/configureStore';
import { ThemeProvider } from 'styles/theme/ThemeProvider';
import { Debugger } from 'utils/debugger';
import './locales/i18n';

export const generateEntryPoint = (EntryPointComponent, container, cfg) => {
  const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
  const MOUNT_NODE = container || document.getElementById('root') as HTMLElement;
  const store = configureAppStore();
  Debugger.instance.setEnable(IS_DEVELOPMENT);
  const config = {
    code:'page',
    titleElement: [
      {
        label: '',
        name: 'name',
        desc: '页面名称',
        placeholder: '请输入页面名称',
        required: true,
        type: ElementType.INPUT,
        gridSize: 5,
        length: 15
      },{
        label: '',
        name: 'subName',
        desc: '页面描述',
        placeholder: '请输入页面描述',
        required: true,
        type: ElementType.INPUT,
        gridSize: 5,
        length: 30
      },{
        label: '',
        name: 'categoryId',
        desc: '页面分类',
        placeholder: '请选择页面分类',
        required: true,
        type: ElementType.SELECT,
        gridSize: 5,
        defaultValue: parseInt('0'),
        options: [{name:'未分类',value:0},{name:'测试分类222',value:13}]
      }
    ],
    urls:{
      viewsUrl: `/data-set/list`,
      viewDetailUrl: `/data-set/code`,
      dataUrl: `/data-set/data`,
      applicationsUrl: `/application/list`,
      applicationWidgetsUrl: `/application/widgets`,
      detailUrl: ``,
      saveBoardsUrl: `/page`,
      fileUploadUrl: `/dashboard/files/image`,
      functionSupportUrl: `/widget/data/function/support`,
      editBoardPageUrl: `/page/161/viz/edit`,
    },
    applicationEnable: false
  };

  const InspectorWrapper = IS_DEVELOPMENT ? Inspector : Fragment;
  ReactDOM.render(
    <InspectorWrapper>
      <Provider store={store}>
        <ThemeProvider>
          <HelmetProvider>
            <React.StrictMode>
              <EntryPointComponent config={config}/>
            </React.StrictMode>
          </HelmetProvider>
        </ThemeProvider>
      </Provider>
    </InspectorWrapper>,
    MOUNT_NODE,
  );

  // Hot reLoadable translation json files
  if (module.hot) {
    module.hot.accept(['./locales/i18n'], () => {
      // No need to render the App again because i18next works with the hooks
    });
  }

  if (!IS_DEVELOPMENT) {
    if (typeof (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => void 0;
    }
  }
};

