import React from "react";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import BoardEditor from "../DashBoardPage/pages/BoardEditor";
import useMount from '../../hooks/useMount';
import ChartManager from '../../models/ChartManager';

type BoardEditorProps = {
  type?: string,
  onCloseBoardEditor?: ()=>void,
  onSuccessUpdateBoard?: (updateBoardId: string)=>void,
}
 function  BoardEditorMain ({ onSuccessUpdateBoard, onCloseBoardEditor }:BoardEditorProps) {
  useEditBoardSlice();
  useBoardSlice();
   useMount(
     () => {
       ChartManager.instance()
         .load()
         .catch(err =>
           console.error('Fail to load customize charts with ', err),
         );
     },
     () => {
     },
   );
   return (
       <BoardEditor />
   )
}
export default BoardEditorMain
