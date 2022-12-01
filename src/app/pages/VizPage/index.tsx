import React, {useEffect, useState} from 'react';
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import Board from "../DashBoardPage/pages/Board";
import { getGlobalConfigState } from 'utils/globalState';
import BoardEditor from '../DashBoardPage/pages/BoardEditor';

function BoardPage() {
  useEditBoardSlice();
  useBoardSlice();

  const configState = getGlobalConfigState();
  const [pageId, setPageId] = useState(configState.pageId);

  useEffect(() => {
    configState.onGlobalStateChange((state, prev) => {
      // state: 变更后的状态; prev 变更前的状态
      console.log(state, prev);
      if (state.pageId && state.pageId !== prev.pageId) {
        setPageId(state.pageId);
      }
    })
  }, [configState.onGlobalStateChange]);

  if(configState.operateType == "VIEW"){
    return (
      <Board
        hideTitle={true}
        autoFit={true}
        filterSearchUrl={''}
        allowDownload={true}
        allowShare={true}
        showZoomCtrl={true}
        allowManage={true}
        renderMode="read"
        key={pageId}
        previewBoardId={pageId}
      />
    );
  }else if(configState.operateType == "EDIT" || configState.operateType == "CREATE"){
    return (
      <BoardEditor />
    );
  }
  return <></>
}
export default BoardPage;
