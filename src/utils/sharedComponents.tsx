import React from 'react';

let componentContent = {};

export const importCoreWidgets = async () => {
  return new Promise(resolve => {
    if (!Object.keys(componentContent).length) {
      import('coreModule/CoreWidget').then(res => {
        componentContent = res;
        resolve(componentContent)
      })
    } else {
      resolve(componentContent)
    }
  })
}

/**
 * 根据组件名称获取组件
 * @param name
 */
export const getComponentByName = (name: string) => {
  return componentContent[name]
};

// @ts-ignore
export const SharedComponent:React.FC<{
  name: string
}> = ({name, children, ...rest}) => {
  const Component = getComponentByName(name);
  console.log("Component-----",Component)
  return Component ? (
    <Component {...rest}>{children}</Component>
  ) : (<></>)
}
