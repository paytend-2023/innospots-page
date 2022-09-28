import React, {useState, useEffect} from "react";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import Board from "../DashBoardPage/pages/Board";
import { DatartContext} from "app/contexts/DatartContext";
import {useParams} from "react-router-dom";
import { DatartComponentConfig, getMasterState } from 'utils/globalState';

type BoardProps = {
  type?: string,
  config?: DatartComponentConfig;
  hideTitle?: boolean;
  onCloseBoard?: ()=>void;
}

function BoardPreview({type,hideTitle,onCloseBoard }:BoardProps) {
  useEditBoardSlice();
  useBoardSlice();

  const  { vizId } = useParams<{
    vizId?: string
  }>();
  const [config, setConfig] = useState();

  useEffect(() => {
    if (type) {
      try {
        setConfig(getMasterState().DataConfig[type] || {});
      } catch (e) {}
    }
  }, [type]);

  useEffect(() => {
    try {
      if(vizId && config){
        // @ts-ignore
        config.urls.detailUrl = `/page/${vizId}`;
        setConfig(config)
      }
    } catch (e) {

    }
  }, [vizId, config]);

  console.log("vizId-----",vizId,config)
  return config ? (
    <DatartContext.Provider value={config || {}}>
      <Board
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
  ) : null
}
export default BoardPreview;
