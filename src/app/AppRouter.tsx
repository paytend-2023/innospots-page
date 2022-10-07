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
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { GlobalStyles } from 'styles/globalStyles';
import {NotFoundPage} from "./pages/NotFoundPage";
import BoardPreview from "./pages/VizPage/BoardPreview";
import BoardEditorMain from "./pages/VizPage/BoardEditorMain";

registerTheme('default', echartsDefaultTheme);

export function AppRouter() {
  const { i18n } = useTranslation();
  return (
    <ConfigProvider locale={antdLocales[i18n.language]}>
      <BrowserRouter basename="/apps/visualization">
        <Switch>
          <Route path="/workspace/edit" render={() => <BoardEditorMain  />} />
          <Route path="/workspace" render={() => <BoardPreview  hideTitle={true} />} />
          <Route path="/page/edit" render={() => <BoardEditorMain  />} />
          <Route path="/page/create" render={() => <BoardEditorMain />} />
          <Route path="/page/preview" render={() => <BoardPreview  hideTitle={true}/>} />
          <Route path="/apps/workflow/kanban/edit" render={() => <BoardEditorMain />} />
          <Route path="/workflow/kanban" render={() => <BoardPreview  hideTitle={true}/>} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
        <GlobalStyles />
      </BrowserRouter>
    </ConfigProvider>
  );
}
