import React from "react";
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import {useBoardSlice} from "../DashBoardPage/pages/Board/slice";
import BoardEditor from "../DashBoardPage/pages/BoardEditor";

type BoardEditorProps = {
  type?: string,
  onCloseBoardEditor?: ()=>void,
  onSuccessUpdateBoard?: (updateBoardId: string)=>void,
}
 function  BoardEditorMain ({ onSuccessUpdateBoard, onCloseBoardEditor }:BoardEditorProps) {
  useEditBoardSlice();
  useBoardSlice();

   return (
       <BoardEditor />
   )
}
export default BoardEditorMain
