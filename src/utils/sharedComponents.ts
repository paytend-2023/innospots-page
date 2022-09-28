import React from 'react';

const SystemInfo = React.lazy(() => import("coreModule/SystemInfo"));
const WorkspaceInfo = React.lazy(() => import("coreModule/WorkspaceInfo"));
const NewActivity = React.lazy(() => import("coreModule/NewActivity"));
const MachineInfo = React.lazy(() => import("coreModule/MachineInfo"));
const UserLoginLog = React.lazy(() => import("coreModule/UserLoginLog"));
const NewDynamic = React.lazy(() => import("coreModule/NewDynamic"));
// const CoreWidget = React.lazy(() => import("coreModule/CoreWidget"));

export const componentContent = {
  systemInfo: SystemInfo,
  workspaceInfo: WorkspaceInfo,
  newActivity: NewActivity,
  machineInfo: MachineInfo,
  userLoginLog: UserLoginLog,
  newDynamic: NewDynamic,
};

/**
 * 根据组件名称获取组件
 * @param name
 */
export const getComponentByName = name => {
  let result = componentContent[name || ''];
  return result;
};
