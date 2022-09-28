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
import { ORIGINAL_TYPE_MAP } from 'app/pages/DashBoardPage/constants';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import {
  initBackgroundTpl,
  initBorderTpl,
  initPaddingTpl,
  initTitleTpl,
  initWidgetName,
  PaddingI18N,
  TitleI18N,
  widgetTpl,
} from '../../WidgetManager/utils/init';

const NameI18N = {
  zh: '应用组件',
  en: 'Application',
};
export const widgetMeta: WidgetMeta = {
  icon: 'application-widget',
  originalType: ORIGINAL_TYPE_MAP.application,
  canWrapped: true,
  controllable: false,
  linkable: false,
  singleton: false,
  canFullScreen: true,

  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        desc: 'app',
        widgetName: NameI18N.zh,
        action: {},
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,

        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'app',
        widgetName: NameI18N.en,
        action: {},
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,

        border: { borderGroup: 'Border' },
      },
    },
  ],
};

export type ApplicationToolkit = WidgetToolkit & {};
export const widgetToolkit: ApplicationToolkit = {
  create: opt => {
    const widget = widgetTpl();
    widget.id = widgetMeta.originalType + widget.id;
    widget.parentId = opt.parentId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'application';
    widget.config.name = opt.name || '';
    widget.config.customConfig.props = [
      { ...initBackgroundTpl("#fff") },
      { ...initTitleTpl() },
      {
        label: 'padding.paddingGroup',
        key: 'paddingGroup',
        comType: 'group',
        rows: [
          {
            label: 'padding.top',
            key: 'top',
            value: 0,
            comType: 'inputNumber',
          },
          {
            label: 'padding.bottom',
            key: 'bottom',
            value: 0,
            comType: 'inputNumber',
          },
          {
            label: 'padding.left',
            key: 'left',
            value: 0,
            comType: 'inputNumber',
          },
          {
            label: 'padding.right',
            key: 'right',
            value: 0,
            comType: 'inputNumber',
          },
        ],
       },
      { ...initBorderTpl() },
    ];
    widget.config.content = opt.content;
    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
  },
  getDropDownList(...arg) {
    const list: WidgetActionListItem<widgetActionType>[] = [
      {
        key: 'edit',
        renderMode: ['edit'],
      },
      {
        key: 'delete',
        renderMode: ['edit'],
      },
      {
        key: 'lock',
        renderMode: ['edit'],
      },
      // {
      //   key: 'group',
      //   renderMode: ['edit'],
      // },
    ];
    return list;
  },
  edit() {},
  save() {},
  // lock() {},
  // unlock() {},
  // copy() {},
  // paste() {},
  // delete() {},
  // changeTitle() {},
  // getMeta() {},
  // getWidgetName() {},
  // //
};

const applicationProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default applicationProto;
