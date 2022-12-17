import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Col, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useBoardSlice, boardActions } from "../DashBoardPage/pages/Board/slice";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import Board from "../DashBoardPage/pages/Board";
import { entryParameters } from 'config/entryParameters';
import useI18NPrefix from '../../hooks/useI18NPrefix';

function Workspace({ history }) {
  useBoardSlice();
  useEditBoardSlice();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // @ts-ignore
    dispatch(boardActions.setPageConfig(entryParameters.workspace));
    setLoaded(true);
  }, []);

  const gt = useI18NPrefix(`global.button`);
  const wt = useI18NPrefix(`workspace.base`);

  const pageTitle = useMemo(() => {

    return (
      <PageTitleWrapper>
        <Row justify="space-between">
          <Col><span className="page-title">{wt('title')}</span></Col>
          <Col><Button className="page-edit-btn" type="primary" icon={<EditOutlined />} onClick={() => history.push('/workspace/edit')}>{gt('customize')}</Button></Col>
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
    height: 38px;
  }
`
