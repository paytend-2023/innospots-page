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

    // if (!Object.keys(componentContent.workflow).length) {
    //   const workflowWidgets = await import('workflowModule/WorkflowWidgets');
    //   componentContent.workflow = workflowWidgets;
    // }

    resolve(componentContent);
    reject(new Error('module error'));
  })
}

/**
 * 根据组件名称获取组件
 * @param name
 */
export const getComponentByName = (module: string,name: string) => {
  return componentContent[module][name]
};

// @ts-ignore
export const SharedComponent:React.FC<{
  module: string,
  name: string,
}> = ({module, name,children, ...rest}) => {
  const Component = getComponentByName(module,name);
  return Component ? (
    <Component {...rest}>{children}</Component>
  ) : (<></>)
}
