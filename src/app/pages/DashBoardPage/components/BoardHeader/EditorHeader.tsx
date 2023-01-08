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

import { SendOutlined, LeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Radio, Row, Select, Space } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import classnames from 'classnames';
import { FC, memo, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import {
  FONT_WEIGHT_BOLD,
  SPACE_LG,
} from 'styles/StyleConstants';
import keyBy from 'lodash/keyBy';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import { useStatusTitle } from '../../hooks/useStatusTitle';
import { clearEditBoardState } from '../../pages/BoardEditor/slice/actions/actions';
import { BoardActionContext } from '../ActionProvider/BoardActionProvider';
import { WidgetActionContext } from '../ActionProvider/WidgetActionProvider';
import { BoardInfoContext } from '../BoardProvider/BoardInfoProvider';
import { BoardContext } from '../BoardProvider/BoardProvider';
import { getGlobalConfigState } from 'utils/globalState';
import { request2 } from 'utils/request';
const { Option } = Select;

const EditorHeader: FC = memo(({ children }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const t = useI18NPrefix(`viz.action`);
  const { updateBoard } = useContext(BoardActionContext);
  const { onEditClearActiveWidgets } = useContext(WidgetActionContext);
  const { name, boardExtConfig, status } = useContext(BoardContext);
  const { saving } = useContext(BoardInfoContext);
  const title = useStatusTitle(name, status);
  const { titleElement, urls } = getGlobalConfigState();
  const [formError, setFormError] = useState({});
  const [customTitleElement, setCustomTitleElement] = useState<any[]>([]);
  const [formIns] = Form.useForm();
  useEffect(() => {
    titleElement && titleElement.forEach(item => {
      if (item.requestOption) {
        fetchTitleElementOptions(item);
      }
    });

  }, [titleElement]);
  const fetchTitleElementOptions = useCallback(async element => {
    const { data } = await request2<any[]>(element.requestOption.requestUrl);
    let elementOptions: any[] = [];
    forEach(data, option => {
      if(option[element.requestOption.valueFiled]>=0){
        elementOptions.push({
          name: option[element.requestOption.nameField],
          value: option[element.requestOption.valueFiled],
        });
      }
    });
    let titleElementTemp = cloneDeep(titleElement);
    forEach(titleElementTemp, item => {
      if (item.name == element.name) {
        item.options = elementOptions;
      }
    });
    setCustomTitleElement(titleElementTemp || []);
  }, []);

  useEffect(() => {
    let formFieldsValues: any = [];
    if (!boardExtConfig) {
      const titleElementByName = keyBy(customTitleElement, 'name');
      forEach(Object.keys(titleElementByName), function(item) {
        if (titleElementByName[item].defaultValue !== undefined) {
          formFieldsValues.push({
            'name': item,
            'value': titleElementByName[item].defaultValue,
          });
        }
      });
    } else {
      const boardExtConfigObj = JSON.parse(boardExtConfig || '{}');
      forEach(Object.keys(boardExtConfigObj), function(item) {
        formFieldsValues.push({
          'name': item,
          'value': boardExtConfigObj[item],
        });
      });
    }
    formIns.setFields(formFieldsValues);
  }, [boardExtConfig, customTitleElement]);

  const onCloseBoardEditor = (boardId) => {
    history.goBack();
    // if(urls.detailUrl =='/workspace'){
    //     if(POWERED_BY_QIANKUN){
    //       getMasterState().masterNavigateTo('/workspace')
    //     }
    // }
    // else if(boardId){
    //   history.push(`/${boardId}`);
    // }else{
    //   history.goBack();
    // }
    dispatch(clearEditBoardState());
  };

  const onUpdateBoard = (type) => {
    formIns.validateFields().then(values => {
      onEditClearActiveWidgets();
      setImmediate(() => {
        updateBoard?.(type, JSON.stringify(values), onCloseBoardEditor);
      });
    }).catch(error => {
      const titleElementByName = keyBy(customTitleElement, 'name');
      const tipName = error.errorFields[0].name[0];
      message.info(error.errorFields[0].errors[0].replace(tipName, titleElementByName[tipName].desc));
    });
  };
  const getFormItem = (formItem) => {
    let element;
    switch (formItem.type) {
      case 'RADIO':
        element = (
          <Radio.Group style={{ marginTop: 8 }}>
            {
              map(formItem.options, (option) => {
                return <Radio value={option.value} key={option.value}>{option.name}</Radio>;
              })
            }
          </Radio.Group>
        );
        break;
      case 'SELECT':
        element = (
          <Select placeholder={formItem.placeholder} style={{ width: '100%' }} size='large'>
            {
              map(formItem.options, (option) => {
                return <Option value={option.value} key={option.value}>{option.name}</Option>;
              })
            }
          </Select>
        );
        break;
      case 'INPUT':
        element = <Input placeholder={formItem.placeholder} size='large' />;
        break;
      default:
        element = '';
        break;
    }
    let formItemRules = {};
    if (formItem.length) {
      formItemRules['max'] = formItem.length;
    }
    return (
      <Col span={Math.max(formItem.gridSize, 2)} key={formItem.name} className='formWrapper'>
        <div className={classnames('formItem', { ['hasError']: !!formError[formItem.name] })}>
          <span> {formItem.label}</span>
          <Form.Item
            noStyle
            name={formItem.name}
            label={formItem.name}
            rules={[
              {
                message: formItem.tips,
                required: formItem.required,
                ...formItemRules,
              },
            ]}
          >
            {element}
          </Form.Item>
          <div className='error'>{formError[formItem.name]}</div>
        </div>
      </Col>
    );
  };
  return (
    <Wrapper onClick={onEditClearActiveWidgets}>
      <div className={classnames('backBtn', { disabled: status < 2 })}>
        <LeftOutlined onClick={() => onCloseBoardEditor(null)} />
        {/*{title}*/}
      </div>
      <Form form={formIns} className='formContent'>
        <Row>
          <Col span={20}>
            <Row gutter={16}>
              {
                customTitleElement && map(customTitleElement, (item) => {
                  return getFormItem(item);
                })
              }
            </Row>
          </Col>
        </Row>
      </Form>
      <div className='boardBtn'>
        <Space size={16}>
          {children}
          <>
            {/*<Button*/}
            {/*  key="cancel"*/}
            {/*  icon={<CloseOutlined />}*/}
            {/*  onClick={() => onCloseBoardEditor(null)}*/}
            {/*>*/}
            {/*  {t('common.cancel')}*/}
            {/*</Button>*/}

            <Button
              key='update'
              className='updateBtn'
              loading={saving}
              onClick={() => {
                onUpdateBoard('save');
              }}
              icon={<SaveOutlined />}
            >
              {t('common.save')}
            </Button>
            {urls.publicBoardUrl ? <Button
              key='publish'
              className='publishBtn'
              loading={saving}
              onClick={() => {
                onUpdateBoard('publish');
              }}
              icon={<SendOutlined />}
            >
              {t('common.publish')}
            </Button> : ''
            }
          </>
        </Space>
      </div>
    </Wrapper>
  );
});

export default EditorHeader;
const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};

  .backBtn {
    padding: 25px 31px;
    font-weight: ${FONT_WEIGHT_BOLD};
    font-size: 20px;
    line-height: 13px;

    &.disabled {
      color: ${(p) => p.theme.textColorLight};
    }
  }

  .formContent {
    flex: 1;

    input {
      border-radius: 4px;
    }

    .ant-input-lg {
      font-size: 14px;
      padding: 7px 11px;
    }

    .ant-select-lg .ant-select-selector {
      height: 38px;
      border-radius: 4px;

      .ant-select-selection-item {
        line-height: 38px;
        font-size: 14px;
      }
    }
  }

  .boardBtn {
    padding-right: ${SPACE_LG};

    button {
      height: 38px;
      color: #fff;
      border-radius: 4px;
      border: none;
    }

    .updateBtn {
      background: #1245FA;
    }

    .publishBtn {
      background: #31CB8A;
    }
  }
`;
