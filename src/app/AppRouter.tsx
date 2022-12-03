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
import React from "react";
import { ConfigProvider } from 'antd';
import echartsDefaultTheme from 'app/assets/theme/echarts_default_theme.json';
import { registerTheme } from 'echarts';
import { antdLocales } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import {HashRouter, Route, Switch} from 'react-router-dom';
import { GlobalStyles } from 'styles/globalStyles';
import BoardShow from "./pages/VizPage/BoardShow";
import Workspace from "./pages/VizPage/Workspace";
import BoardForm from "./pages/VizPage/BoardForm";

registerTheme('default', echartsDefaultTheme);

export function AppRouter() {
  const { i18n } = useTranslation();
  return (
    <ConfigProvider locale={antdLocales[i18n.language]}>
      <HashRouter basename="/apps/visualization">
        <Switch>
          <Route path="/" exact component={Workspace} />
          <Route path="/workspace" exact component={Workspace} />
          <Route path="/workspace/:pageType" exact component={BoardForm} />
          <Route path="/page/:pageId" exact component={BoardShow} />
          <Route path="/page/form/:pageType/:pageId?" exact component={BoardForm} />
        </Switch>
        <GlobalStyles />
      </HashRouter>
    </ConfigProvider>
  );
}
