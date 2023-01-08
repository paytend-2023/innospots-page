import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {Row, Col, Button} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useBoardSlice } from "../DashBoardPage/pages/Board/slice";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import Board from "../DashBoardPage/pages/Board";
import { BoardState } from '../DashBoardPage/pages/Board/slice/types';
import { makeSelectBoardConfigById } from '../DashBoardPage/pages/Board/slice/selector';
import { setGlobalConfigState } from '../../../utils/globalState';

import useI18NPrefix from '../../hooks/useI18NPrefix';

function BoardShow({ match: { params }, history }) {
  useBoardSlice();
  useEditBoardSlice();
  const [loaded, setLoaded] = useState(false);
  const gt = useI18NPrefix(`global.button`);
  const { pageId } = params;
  useEffect(() => {
    setGlobalConfigState({
      pageType: "page",
      id: pageId
    });
    setLoaded(true);
  }, [pageId]);

  const dashboard = useSelector((state: { board: BoardState }) =>
    makeSelectBoardConfigById()(state, pageId),
  );

  const pageTitle = useMemo(() => {
    const { search } = history.location
    const isBack = search.search('router=page') > -1

    return (
      <PageTitleWrapper>
        <Row justify="space-between">
          <Col><span className="page-title">{ dashboard?.name || '--' }</span></Col>
          {isBack && <Col><Button icon={<LeftOutlined />} onClick={() => history.goBack()} size={'large'}>{gt('back')}</Button></Col>}
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
          previewBoardId={pageId}
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
