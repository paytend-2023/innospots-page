import React, {useEffect, useState} from 'react';
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import { useBoardSlice } from '../DashBoardPage/pages/Board/slice';
import BoardEditor from '../DashBoardPage/pages/BoardEditor';
import { useDispatch } from 'react-redux';
import { setGlobalConfigState } from '../../../utils/globalState';

function BoardForm({ match: { params } }) {
  useEditBoardSlice();
  useBoardSlice();
  const { pageId, pageType } = params;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setGlobalConfigState({
      pageType: pageType === 'edit' && !pageId ? 'workspace' : 'page',
      operateType: pageType.toUpper,
      id: pageId
    });
    setLoaded(true);
  }, [ pageType, pageId ]);

  return (
    loaded ? (
      <BoardEditor pageId={pageId} />
    ) : (
      <></>
    )
  )
}
export default BoardForm;
