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
import { BarChartOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Tooltip } from 'antd';
import { ToolbarButton } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { useCallback } from 'react';

export const ChartWidgetDropdown: React.FC<{
  onCreate: () => void;
}> = props => {
  const t = useI18NPrefix(`viz.board.action`);
  const tg = useI18NPrefix('global');
  const onChartWidget = useCallback(
    () => {
      props.onCreate?.();
    },
    [props],
  );
  return (
      <Tooltip title={t('dataChart')} >
        <ToolbarButton icon={<BarChartOutlined />} label={tg('button.add') + t('dataChart')} color="#1245FA" onClick={onChartWidget} />
      </Tooltip>
  );
};
