import React, {useState, useEffect} from "react";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import Board from "../DashBoardPage/pages/Board";
import {useParams} from "react-router-dom";
import { DatartComponentConfig, getMasterState } from 'utils/globalState';

type BoardProps = {
  config?: DatartComponentConfig;
  hideTitle?: boolean;
  onCloseBoard?: ()=>void;
}

function BoardPreview({hideTitle,onCloseBoard }:BoardProps) {
  useEditBoardSlice();
  useBoardSlice();

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
        // onCloseBoard={onCloseBoard}
      />
  )
}
export default BoardPreview;
