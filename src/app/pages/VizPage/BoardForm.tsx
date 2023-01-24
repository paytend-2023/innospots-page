import React, {useEffect, useState} from 'react';
import {useEditBoardSlice} from "../DashBoardPage/pages/BoardEditor/slice";
import { useBoardSlice } from '../DashBoardPage/pages/Board/slice';
import BoardEditor from '../DashBoardPage/pages/BoardEditor';
import { useDispatch } from 'react-redux';
import { setGlobalConfigState } from '../../../utils/globalState';
import useMount from '../../hooks/useMount';
import ChartManager from '../../models/ChartManager';

function BoardForm({ match: { params } }) {
  useEditBoardSlice();
  useBoardSlice();
  const { pageId, pageType } = params;
  const [loaded, setLoaded] = useState(false);
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
  useEffect(() => {
    let config = {
      pageType: pageType === 'edit' && !pageId ? 'workspace' : 'page',
      operateType: pageType.toUpperCase(),
      id: pageId
    };
    if(pageId){
      config.id = pageId;
    }
    setGlobalConfigState(config);
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
