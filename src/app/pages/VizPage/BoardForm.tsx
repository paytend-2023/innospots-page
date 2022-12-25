import React, {useEffect, useState} from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import { boardActions, useBoardSlice } from '../DashBoardPage/pages/Board/slice';
import BoardEditor from '../DashBoardPage/pages/BoardEditor';
import { useDispatch } from 'react-redux';
import { entryParameters } from '../../../config/entryParameters';
import { setGlobalConfigState } from '../../../utils/globalState';

function BoardForm({ match: { params } }) {
  useEditBoardSlice();
  useBoardSlice();

  const dispatch = useDispatch();
  const { pageId, pageType } = params;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const pageConfig = entryParameters[pageType === 'edit' && !pageId ? 'workspace' : 'page'];
    if (pageType === 'create') {
      pageConfig.urls.detailUrl = '';
    }

    // @ts-ignore
    dispatch(boardActions.setPageConfig(cloneDeep(pageConfig)));
    //TODO 待优化，保留一种全局变量形式
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
