import LS from './localStorage';
import { entryParameters } from '../config/entryParameters';
export type DatartComponentConfig = {
  code: string,
  titleElement?: DatartConfElement[],
  urls:{
    viewsUrl: string,
    viewDetailUrl: string,
    dataUrl: string,
    applicationsUrl?: string,
    applicationWidgetsUrl?: string,
    detailUrl: string,
    saveBoardsUrl: string,
    fileUploadUrl: string,
    functionSupportUrl: string,
    editBoardPageUrl?: string,
  },
  commonParams?: object,
  applicationEnable?: boolean | false,
}
export type DatartConfElement ={
  label?: string,
  name: string,
  desc?: string,
  placeholder: string,
  required: boolean,
  type: string,
  tips?: string,
  gridSize: number,
  defaultValue?: any,
  length?: number,
  options?: DatartConfElementOption[]
}
type DatartConfElementOption ={
  name: string,
  value: any
}
export type DatartComponentProps = {
  dashboardId: string;
  renderMode: string;
  hideTitle?: boolean;
  locale?: string;
  config: DatartComponentConfig;
  onCloseBoardEditor?: ()=>void;
  onCloseBoard?: ()=>void;
  onSuccessUpdateBoard?: (updateBoardId: string)=>void;
}

let curMasterState = {};
export const POWERED_BY_QIANKUN = (window as any).__POWERED_BY_QIANKUN__;

export const setMasterState = (data: any) => {
  curMasterState = data;
}

export const getMasterState = (): any => curMasterState;


export const saveSessionData = (userData: any) => {
  LS.set(LS.LOCAL_DATA_KEY, JSON.stringify(userData))
}

export const getSessionData = (): any => {
  if (POWERED_BY_QIANKUN) {
    try {
      return getMasterState().getSessionData()
    } catch (e) {}
  } else {
    const userData = LS.get(LS.LOCAL_DATA_KEY);

    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  }
}
let globalConfigState:DatartComponentConfig;
export const getGlobalConfigState = () => globalConfigState;
export const setGlobalConfigState = (): DatartComponentConfig => {
  let config = entryParameters.page;
  if (POWERED_BY_QIANKUN && getMasterState()) {
   if(getMasterState().pageType){
      console.log("getMasterState().pageType-----",getMasterState().pageType)
      config = entryParameters[getMasterState().pageType];
    }
   if(getMasterState().config){
     config = {
       ...config,
       ...getMasterState().config
     };
   }
    if(getMasterState().id){
      config.urls.detailUrl= config.urls.detailUrl.replace(":id", getMasterState().id);
    }
    if(getMasterState().editType && getMasterState().editType=='CREATE'){
      config.urls.detailUrl= '';
    }
  }
  globalConfigState = config;
  console.log("config----",config,globalConfigState)
  return config;
}
