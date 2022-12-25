import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {Row, Col, Button} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useBoardSlice, boardActions } from "../DashBoardPage/pages/Board/slice";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import Board from "../DashBoardPage/pages/Board";
import { entryParameters } from 'config/entryParameters';
import { BoardState } from '../DashBoardPage/pages/Board/slice/types';
import { makeSelectBoardConfigById } from '../DashBoardPage/pages/Board/slice/selector';
import { setGlobalConfigState } from '../../../utils/globalState';

function BoardShow({ match: { params }, history }) {
  useBoardSlice();
  useEditBoardSlice();
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // @ts-ignore
    dispatch(boardActions.setPageConfig(entryParameters.page));
    //TODO 待优化，保留一种全局变量形式
    setGlobalConfigState({
      pageType: "page"
    });
    setLoaded(true);
  }, []);

  const dashboard = useSelector((state: { board: BoardState }) =>
    makeSelectBoardConfigById()(state, params.pageId),
  );

  const pageTitle = useMemo(() => {
    return (
      <PageTitleWrapper>
        <Row justify="space-between">
          <Col><span className="page-title">{ dashboard?.name || '--' }</span></Col>
          <Col><Button icon={<LeftOutlined />} onClick={() => history.goBack()} size={'large'}>返回</Button></Col>
        </Row>
      </PageTitleWrapper>
    )
  }, [ dashboard?.name ])

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
          previewBoardId={params.pageId}
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
export default BoardShow;

const PageTitleWrapper = styled.div`
  padding: 16px 0;

  .page-title {
    font-weight: bold;
    font-size: 20px;
  }
`
