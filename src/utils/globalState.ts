let curMasterState = {};
export const POWERED_BY_QIANKUN = (window as any).__POWERED_BY_QIANKUN__;

export const setMasterState = (data: any) => {
  curMasterState = data;
}

export const getMasterState = (): any => curMasterState;
