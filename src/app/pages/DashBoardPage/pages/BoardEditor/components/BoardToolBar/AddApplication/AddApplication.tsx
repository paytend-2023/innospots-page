import { InstagramOutlined } from '@ant-design/icons';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, {useCallback, useContext, useState} from 'react';
import { useDispatch } from 'react-redux';
import { BoardToolBarContext } from '../context/BoardToolBarContext';
import {Tooltip} from "antd";
import {ToolbarButton} from "app/components";
import {editDashBoardInfoActions} from "app/pages/DashBoardPage/pages/BoardEditor/slice";

export const AddApplication= () => {
  const t = useI18NPrefix(`viz.board.action`);
  const tg = useI18NPrefix('global');
  const dispatch = useDispatch();

  const onCreateApplication = () => {
    dispatch(
      editDashBoardInfoActions.changeApplicationPanel({
        type: 'add',
      })
    );
  };
  return (
    <>
      <Tooltip title={t('application')}>
        <ToolbarButton icon={<InstagramOutlined />}
                       label={tg('button.add') + t('application')}
                       onClick={onCreateApplication}
        />
      </Tooltip>
    </>
  )
}
