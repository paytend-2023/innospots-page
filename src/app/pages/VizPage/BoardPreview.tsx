import React from "react";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import Board from "../DashBoardPage/pages/Board";
import { DatartContext} from "app/contexts/DatartContext";
import {useParams} from "react-router-dom";
import { DatartComponentConfig } from 'utils/globalState';

type BoardProps = {
  config: DatartComponentConfig;
  hideTitle?: boolean;
  onCloseBoard?: ()=>void;
}
function BoardPreview({config,hideTitle,onCloseBoard }:BoardProps) {
  useEditBoardSlice();
  useBoardSlice();
  const  { vizId } = useParams<{ vizId}>();
  if(vizId){
    config.urls.detailUrl = `/page/${vizId}`;
  }
  console.log("vizId-----",vizId,config)
  return (
    <DatartContext.Provider value={config}>
      <Board
        hideTitle={hideTitle == undefined ? false : hideTitle}
        autoFit={true}
        filterSearchUrl={''}
        allowDownload={true}
        allowShare={true}
        showZoomCtrl={true}
        allowManage={true}
        renderMode="read"
        // onCloseBoard={onCloseBoard}
      />
    </DatartContext.Provider>
  )
}
export default BoardPreview;
