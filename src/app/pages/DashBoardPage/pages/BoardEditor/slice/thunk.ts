import { createAsyncThunk } from '@reduxjs/toolkit';
import migrateWidgetConfig from 'app/migration/BoardConfig/migrateWidgetConfig';
import { migrateWidgets } from 'app/migration/BoardConfig/migrateWidgets';
import { ChartDataRequestBuilder } from 'app/models/ChartDataRequestBuilder';
import {
  boardDrillManager,
  EDIT_PREFIX,
} from 'app/pages/DashBoardPage/components/BoardDrillManager/BoardDrillManager';
import widgetManager from 'app/pages/DashBoardPage/components/WidgetManager';
import { getControlOptionQueryParams } from 'app/pages/DashBoardPage/components/Widgets/ControllerWidget/config';
import { ORIGINAL_TYPE_MAP } from 'app/pages/DashBoardPage/constants';
import { boardActions } from 'app/pages/DashBoardPage/pages/Board/slice';
import {
  BoardState,
  ControllerWidgetContent,
  DataChart,
  getDataOption,
  SaveDashboard,
  ServerDatachart,
  WidgetData,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import { getChartWidgetRequestParams } from 'app/pages/DashBoardPage/utils';
import {
  getChartDataView,
  getDashBoardByResBoard,
  getDataChartsByServer,
  getInitBoardInfo,
} from 'app/pages/DashBoardPage/utils/board';
import {
  convertWrapChartWidget,
  createToSaveWidgetGroup,
  createWidgetInfo,
  getWidgetMap,
} from 'app/pages/DashBoardPage/utils/widget';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import { PendingChartDataRequestFilter } from 'app/types/ChartDataRequest';
import ChartDataView from 'app/types/ChartDataView';
import { View } from 'app/types/View';
import { filterSqlOperatorName } from 'app/utils/internalChartHelper';
import { RootState } from 'types';
import { request2 } from 'utils/request';
import { getErrorMessage, uuidv4 } from 'utils/utils';
import {
  editBoardStackActions,
  editDashBoardInfoActions,
  editWidgetDataActions,
  editWidgetInfoActions,
  editWidgetSelectedItemsActions,
} from '.';
import { BoardInfo, BoardType, ServerDashboard } from '../../Board/slice/types';
import { getDataChartMap } from './../../../utils/board';
import { adjustWidgetsToBoard } from './../../../utils/widget';
import { addVariablesToBoard } from './actions/actions';
import {
  boardInfoState,
  editBoardStackState,
  selectEditBoard,
} from './selectors';
import { EditBoardState, HistoryEditBoard } from './types';
import {ActionCreators} from "redux-undo";

/**
 * @param ''
 * @description '先拿本地缓存，没有缓存再去服务端拉数据'
 */
export const getEditBoardDetail = createAsyncThunk<
  null,
  { dashboardId: string; boardDetailUrl: string},
  { state: RootState }
>(
  'editBoard/getEditBoardDetail',
  async ({dashboardId,boardDetailUrl}, { getState, dispatch }) => {
    if (!dashboardId) {
      return null;
    }
    //2 从 editor 内存中取
    const editDashboard = selectEditBoard(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );

    if (editDashboard?.id === dashboardId) {
      return null;
    }
    dispatch(fetchEditBoardDetail({boardDetailUrl}));
    return null;
  },
);

export const fetchEditBoardDetail = createAsyncThunk<
  null,
  {  boardDetailUrl: string},
  { state: RootState }
>(
  'editBoard/fetchEditBoardDetail',
  async ({boardDetailUrl}, { getState, dispatch }) => {
    let boardDetail = {} as ServerDashboard
    boardDetail.id= '-1'
    boardDetail.name=''
    boardDetail.widgets =[]
    boardDetail.views = []
    if(boardDetailUrl){
      const { data } = await request2<ServerDashboard>(
        boardDetailUrl,
      );
      boardDetail = data
      console.log("boardDetail--",boardDetail)
    }
    const dashboard = getDashBoardByResBoard(boardDetail);
    const boardType = dashboard.config.type;
    const {
      views: serverViews,
      widgets: serverWidgets,
    } = boardDetail;
    // TODO
    let migratedWidgets = migrateWidgets(serverWidgets, boardType);
    migratedWidgets = migrateWidgetConfig(migratedWidgets);
    const { widgetMap, wrappedDataCharts } = getWidgetMap(
      migratedWidgets, //todo
      [],
      boardType,
      serverViews,
    );
    const widgetInfos = Object.keys(widgetMap).map(id => createWidgetInfo(id));
    // TODO xld migration about filter

    const widgetIds = serverWidgets.map(w => w.id);
    // const boardInfo = getInitBoardInfo({ id: dashboard.id, widgetIds });

    const boardInfo = getInitBoardInfo({ id: dashboard.id, widgetIds });
    // datacharts

    const allDataCharts: DataChart[] = wrappedDataCharts;
    dispatch(boardActions.setDataChartToMap(allDataCharts));
    const viewViews = getChartDataView(serverViews, allDataCharts);

    dispatch(boardActions.updateViewMap(viewViews));
    // BoardInfo
    dispatch(editDashBoardInfoActions.initEditBoardInfo(boardInfo));
    // widgetInfoRecord
    dispatch(editWidgetInfoActions.addWidgetInfos(widgetInfos));
    //dashBoard,widgetRecord
    dispatch(
      editBoardStackActions.setBoardToEditStack({
        dashBoard: dashboard,
        widgetRecord: widgetMap,
      }),
    );
    // console.log("dashBoard---",dashboard,boardInfo,widgetMap,wrappedDataCharts)
    return null;
  },
);

/**
 * @param boardId string
 * @description '更新保存 board'
 */
export const toUpdateDashboard = createAsyncThunk<
  any,
  { boardId: string; boardExtConfig: string; saveBoardUrl: string; callback?: (boardId?: string) => void },
  { state: RootState }
>(
  'editBoard/toUpdateDashboard',
  async ({ boardId,boardExtConfig, saveBoardUrl, callback }, { getState, dispatch }) => {
    const { dashBoard, widgetRecord } = editBoardStackState(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );
    const boardInfo = boardInfoState(
      getState() as { editBoard: EditBoardState },
    );
    const boardState = getState() as unknown as { board: BoardState };

    const { dataChartMap, viewMap } = boardState.board;
    const widgets = convertWrapChartWidget({
      widgetMap: widgetRecord,
      dataChartMap,
      viewMap,
    });
    console.log("boardExtConfig---",dashBoard,widgetRecord,viewMap)
    const group = createToSaveWidgetGroup(widgets, boardInfo.widgetIds);
    // const updateData: SaveDashboard = {
    //   ...dashBoard,
    //   subType: dashBoard?.config?.type,
    //   config: JSON.stringify(dashBoard.config),
    //   widgetToCreate: group.widgetToCreate,
    //   widgetToUpdate: group.widgetToUpdate,
    //   widgetToDelete: group.widgetToDelete,
    // };
    const updateData: SaveDashboard  = {
      boardExtConfig,
      config: JSON.stringify(dashBoard.config),
      widgetDeleteIds: group.widgetToDelete,
      widgets: []
    }
    if(dashBoard.config){
      let boardExtConfigObj = JSON.parse(boardExtConfig)
      Object.keys(boardExtConfigObj).forEach(function(key){
        updateData[key]= boardExtConfigObj[key]
      })
    }
    if(dashBoard.id && dashBoard.id != '-1'){
      updateData.id =  dashBoard.id
    }

    if(group.widgetToUpdate){
      group.widgetToUpdate.map(item =>{
        updateData.widgets.push({
          config: item.config,
          dashboardId: item.dashboardId,
          id: item.id,
          parentId: item.parentId,
          viewCodes: [viewMap[item.viewIds[0]].code],
          widgetType: "CHART"
        })
      })
    }
    if(group.widgetToCreate){
      group.widgetToCreate.map(item =>{
        updateData.widgets.push({
          config: item.config,
          dashboardId: item.dashboardId,
          widgetKey: item.widgetKey,
          viewCodes: [viewMap[item.viewIds[0]].code],
          parentId: item.parentId,
          widgetType: "CHART"
        })
      })
    }
    let updateRes =
      await request2<any>({
        url: saveBoardUrl,
        method: 'post',
        data: updateData,
      });
    console.log("updateData-----",updateData,group,dashBoard,boardInfo,updateRes)
    callback?.(updateRes.data['id']);
    console.log("updateRes--",updateRes,updateRes.data['id'])
    dispatch(ActionCreators.clearHistory());
  },
);
/**
 * @param 'Widget[]'
 * @description '添加 widget 到board'
 */
export const addWidgetsToEditBoard = createAsyncThunk<
  null,
  Widget[],
  { state: RootState }
>('editBoard/addWidgetsToEditBoard', (widgets, { getState, dispatch }) => {
  const { dashBoard } = editBoardStackState(
    getState() as unknown as {
      editBoard: HistoryEditBoard;
    },
  );
  const { layouts } = boardInfoState(
    getState() as { editBoard: EditBoardState },
  );
  const widgetInfos = widgets.map(item => createWidgetInfo(item.id));
  const updatedWidgets = adjustWidgetsToBoard({
    widgets,
    boardType: dashBoard.config.type,
    boardId: dashBoard.id,
    layouts,
  });
  // widgetInfoRecord
  dispatch(editWidgetInfoActions.addWidgetInfos(widgetInfos));
  // WidgetRecord
  dispatch(editBoardStackActions.addWidgets(updatedWidgets));
  return null;
});

export const addGroupWidgetToEditBoard = createAsyncThunk<
  null,
  Widget[],
  { state: RootState }
>('editBoard/addGroupWidgetToEditBoard', (widgets, { getState, dispatch }) => {
  const { dashBoard } = editBoardStackState(
    getState() as unknown as {
      editBoard: HistoryEditBoard;
    },
  );
  const { layouts } = boardInfoState(
    getState() as { editBoard: EditBoardState },
  );
  const widgetInfos = widgets.map(t => createWidgetInfo(t.id));
  const updatedWidgets = adjustWidgetsToBoard({
    widgets,
    boardType: dashBoard.config.type,
    boardId: dashBoard.id,
    layouts,
  });
  // widgetInfoRecord
  dispatch(editWidgetInfoActions.addWidgetInfos(widgetInfos));
  // WidgetRecord
  dispatch(editBoardStackActions.addWidgets(updatedWidgets));
  return null;
});
// addDataChartWidgets
export const addDataChartWidgets = createAsyncThunk<
  null,
  { boardId: string; chartIds: string[]; boardType: BoardType },
  { state: RootState }
>(
  'editBoard/addDataChartWidgets',
  async ({ boardId, chartIds, boardType }, { getState, dispatch }) => {
    const {
      data: { datacharts, views, viewVariables },
    } = await request2<{
      datacharts: ServerDatachart[];
      views: View[];
      viewVariables: Record<string, Variable[]>;
    }>({
      url: `viz/datacharts?datachartIds=${chartIds.join()}`,
      method: 'get',
    });
    const dataCharts: DataChart[] = getDataChartsByServer(datacharts, views);
    const dataChartMap = getDataChartMap(dataCharts);
    const viewViews = getChartDataView(views, dataCharts);
    dispatch(boardActions.setDataChartToMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));

    const widgets = chartIds.map(dcId => {
      const dataChart = dataChartMap[dcId];
      const viewIds = dataChart.viewId ? [dataChart.viewId] : [];
      let widget = widgetManager.toolkit(ORIGINAL_TYPE_MAP.linkedChart).create({
        boardType: boardType,
        datachartId: dcId,
        relations: [],
        name: dataChart.name,
        content: dataChartMap[dcId],
        viewIds: viewIds,
      });
      return widget;
    });
    dispatch(addWidgetsToEditBoard(widgets));

    Object.values(viewVariables).forEach(variables => {
      dispatch(addVariablesToBoard(variables));
    });
    return null;
  },
);

// addWrapChartWidget
export const addWrapChartWidget = createAsyncThunk<
  null,
  {
    boardId: string;
    chartId: string;
    boardType: BoardType;
    dataChart: DataChart;
    view: ChartDataView;
  },
  { state: RootState }
>(
  'editBoard/addWrapChartWidget',
  async (
    { boardId, chartId, boardType, dataChart, view },
    { getState, dispatch },
  ) => {
    const dataCharts = [dataChart];
    const viewViews = view ? [view] : [];
    dispatch(boardActions.setDataChartToMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));
    let widget = widgetManager.toolkit(ORIGINAL_TYPE_MAP.ownedChart).create({
      boardType: boardType,
      datachartId: chartId,
      relations: [],
      name: dataChart.name,
      content: dataChart,
      viewIds: view?.id ? [view.id] : [],
    });
    dispatch(addWidgetsToEditBoard([widget]));
    dispatch(addVariablesToBoard(view?.variables));

    return null;
  },
);

export const addChartWidget = createAsyncThunk<
  null,
  {
    boardId: string;
    chartId: string;
    boardType: BoardType;
    dataChart: DataChart;
    view: ChartDataView;
    subType: 'widgetChart' | 'dataChart';
  },
  { state: RootState }
>(
  'editBoard/addChartWidget',
  async (
    { boardId, chartId, boardType, dataChart, view, subType },
    { dispatch },
  ) => {
    const dataCharts = [dataChart];
    const viewViews = [view];
    dispatch(boardActions.setDataChartToMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));

    const originalType =
      subType === 'dataChart'
        ? ORIGINAL_TYPE_MAP.linkedChart
        : ORIGINAL_TYPE_MAP.ownedChart;

    let widget = widgetManager.toolkit(originalType).create({
      boardType: boardType,
      datachartId: chartId,
      relations: [],
      content: dataChart,
      viewIds: view.id ? [view.id] : [],
    });

    dispatch(addWidgetsToEditBoard([widget]));
    dispatch(addVariablesToBoard(view.variables));
    return null;
  },
);

export const renderedEditWidgetAsync = createAsyncThunk<
  null,
  { boardId: string; widgetId: string },
  { state: RootState }
>(
  'editBoard/renderedEditWidgetAsync',
  async ({ boardId, widgetId }, { getState, dispatch, rejectWithValue }) => {
    const { widgetRecord: WidgetMap } = editBoardStackState(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );
    const curWidget = WidgetMap[widgetId];
    if (!curWidget) return null;

    dispatch(editWidgetInfoActions.renderedWidgets([widgetId]));

    // 2 widget getData
    dispatch(getEditWidgetData({ widget: curWidget }));
    return null;
  },
);

//
export const uploadBoardImage = createAsyncThunk<
  string,
  {
    boardId: string;
    fileName: string;
    formData: FormData;
    resolve: (url: string) => void;
  }
>(
  'editBoard/uploadBoardImage',
  async ({ boardId, formData, fileName, resolve }, { getState, dispatch }) => {
    const { data } = await request2<string>({
      url: `files/viz/image?ownerType=${'DASHBOARD'}&ownerId=${boardId}&fileName=${
        uuidv4() + '@' + fileName
      }`,
      method: 'POST',
      data: formData,
    });
    resolve(data);
    return data;
  },
);

export const getEditWidgetData = createAsyncThunk<
  null,
  { widget: Widget; option?: getDataOption },
  { state: RootState }
>(
  'editBoard/getEditWidgetData',
  ({ widget, option }, { getState, dispatch }) => {
    dispatch(editWidgetInfoActions.renderedWidgets([widget.id]));
    if (widget.config.type === 'chart') {
      dispatch(getEditChartWidgetDataAsync({ widgetId: widget.id, option }));
    }
    if (widget.config.type === 'controller') {
      dispatch(getEditControllerOptions(widget.id));
    }
    return null;
  },
);

export const syncEditBoardWidgetChartDataAsync = createAsyncThunk<
  null,
  {
    boardId: string;
    sourceWidgetId: string;
    widgetId: string;
    option?: getDataOption;
    extraFilters?: PendingChartDataRequestFilter[];
    variableParams?: Record<string, any[]>;
  },
  { state: RootState }
>(
  'board/syncEditBoardWidgetChartDataAsync',
  async (
    { boardId, sourceWidgetId, widgetId, option, extraFilters, variableParams },
    { getState, dispatch },
  ) => {
    const boardState = getState() as { board: BoardState };
    const rootState = getState() as RootState;
    const stackEditBoard = rootState.editBoard as unknown as HistoryEditBoard;
    const { widgetRecord: widgetMap } = stackEditBoard.stack.present;
    const curWidget = widgetMap[widgetId];
    if (!curWidget) {
      return null;
    }
    const viewMap = boardState.board.viewMap;
    const dataChartMap = boardState.board.dataChartMap;
    const drillOption = boardDrillManager.getWidgetDrill({
      bid: curWidget.dashboardId,
      wid: widgetId,
    });
    const dataChart = dataChartMap?.[curWidget.datachartId ||''];
    const chartDataView = viewMap?.[dataChart?.viewId];
    const requestParams = new ChartDataRequestBuilder(
      {
        id: chartDataView?.id || '',
        config: chartDataView?.config || {},
        meta: chartDataView?.meta,
        computedFields: dataChart?.config?.computedFields || [],
      },
      dataChart?.config?.chartConfig?.datas,
      dataChart?.config?.chartConfig?.settings,
      {},
      false,
      dataChart?.config?.aggregation,
    )
      .addVariableParams(variableParams)
      .addExtraSorters(option?.sorters as any[])
      .addRuntimeFilters(extraFilters)
      .addDrillOption(drillOption)
      .build();
    requestParams['datasetCode'] = requestParams['viewCode']
    const { data } = await request2<WidgetData>(
      {
        method: 'POST',
        url: `data-set/data`,
        data: requestParams,
      },
      undefined,
      {
        onRejected: async error => {
          await dispatch(
            editWidgetInfoActions.setWidgetErrInfo({
              boardId,
              widgetId,
              errInfo: getErrorMessage(error),
              errorType: 'request',
            }),
          );
          await dispatch(
            editWidgetDataActions.setWidgetData({
              wid: widgetId,
              data: undefined,
            }),
          );
        },
      },
    );
    await dispatch(
      editWidgetDataActions.setWidgetData({
        wid: widgetId,
        data: { ...data, id: widgetId },
      }),
    );
    await dispatch(editWidgetInfoActions.renderedWidgets([widgetId]));
    await dispatch(
      editWidgetInfoActions.changeWidgetLinkInfo({
        boardId,
        widgetId,
        linkInfo: {
          sourceWidgetId,
          filters: extraFilters,
          variables: variableParams,
        },
      }),
    );
    await dispatch(
      editWidgetInfoActions.changePageInfo({
        boardId,
        widgetId,
        pageInfo: data?.pageInfo,
      }),
    );
    await dispatch(
      editWidgetInfoActions.setWidgetErrInfo({
        boardId,
        widgetId,
        errInfo: undefined,
        errorType: 'request',
      }),
    );
    return null;
  },
);

export const getEditChartWidgetDataAsync = createAsyncThunk<
  null,
  {
    widgetId: string;
    option?: getDataOption;
  },
  { state: RootState }
>(
  'editBoard/getEditChartWidgetDataAsync',
  async ({ widgetId, option }, { getState, dispatch, rejectWithValue }) => {
    const rootState = getState() as RootState;
    dispatch(editWidgetInfoActions.renderedWidgets([widgetId]));
    const stackEditBoard = rootState.editBoard as unknown as HistoryEditBoard;
    const { widgetRecord: widgetMap } = stackEditBoard.stack.present;
    const editBoard = rootState.editBoard;
    const boardInfo = editBoard?.boardInfo as BoardInfo;
    const boardState = rootState.board as BoardState;
    const widgetInfo = editBoard?.widgetInfoRecord[widgetId];
    const viewMap = boardState.viewMap;
    const curWidget = widgetMap[widgetId];

    if (!curWidget) return null;
    const dataChartMap = boardState.dataChartMap;
    const boardLinkFilters = boardInfo.linkFilter;
    const drillOption = boardDrillManager.getWidgetDrill({
      bid: EDIT_PREFIX + curWidget.dashboardId,
      wid: widgetId,
    });
    let requestParams = getChartWidgetRequestParams({
      widgetId,
      widgetMap,
      viewMap,
      option,
      widgetInfo,
      dataChartMap,
      boardLinkFilters,
      drillOption,
    });
    if (!requestParams) {
      return null;
    }
    let widgetData;
    requestParams['datasetCode'] = requestParams['viewCode']
    const { data } = await request2<WidgetData>(
      {
        method: 'POST',
        url: `data-set/data`,
        data: requestParams,
      },
      undefined,
      {
        onRejected: async error => {
          await dispatch(
            editWidgetInfoActions.setWidgetErrInfo({
              widgetId,
              errInfo: (error as any)?.message as any,
              errorType: 'request',
            }),
          );
          await dispatch(
            editWidgetDataActions.setWidgetData({
              wid: widgetId,
              data: undefined,
            }),
          );
        },
      },
    );
    widgetData = data;
    await dispatch(
      editWidgetDataActions.setWidgetData({
        wid: widgetId,
        data: filterSqlOperatorName(requestParams, widgetData) as WidgetData,
      }),
    );
    await dispatch(
      editWidgetInfoActions.changePageInfo({
        widgetId,
        pageInfo: data.pageInfo,
      }),
    );
    await dispatch(
      editWidgetInfoActions.setWidgetErrInfo({
        widgetId,
        errInfo: undefined,
        errorType: 'request',
      }),
    );
    await dispatch(
      editWidgetSelectedItemsActions.changeSelectedItemsInEditor({
        wid: widgetId,
        data: [],
      }),
    );
    return null;
  },
);

export const getEditControllerOptions = createAsyncThunk<
  null,
  string,
  { state: RootState }
>(
  'editBoard/getEditControllerOptions',
  async (widgetId, { getState, dispatch }) => {
    dispatch(editWidgetInfoActions.renderedWidgets([widgetId]));
    const rootState = getState() as RootState;
    const stackEditBoard = rootState.editBoard as unknown as HistoryEditBoard;
    const { widgetRecord: widgetMap } = stackEditBoard.stack.present;
    const widget = widgetMap[widgetId];
    if (!widget) return null;
    const content = widget.config.content as ControllerWidgetContent;
    const config = content.config;
    if (!Array.isArray(config.assistViewFields)) return null;
    if (config.assistViewFields.length < 2) return null;

    const boardState = rootState.board as BoardState;
    const viewMap = boardState.viewMap;
    const [viewId, ...columns] = config.assistViewFields;
    const view = viewMap[viewId];
    if (!view) return null;
    const requestParams = getControlOptionQueryParams({
      view,
      columns: columns,
      curWidget: widget,
      widgetMap,
    });
    if (!requestParams) {
      return null;
    }
    let widgetData;
    requestParams['datasetCode'] = requestParams['viewCode']
    const { data } = await request2<WidgetData>({
      method: 'POST',
      url: `data-set/data`,
      data: requestParams,
    });
    widgetData = data;
    dispatch(
      editWidgetDataActions.setWidgetData({
        wid: widgetId,
        data: filterSqlOperatorName(requestParams, widgetData) as WidgetData,
      }),
    );

    return null;
  },
);
