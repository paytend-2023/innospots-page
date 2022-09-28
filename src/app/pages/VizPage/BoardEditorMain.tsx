import React, {useState, useEffect} from "react";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import BoardEditor from "../DashBoardPage/pages/BoardEditor";
import { DatartContext} from "../../contexts/DatartContext";
import {useParams} from "react-router-dom";
import { DatartComponentConfig, getMasterState } from 'utils/globalState';

type BoardEditorProps = {
  type?: string,
  onCloseBoardEditor?: ()=>void,
  onSuccessUpdateBoard?: (updateBoardId: string)=>void,
}
 function  BoardEditorMain ({ type, onSuccessUpdateBoard, onCloseBoardEditor }:BoardEditorProps) {
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

   console.log("BoardEditorMain-----",vizId,config)

   return config ? (
     // @ts-ignore
     <DatartContext.Provider value={config}>
       <BoardEditor
         // onCloseBoardEditor={onCloseBoardEditor}
         // onSuccessUpdateBoard={(updateBoardId)=>{
         //   onSuccessUpdateBoard ? onSuccessUpdateBoard(updateBoardId) : '';
         // }}
       />
     </DatartContext.Provider>
   ) : null
}
export default BoardEditorMain
