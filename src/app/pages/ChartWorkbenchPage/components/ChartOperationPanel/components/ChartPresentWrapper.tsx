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

import useResizeObserver from 'app/hooks/useResizeObserver';
import ChartI18NContext from 'app/pages/ChartWorkbenchPage/contexts/Chart18NContext';
import { IChart } from 'app/types/Chart';
import {ChartConfig, ChartDataConfig, SelectedItem} from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import ChartDataView from 'app/types/ChartDataView';
import { FC, memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import {SPACE_LXG, SPACE_MD, SPACE_XS} from 'styles/StyleConstants';
import ChartGraphPanel from './ChartGraphPanel';
import ChartPresentPanel from './ChartPresentPanel';
import {ChartConfigReducerActionType} from "../../../slice/constant";
import {ChartConfigPayloadType} from "../../../slice/types";
import ChartDataConfigPanel from "./ChartConfigPanel/ChartDataConfigPanel";

const ChartPresentWrapper: FC<{
  containerHeight?: number;
  containerWidth?: number;
  chart?: IChart;
  dataset?: ChartDataSetDTO;
  chartConfig?: ChartConfig;
  expensiveQuery: boolean;
  allowQuery: boolean;
  onChartChange: (c: IChart) => void;
  onRefreshDataset?: () => void;
  onCreateDownloadDataTask?: () => void;
  dataView?: ChartDataView;
  selectedItems?: SelectedItem[];
  onChange?: (type: string, payload: ChartConfigPayloadType) => void;
}> = memo(
  ({
    containerHeight,
    containerWidth,
    chart,
    dataset,
    expensiveQuery,
    chartConfig,
    allowQuery,
    dataView,
    onChartChange,
    onRefreshDataset,
    onCreateDownloadDataTask,
    selectedItems,
    onChange,
  }) => {
    const { ref: ChartGraphPanelRef } = useResizeObserver<any>({
      refreshMode: 'debounce',
      refreshRate: 500,
    });

    const borderWidth = useMemo(() => {
      return +SPACE_LXG.replace('px', '');
    }, []);

    const onDataConfigChanged = (
      ancestors,
      config: ChartDataConfig,
      needRefresh?: boolean,
    ) => {
      onChange?.(ChartConfigReducerActionType.DATA, {
        ancestors: ancestors,
        value: config,
        needRefresh,
      });
    };

    return (
      <StyledChartPresentWrapper borderWidth={borderWidth}>
        <ChartI18NContext.Provider value={{ i18NConfigs: chartConfig?.i18ns }}>
          <StyledChartWrapper>
            <div ref={ChartGraphPanelRef}>
              <StyledDragableFieldWrapper>
                <ChartDataConfigPanel
                  dataConfigs={chartConfig?.datas}
                  expensiveQuery={expensiveQuery}
                  onChange={onDataConfigChanged}
                  type="field"
                />
              </StyledDragableFieldWrapper>
              {/*<ChartGraphPanel*/}
              {/*  chart={chart}*/}
              {/*  chartConfig={chartConfig}*/}
              {/*  onChartChange={onChartChange}*/}
              {/*/>*/}
            </div>
              <StyledConfigChartWrapper>
                <StyledDragableConfigWrapper height={
                  (containerHeight || 0) -
                  (ChartGraphPanelRef?.current?.offsetHeight|| 0)
                }>
                  <ChartDataConfigPanel
                    dataConfigs={chartConfig?.datas}
                    expensiveQuery={expensiveQuery}
                    onChange={onDataConfigChanged}
                    type="setting"
                  />
                </StyledDragableConfigWrapper>
                <StyledChartPresentCoreWrapper borderWidth={borderWidth}>
                  <ChartPresentPanel
                    containerHeight={
                      (containerHeight || 0) -
                      borderWidth -
                      (ChartGraphPanelRef?.current?.offsetHeight || 0)
                    }
                    containerWidth={(containerWidth || 0) - borderWidth}
                    chart={chart}
                    dataset={dataset}
                    expensiveQuery={expensiveQuery}
                    allowQuery={allowQuery}
                    chartConfig={chartConfig}
                    onRefreshDataset={onRefreshDataset}
                    onCreateDownloadDataTask={onCreateDownloadDataTask}
                    selectedItems={selectedItems}
                    dataView={dataView}
                  />
              </StyledChartPresentCoreWrapper>
            </StyledConfigChartWrapper>
          </StyledChartWrapper>
        </ChartI18NContext.Provider>
      </StyledChartPresentWrapper>
    );
  },
);

export default ChartPresentWrapper;
const StyledChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledDragableFieldWrapper = styled.div`
  background-color: ${(p) => p.theme.componentBackground};
`;
const StyledChartPresentWrapper = styled.div<{ borderWidth }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  // padding: ${p => p.borderWidth}px ${p => p.borderWidth}px
  //   ${p => p.borderWidth}px 0;
  background-color: ${p => p.theme.bodyBackground};
`;
const StyledConfigChartWrapper = styled.div`
  display: flex;
`
const StyledDragableConfigWrapper = styled.div<{ height }>`
  width: 182px;
  height: ${p => p.height}px;
  flex-shrink: 0;
  background-color: ${p => p.theme.componentBackground};
  border-right: 1px solid ${p => p.theme.borderColorEmphasis};
  overflow-y: auto;
`;
const StyledChartPresentCoreWrapper = styled.div<{ borderWidth }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: calc(100% - 182px);
  background-color: ${p => p.theme.bodyBackground};
`;
