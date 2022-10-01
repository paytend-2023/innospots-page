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

import { Divider, Input, List, Space } from 'antd';
import debounce from 'lodash/debounce';
import { FC, memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { IW } from '../../../../../../../components';
import { FONT_SIZE_LABEL } from '../../../../../../../../styles/StyleConstants';
import { DataViewFieldType } from '../../../../../../../constants';
import { CalendarOutlined, FieldStringOutlined, FileUnknownOutlined, NumberOutlined } from '@ant-design/icons';

const ChartSearchableList: FC<{
  source: Array<{ value: string; label: string, type?: string }>;
  onItemSelected: (itemKey) => void;
}> = memo(({ source, onItemSelected }) => {
  const [listItems, setListItems] = useState(source);

  useEffect(() => {
    setListItems(source);
  }, [source]);

  const handleListItemClick = itemKey => {
    onItemSelected(itemKey);
  };

  const handleSearch = debounce((value: string) => {
    if (!value || !value.trim()) {
      setListItems(source);
    }
    const newListItems = source?.filter(item =>
      item?.label.toUpperCase().includes(value.toUpperCase()),
    );
    setListItems(newListItems);
  }, 100);

  const iconFunc  = type =>{
    let icon:any;
    switch (type) {
      case DataViewFieldType.STRING:
        icon = <FieldStringOutlined  />;
        break;
      case DataViewFieldType.NUMERIC:
        icon = <NumberOutlined  />;
        break;
      case DataViewFieldType.DATE:
        icon = <CalendarOutlined />;
        break;
      default:
        icon = <FileUnknownOutlined  />;
    }
    return icon;
  }

  return (
    <StyledChartSearchableList direction="vertical">
      <Input.Search onChange={e => handleSearch(e.target.value)} enterButton size="large"/>
      <Divider />
      <List
        className="searchable-list-container"
        dataSource={listItems}
        rowKey={item => item.value}
        renderItem={item => (
          <p onClick={() => handleListItemClick(item.value)}>
            <Space size={3}>
              {
                item.type ?
                  <IW fontSize={FONT_SIZE_LABEL}>
                    {iconFunc(item.type)}
                  </IW> :''
              }
              <span>{item.label}</span>
            </Space>
          </p>
        )}
      />
    </StyledChartSearchableList>
  );
});

export default ChartSearchableList;

const StyledChartSearchableList = styled(Space)`
  .ant-list {
    overflow: auto;
  }

  .ant-divider {
    margin: 5px;
  }
  .searchable-list-container{
    p{
      font-size: 12px;
      line-height: 24px;
      color: #262626;
      margin-bottom: 4px;
    }
  }
`;
