export enum AppWidgetConfigItemType {
  INPUT,
  SELECT,
  RADIO
}
export type AppWidgetConfigItemOption = {
  name: string;
  value: string;
}
export type AppWidgetConfigItem = {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  labelGrid?: number;
  tips?: string;
  type: AppWidgetConfigItemType;
  expression?: string;
  gridSize: number;
  defaultValue?: any;
  options?: AppWidgetConfigItemOption[]
}

export interface AppWidgetConfig {
  name: string,
  module: string,
  code: string,
  icon?: string,
  description?: string,
  order: number,
  enabled: boolean,
  width: number,
  height: number,
  entry: string,
  scope?: string[],
  configItem?: AppWidgetConfigItem[]
}


