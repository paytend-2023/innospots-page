import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useBoardSlice } from "../DashBoardPage/pages/Board/slice";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import Board from "../DashBoardPage/pages/Board";
import { setGlobalConfigState } from '../../../utils/globalState';
import useMount from '../../hooks/useMount';
import ChartManager from '../../models/ChartManager';

function Workspace({ history }) {
  useBoardSlice();
  useEditBoardSlice();
  const [loaded, setLoaded] = useState(false);
  useMount(
    () => {
      ChartManager.instance()
        .load()
        .catch(err =>
          console.error('Fail to load customize charts with ', err),
        );
    },
    () => {
    },
  );
  useEffect(() => {
    setGlobalConfigState({
      pageType: 'workspace'
    });
    setLoaded(true);
  }, []);

  const pageTitle = useMemo(() => {
    return (
      <PageTitleWrapper>
        <Row justify="space-between">
          <Col><span className="page-title">工作台</span></Col>
          <Col><Button className="page-edit-btn" type="primary" icon={<EditOutlined />} onClick={() => history.push('/workspace/edit')}>自定义</Button></Col>
        </Row>
      </PageTitleWrapper>
    )
  }, [])

  const renderBoard = () => {
    return (
      loaded ? (
        <Board
          hideTitle={true}
          autoFit={true}
          filterSearchUrl={''}
          allowDownload={true}
          allowShare={true}
          showZoomCtrl={true}
          allowManage={true}
          renderMode="read"
        />
      ) : null
    )
  }

  return (
    <>
      { pageTitle }
      { renderBoard() }
    </>
  )
}
export default Workspace;

const PageTitleWrapper = styled.div`
  padding: 16px 0;

  .page-title {
    font-weight: bold;
    font-size: 20px;
  }
  .page-edit-btn{
    width: 94px;
    height: 38px;
  }
`
