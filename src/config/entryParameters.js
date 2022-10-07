export const entryParameters = {
  page: {
    code:'page',
    titleElement: [
      {
        label: '',
        name: 'name',
        desc: '页面名称',
        placeholder: '请输入页面名称',
        required: true,
        type: "INPUT",
        gridSize: 5,
        length: 15
      },{
        label: '',
        name: 'subName',
        desc: '页面描述',
        placeholder: '请输入页面描述',
        required: true,
        type: "INPUT",
        gridSize: 5,
        length: 30
      },{
        label: '',
        name: 'categoryId',
        desc: '页面分类',
        placeholder: '请选择页面分类',
        required: true,
        type: "SELECT",
        gridSize: 5,
        defaultValue: parseInt('0'),
        options: [{name:'未分类',value:0},{name:'测试分类222',value:13}]
      }
    ],
    urls:{
      viewsUrl: `/data-set/list`,
      viewDetailUrl: `/data-set/:id`,
      dataUrl: `/data-set/data`,
      applicationsUrl: `/application/list`,
      applicationWidgetsUrl: `/application/widgets`,
      detailUrl: `/page/:id`,
      saveBoardsUrl: `/page`,
      fileUploadUrl: `/dashboard/files/image`,
      functionSupportUrl: `/data-set/data/function/support/:viewId`,
      editBoardPageUrl: `/page/161/viz/edit`,
    },
    applicationEnable: false
  },
  workspace: {
    code: 'workspace',
    titleElement: [],
    urls: {
      viewsUrl: `/data-set/list`,
      viewDetailUrl: `/data-set/:id`,
      dataUrl: `/data-set/data`,
      applicationsUrl: `/application/list`,
      applicationWidgetsUrl: `/application/widgets`,
      detailUrl: `/workspace`,
      saveBoardsUrl: `/workspace`,
      fileUploadUrl: `/dashboard/files/image`,
      functionSupportUrl: `/data-set/data/function/support/:viewId`,
    },
    applicationEnable: true
  },
  strategy: {
    code:'strategy',
    titleElement: [],
    urls:{
      viewsUrl: `/data-set/list`,
      viewDetailUrl: `/data-set/:id`,
      dataUrl: `/data-set/data`,
      applicationsUrl: `/application/list`,
      applicationWidgetsUrl: `/application/widgets`,
      detailUrl: `/page/:id`,
      saveBoardsUrl: `/page`,
      fileUploadUrl: `/dashboard/files/image`,
      functionSupportUrl: `/data-set/data/function/support/:viewId`,
    },
    applicationEnable: true
  },
}
