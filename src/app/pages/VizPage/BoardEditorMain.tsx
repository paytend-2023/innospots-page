import React from "react";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import BoardEditor from "../DashBoardPage/pages/BoardEditor";
import { DatartContext} from "../../contexts/DatartContext";
import {useParams} from "react-router-dom";
import { DatartComponentConfig } from 'utils/globalState';

type BoardEditorProps = {
  config: DatartComponentConfig;
  onCloseBoardEditor?: ()=>void,
  onSuccessUpdateBoard?: (updateBoardId: string)=>void,
}
 function  BoardEditorMain ({ config, onSuccessUpdateBoard, onCloseBoardEditor }:BoardEditorProps) {
  useEditBoardSlice();
  useBoardSlice();
  const  { vizId } = useParams<{ vizId}>();
  if(vizId){
    config.urls.detailUrl = `/page/${vizId}`;
  }
   console.log("BoardEditorMain-----",vizId,config)
  return (
    <DatartContext.Provider value={config}>
      <BoardEditor
        // onCloseBoardEditor={onCloseBoardEditor}
        // onSuccessUpdateBoard={(updateBoardId)=>{
        //   onSuccessUpdateBoard ? onSuccessUpdateBoard(updateBoardId) : '';
        // }}
      />
    </DatartContext.Provider>
  )
}
export default BoardEditorMain
