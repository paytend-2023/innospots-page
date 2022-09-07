import { createContext } from 'react';

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
  type: ElementType,
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
export enum ElementType {
  INPUT = 'INPUT',
  RADIO = 'RADIO',
  SELECT = 'SELECT',
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
export const DatartContext = createContext<DatartComponentConfig>({} as DatartComponentConfig);
