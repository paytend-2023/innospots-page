import React from 'react';

let componentContent = {
  core: {},
  workflow: {}
};

export const importCoreWidgets = async () => {
  return new Promise(async (resolve, reject) => {
    if (!Object.keys(componentContent.core).length) {
      const coreWidgets = await import('coreModule/CoreWidget');
      componentContent.core = coreWidgets;
    }

    if (!Object.keys(componentContent.workflow).length) {
      const workflowWidgets = await import('workflowModule/WorkflowWidgets');
      componentContent.workflow = workflowWidgets;
    }

    resolve(componentContent)
    reject(new Error('hi'));
  })
}

/**
 * 根据组件名称获取组件
 * @param name
 */
export const getComponentByName = (name: string) => {
  const ns = name.split('/');
  return componentContent[ns[0]][ns[1]]
};

// @ts-ignore
export const SharedComponent:React.FC<{
  name: string
}> = ({name, children, ...rest}) => {
  const Component = getComponentByName(name);
  return Component ? (
    <Component {...rest}>{children}</Component>
  ) : (<></>)
}
