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
import styled from 'styled-components/macro';
import { ApplicationWidgetContent } from '../../../pages/Board/slice/types';
import { getComponentByName } from '../../../../../components/applicationWidgets';
import React, { useContext } from 'react';
import { getGlobalConfigState, POWERED_BY_QIANKUN } from 'utils/globalState';
import { SharedComponent } from 'utils/sharedComponents';

type ApplicationWidgetProps = {
  applicationWidgetContent: ApplicationWidgetContent
};
export const ApplicationWidgetCore: React.FC<ApplicationWidgetProps> = ({applicationWidgetContent}) => {
  let AppComponent = getComponentByName("systemInfo");
  if(POWERED_BY_QIANKUN){
    console.log("applicationWidgetContent.appWidgetInfo.code====",applicationWidgetContent.appWidgetInfo.code)
    // AppComponent = <SharedComponent name={applicationWidgetContent.appWidgetInfo.code} />;
     // AppComponent =  getMasterState().getComponentByNameFun(applicationWidgetContent.appWidgetInfo.entry)
  }
  const { commonParams } = getGlobalConfigState();
  return <Wrapper>
          <div className="appItemContent" style={{width: '100%', height: '100%'}}>
            <SharedComponent name={applicationWidgetContent.appWidgetInfo.code} />
            {/*<AppComponent appWidgetConfig = {applicationWidgetContent.appWidgetConfig} commonParams = {commonParams}/>*/}
          </div>
        </Wrapper>;
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
