import React, { useEffect, useState } from 'react';
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import Board from "../DashBoardPage/pages/Board";
import { getGlobalConfigState } from 'utils/globalState';
import BoardEditor from '../DashBoardPage/pages/BoardEditor';

function BoardPage() {
  useEditBoardSlice();
  useBoardSlice();

  if(getGlobalConfigState().operateType == "VIEW"){
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
        previewBoardId={getGlobalConfigState().pageId}
      />
    );
  }else if(getGlobalConfigState().operateType == "EDIT" || getGlobalConfigState().operateType == "CREATE"){
    return (
      <BoardEditor />
    );
  }
  return <></>
}
export default BoardPage;
