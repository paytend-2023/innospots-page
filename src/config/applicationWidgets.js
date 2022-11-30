export const applications = {
  "innospot-libra-app-kernel": {
    kernelVersion: "1.1.0",
    name: "核心模块",
    icon: process.env.NODE_ENV !== 'production' ? "http://localhost:8881/images/app_core_module.png" : '/apps/visualization/images/app_core_module.png',
    status: 'ONLINE',
    vendor: "",
    version: "v1.1.0",
    applicationWigets: [
      {"name":"工作台详情","module":"core","code":"WorkspaceInfo","icon":"","description":"工作台的基本信息卡片","order":6,"enabled":true,"width":12,"height":4,"entry":"WorkspaceInfo","scope":["workspace"],"configItem":[]},
      {"name":"最新活动","module":"core","code":"NewActivity","icon":"","description":"工作台的最新活动卡片","order":7,"enabled":true,"width":6,"height":4,"entry":"NewActivity","scope":["workspace"],"configItem":[]},
      {"name":"系统更新","module":"core","code":"SystemInfo","icon":"","description":"工作台的系统更新卡片","order":8,"enabled":true,"width":6,"height":7,"entry":"SystemInfo","scope":["workspace"],"configItem":[]},
      // {"name":"应用更新","module":"core","code":"applicationInfo","icon":"","description":"工作台的应用更新卡片","order":9,"enabled":true,"width":6,"height":7,"entry":"applicationInfo","scope":["workspace"],"configItem":[]},
      {"name":"最新信息","module":"core","code":"NewMessage","icon":"","description":"工作台的最新信息卡片","order":10,"enabled":true,"width":6,"height":12,"entry":"NewMessage","scope":["workspace"],
        "configItem":[{"label":"展示消息数:","name":"itemsNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":22,"defaultValue":4 }]
      },
      {"name":"最新动态","module":"core","code":"NewDynamic","icon":"","description":"工作台的最新动态卡片","order":13,"enabled":true,"width":6,"height":10,"entry":"NewDynamic","scope":["workspace"],"configItem":[{"label":"展示消息数","name":"itemsNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":24,"defaultValue":5}]},
      {"name":"登录用户","module":"core","code":"UserLoginLog","icon":"","description":"工作台的登录用户卡片","order":12,"enabled":true,"width":6,"height":12,"entry":"UserLoginLog","scope":["workspace"],"configItem":[{"label":"展示消息数","name":"itemsNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":24,"defaultValue":5}]},
      {"name":"机器信息","module":"core","code":"MachineInfo","icon":"","description":"工作台的机器信息卡片","order":13,"enabled":true,"width":6,"height":6,"entry":"MachineInfo","scope":["workspace"],"configItem":[]},
    ],
  },
  "app-workflow": {
    kernelVersion: "1.1.0",
    name: "核心模块",
    icon: process.env.NODE_ENV !== 'production' ? "http://localhost:8881/images/app_community.png" : '/apps/visualization/images/app_community.png',
    status: 'ONLINE',
    vendor: "",
    version: "v1.1.0",
    applicationWigets: [
      {"name":"策略详情","module":"workflow","code":"StrategyDetail","icon":"","description":"策略详情的基本信息卡片","order":1,"enabled":true,"width":12,"height":4,"entry":"StrategyDetail","scope":["strategy","workspace"],"configItem":[]},
      // {"name":"Webhook触发概览","code":"webhookPreview","icon":"","description":"策略详情的Webhook触发概览卡片","order":2,"enabled":true,"width":12,"height":8,"entry":"webhookPreview","scope":["strategy"],"configItem":[]},
      // {"name":"Kafka消息处理概览","code":"kafakaPreview","icon":"","description":"策略详情的Kafka消息处理概览卡片","order":3,"enabled":true,"width":12,"height":8,"entry":"kafakaPreview","scope":["strategy"],"configItem":[]},
      // {"name":"计划任务执行概览","code":"planPreview","icon":"","description":"策略详情的计划任务执行概览卡片","order":4,"enabled":true,"width":12,"height":8,"entry":"planPreview","scope":["strategy"],"configItem":[]},
      // {"name":"变更记录","code":"changeRecord","icon":"","description":"策略详情的变更记录卡片","order":5,"enabled":true,"width":12,"height":12,"entry":"changeRecord","scope":["strategy"],
      //   "configItem":[{"label":"展示消息数","name":"itemsNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":22,"defaultValue":3}]}
    ],
  }
};




