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
import ReactDOM from 'react-dom';
import { AppRouter } from 'app/AppRouter';
import { generateEntryPoint } from 'entryPointFactory';
import './public-path';
import { setGlobalConfigState, setMasterState } from './utils/globalState'; 

function render(props) {
  const { container } = props;
  const rootNode = container ? container.querySelector('#root') : document.querySelector('#root')
  generateEntryPoint(AppRouter, rootNode);
}

// function storeTest(props) {
//   props.onGlobalStateChange((value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev), true);
//   props.setGlobalState({
//     ignore: props.name,
//     user: {
//       name: props.name,
//     },
//   });
// }

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap(props) {

  try {
    //@ts-ignore
    __webpack_require__.S["default"] = undefined;
  } catch (e) {}
  setMasterState({
    ...props
  });

  console.log('[react16] react app bootstraped',props);
}
/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log('[react16] props from main framework', props);
  setGlobalConfigState({
    ...props
  });
  try {
    props.setLoading(false)
  } catch (e) {} finally {
    render(props);
  }
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
   const { container } = props;
   console.log('unmount props', container);
   ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}
/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
  setGlobalConfigState({
    ...props
  });
}
