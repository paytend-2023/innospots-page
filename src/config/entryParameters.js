export const entryParameters = {
  page: {
    code:'page',
    operateType: 'VIEW',
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
        defaultValue: parseInt("0"),
        requestOption: {
          requestUrl: "/page/category/page",
          nameField: "categoryName",
          valueFiled: "categoryId"
        }
      }
    ],
    urls:{
      viewsUrl: `/schema/data-set/list`,
      viewDetailUrl: `/schema/data-set/:id`,
      dataUrl: `/schema/data`,
      applicationsUrl: `/application/list`,
      detailUrl: `/page/:id`,
      saveBoardUrl: `/page`,
      publicBoardUrl: `/page/publish`,
      fileUploadUrl: `/page/files/image`,
      functionSupportUrl: `/schema/data/function/support/:viewId`,
      functionValidateUrl: `/schema/data/function/validate`,
      editBoardPageUrl: `/page/161/viz/edit`,
    },
    applicationEnable: false,
  },
  workspace: {
    code: 'workspace',
    operateType: 'VIEW',
    titleElement: [],
    urls: {
      viewsUrl: `/schema/data-set/list`,
      viewDetailUrl: `/schema/data-set/:id`,
      dataUrl: `/schema/data`,
      applicationsUrl: `/application/list`,
      detailUrl: `/workspace`,
      saveBoardUrl: `/workspace`,
      fileUploadUrl: `/page/files/image`,
      functionSupportUrl: `/schema/data/function/support/:viewId`,
      functionValidateUrl: `/schema/data/function/validate`,
    },
    applicationEnable: true,
    applications: ['innospot-libra-app-kernel']
  }
}
