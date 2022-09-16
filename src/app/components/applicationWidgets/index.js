import SystemInfo from './SystemInfo';

export const componentContent = {
  systemInfo: SystemInfo,
};

/**
 * 根据组件名称获取组件
 * @param name
 */
export const getComponentByName = name => {
  let result = componentContent[name || ''];
  return result;
};
