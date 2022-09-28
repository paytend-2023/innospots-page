import {Button, Cascader, Col, Form, Input, Modal, Radio, Row, Space, Checkbox, Select, message} from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import allApp from 'app/assets/images/all_apps.svg';
import appCoreModule from 'app/assets/images/app_core_module.svg';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { editBoardStackActions, editDashBoardInfoActions } from '../../slice';
import {
  addWidgetsToEditBoard
} from '../../slice/thunk';
import {ApplicationInfo, ApplicationWidgetContent} from "app/pages/DashBoardPage/pages/Board/slice/types";
import cls from "classnames";
import {
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import sortBy from 'lodash/sortBy';
import forEach from 'lodash/forEach';
import indexOf from 'lodash/indexOf';
import filter from 'lodash/filter';
import map from 'lodash/map';
import each from 'lodash/each';
import {getComponentByName} from 'utils/sharedComponents';
import GridLayout, {Layout} from 'react-grid-layout';
import {BoardToolBarContext} from "app/pages/DashBoardPage/pages/BoardEditor/components/BoardToolBar/context/BoardToolBarContext";
import {
   AppWidgetConfig,
   AppWidgetScope
} from "app/pages/DashBoardPage/pages/BoardEditor/components/ApplicationWidgetPanel/types";
import {
  selectApplicationPanel,
  selectControllerPanel
} from "app/pages/DashBoardPage/pages/BoardEditor/slice/selectors";
import { DatartContext } from 'app/contexts/DatartContext';
import widgetManagerInstance from '../../../../components/WidgetManager';
import { ORIGINAL_TYPE_MAP } from '../../../../constants';
import { getMasterState, POWERED_BY_QIANKUN } from 'utils/globalState';

export interface ApplicationEditorProps {
  onSaveInApplication?: (widgetId: string) => void;
}

const ApplicationWidgetPanel: React.FC<ApplicationEditorProps> = memo((
  {onSaveInApplication}
) => {
  const dispatch = useDispatch();
  const { urls,code: datartCode,commonParams } = useContext(DatartContext)
  const { type, widgetId,configContent } = useSelector(selectApplicationPanel);
  const gt = useI18NPrefix(`global.modal.title`);
  const {boardId, boardType} = useContext(BoardToolBarContext);
  const [selectedAppKey, setSelectedAppKey] = useState<string>('');
  const [selectedAppWidget,setSelectedAppWidget] = useState<AppWidgetConfig>({} as AppWidgetConfig);
  const [applicationsMap,setApplicationsMap] = useState({} as Map<string,ApplicationInfo>);
  const [selectedWidgets,setSelectedWidgets] = useState([] as AppWidgetConfig[]);
  const [widgetApplicationVisible, setWidgetApplicationVisible] = useState(false);
  const [formIns] = Form.useForm();
  const [formError, setFormError] = useState({});
  let  setMicroAppGlobalState = (state)=>{}
  let  offMicroAppGlobalStateChange = ()=>{}
  // import("app111/SystemInfo").then( res =>{
  //   var aaa  = res.default;
  //   console.log("app111/SystemInfo-------",aaa);
  // })

  useEffect(() => {
    const hide = !type || type === 'hide';
    console.log("hide-------",hide)
    setWidgetApplicationVisible(!hide);
    if(!hide){
      // loadMicroApp({
      //   name: 'app',
      //   entry: '//1.15.20.45:8686/apps/demo1/index.html',
      //   container: '#appItem1'
      // });
      // loadApplications();
      if(type=="add"){
        setSelectedAppWidget({} as AppWidgetConfig)
      }
        let appMap = {} as Map<string,ApplicationInfo>
        appMap["innospot-libra-app-kernel"] = {
          applicationWigets: [],
          appKey: "innospot-libra-app-kernel",
          kernelVersion: "1.1.0",
          name: "核心模块",
          icon: "app/assets/images/app_core_module.svg",
          status: 'ONLINE',
          vendor: "",
          version: "v1.1.0",
        };
      setApplicationsMap(appMap);
      setSelectedAppKey("innospot-libra-app-kernel")
    }
  }, [type]);
  useEffect(()=>{
    if(widgetId && configContent){
      const appWidgetConfig = JSON.parse(configContent.appWidgetConfig)
      let formFieldsValues: any = []
      forEach(Object.keys(appWidgetConfig),function (item){
        formFieldsValues.push({
          "name": item,
          "value": appWidgetConfig[item]
        })
      })
      formIns.setFields(formFieldsValues);
      setSelectedAppWidget(configContent.appWidgetInfo)
    }
  },[widgetId, configContent])

  // useEffect(()=>{
  //   const {onGlobalStateChange,
  //     setGlobalState,
  //     offGlobalStateChange }
  //     = initGlobalState({});
  //     setMicroAppGlobalState = setGlobalState
  //     offMicroAppGlobalStateChange = offGlobalStateChange
  //     onGlobalStateChange((value, prev) => {
  //       console.log('[onGlobalStateChange - master111]:', value, prev)
  //     });
  //   return  ()=> {
  //     console.log("abcddd")
  //     offGlobalStateChange();
  //   }
  // },[])

  // const loadApplications = async () => {
  //   const data  = await dispatch(getApplications({applicationsUrl: urls.applicationsUrl ||''}))
  //   const apps = data['payload'] as ApplicationInfo[]
  //   if(apps != null && apps.length>0){
  //     let appMap = {} as Map<string,ApplicationInfo>
  //     each(apps, function (item){
  //       item.applicationWigets = [];
  //       appMap[item.appKey] = item;
  //     })
  //     loadApplicationWidgets(apps[0].appKey, appMap)
  //   }
  // }
  // const loadApplicationWidgets = async (appKey: string, appWidgetsMap: Map<string,ApplicationInfo>) => {
  //   let data = await dispatch(getApplicationWidgets({appKey,scope: datartCode, applicationWigetsUrl: urls.applicationWidgetsUrl ||''}))
  //   appWidgetsMap[appKey].applicationWigets = data['payload']
  //   setSelectedAppKey(appKey)
  //   setApplicationsMap(appWidgetsMap);
  //   setSelectedWidgets(appWidgetsMap[appKey]?.applicationWigets||[])
  // }


  const afterClose = useCallback(() => {
    // offMicroAppGlobalStateChange()
    formIns.resetFields();
    dispatch(
      editDashBoardInfoActions.changeApplicationPanel({
        type: 'hide',
        widgetId: ''
      })
    );
  }, [dispatch, formIns]);

  const onSubmit = useCallback(() => {
    formIns.validateFields().then(values => {
      setImmediate(() => {
        // const widget = widgetToolKit.application.create({
        //   dashboardId: boardId,
        //   boardType: 'auto',
        //   applicationInfo: {
        //     ...applicationsMap[selectedAppKey],
        //     applicationWigets: null
        //   },
        //   appWidgetInfo: selectedAppWidget,
        //   appWidgetConfig: JSON.stringify(values),
        // });
        let widget = widgetManagerInstance.toolkit(ORIGINAL_TYPE_MAP.application).create({
          boardType,
          content: {
              applicationInfo: {
                ...applicationsMap[selectedAppKey],
                applicationWigets: null
              },
              appWidgetInfo: selectedAppWidget,
              appWidgetConfig: JSON.stringify(values),
          },
        });
        console.log("widget----",widget,JSON.stringify(values))
        dispatch(addWidgetsToEditBoard([widget]));
        setWidgetApplicationVisible(false);
      });
    }).catch(error => {
      message.info("请输入正确的参数");
    });
    // setMicroAppGlobalState({
    //   messageNumber: appConfig.messageNumber
    // });

  }, [formIns,selectedAppKey,selectedAppWidget,applicationsMap]);

  const appIcon = (appIconSrc)=>{
    if(appIconSrc){
      return ( <img src={appCoreModule} alt="" className="icon"/>)
    }
    return (<img src={allApp} alt="" className="icon" />)
  };
  const onAppKeyClick = function(appKey){
    setSelectedAppKey(appKey)
    setSelectedWidgets(applicationsMap[appKey].applicationWigets)
  }

  const renderCategoryList = () => {
    return (
      <ul className="appTypeList">
        {
          Object.keys(applicationsMap).map((appKey: any) => (
            <li
              key={appKey}
              className={cls("listItem", {
                ['active']: selectedAppKey === appKey
              })}
              onClick={() => onAppKeyClick(appKey)}
            >
              {/*{ appTypeIcons[appItem.value] }*/}
              {appIcon(`${applicationsMap[appKey].icon}`)}
              <span className="label">{ applicationsMap[appKey].name ? applicationsMap[appKey].name : '其他应用' }</span>
            </li>
          ))
        }
      </ul>
    )
  }
  const onSearch = (value) =>{
      setSelectedWidgets(filter(applicationsMap[selectedAppKey].applicationWigets,function (item){
        return item.name.indexOf(value)!=-1
      }))
  }
  const selectAppWidget = (appWidget) => {
    setSelectedAppWidget(appWidget);
    let formFieldsValues: any = []
    map(appWidget.configItem,function (configItem){
      if(configItem.defaultValue){
        formFieldsValues.push({
          name: configItem.name,
          value: configItem.defaultValue
        })
      }

    })
    formIns.setFields(formFieldsValues)
  }

  const renderAppsList = () => {
    let layout = [] as Layout[];
    const applicationWidgets = [
      {"name":"工作台详情","code":"workspaceInfo","icon":"","description":"工作台的基本信息卡片","order":6,"enabled":true,"width":12,"height":4,"entry":"workspaceInfo","scope":["workspace"],"configItem":[]},
      {"name":"最新活动","code":"newActivity","icon":"","description":"工作台的最新活动卡片","order":7,"enabled":true,"width":6,"height":4,"entry":"newActivity","scope":["workspace"],"configItem":[]},
      {"name":"系统更新","code":"systemInfo","icon":"","description":"工作台的系统更新卡片","order":8,"enabled":true,"width":6,"height":7,"entry":"systemInfo","scope":["workspace"],"configItem":[]},
      // {"name":"应用更新","code":"applicationInfo","icon":"","description":"工作台的应用更新卡片","order":9,"enabled":true,"width":6,"height":7,"entry":"applicationInfo","scope":["workspace"],"configItem":[]},
      // {"name":"最新信息","code":"newMessage","icon":"","description":"工作台的最新信息卡片","order":10,"enabled":true,"width":6,"height":9,"entry":"newMessage","scope":["workspace"],
      //   "configItem":[{"label":"展示消息数:","name":"msgNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":22,"defaultValue":3 }]
      //  },
       {"name":"最新动态","code":"newDynamic","icon":"","description":"工作台的最新动态卡片","order":13,"enabled":true,"width":6,"height":10,"entry":"newDynamic","scope":["workspace"],"configItem":[{"label":"展示消息数","name":"itemsNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":22,"defaultValue":3}]},
       {"name":"登录用户","code":"userLoginLog","icon":"","description":"工作台的登录用户卡片","order":12,"enabled":true,"width":6,"height":11,"entry":"userLoginLog","scope":["workspace"],"configItem":[{"label":"展示消息数","name":"itemsNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":22,"defaultValue":3}]},
       {"name":"机器信息","code":"machineInfo","icon":"","description":"工作台的机器信息卡片","order":13,"enabled":true,"width":6,"height":6,"entry":"machineInfo","scope":["workspace"],"configItem":[]},
      // {"name":"策略详情","code":"strategyDetail","icon":"","description":"策略详情的基本信息卡片","order":1,"enabled":true,"width":12,"height":4,"entry":"strategyDetail","scope":["strategy"],"configItem":[]},
      // {"name":"Webhook触发概览","code":"webhookPreview","icon":"","description":"策略详情的Webhook触发概览卡片","order":2,"enabled":true,"width":12,"height":8,"entry":"webhookPreview","scope":["strategy"],"configItem":[]},
      // {"name":"Kafka消息处理概览","code":"kafakaPreview","icon":"","description":"策略详情的Kafka消息处理概览卡片","order":3,"enabled":true,"width":12,"height":8,"entry":"kafakaPreview","scope":["strategy"],"configItem":[]},
      // {"name":"计划任务执行概览","code":"planPreview","icon":"","description":"策略详情的计划任务执行概览卡片","order":4,"enabled":true,"width":12,"height":8,"entry":"planPreview","scope":["strategy"],"configItem":[]},
      // {"name":"变更记录","code":"changeRecord","icon":"","description":"策略详情的变更记录卡片","order":5,"enabled":true,"width":12,"height":12,"entry":"changeRecord","scope":["strategy"],
      //   "configItem":[{"label":"展示消息数","name":"itemsNum","placeholder":"请输入展示消息数","required":true,"type":"INPUT","gridSize":22,"defaultValue":3}]}
    ]
    //selectedWidgets
    const applicationWidgetsSortByOrder = sortBy(applicationWidgets,function(item){
      return item['order'];
    })
    let curWidth = 0;
    let curHeight = 0;

    const appsComps = map(applicationWidgetsSortByOrder, function(item,index){
      let AppComponent = getComponentByName("systemInfo");
      if(POWERED_BY_QIANKUN){
        AppComponent =  getComponentByName(item['code'])
      }
      if(!AppComponent || !item['enabled'] || indexOf(item.scope,datartCode)==-1){
        return '';
      }
      console.log("AppComponent----",AppComponent,item.scope,datartCode)
      let width = item['width'];
      let height = item['height'];

      layout.push({
        i: item['code'],
        x: curWidth,
        y: curHeight,
        w: width,
        h: height,
        isDraggable: false,
        isResizable: false
        // static: true
      })
      if(curWidth + width >= 12){
        curWidth = 0;
        curHeight += height;
      }else{
        curWidth += width;
      }
      return (
          <div key={item.code} >
            <div  className="appItem" onClick={()=>{selectAppWidget(item);}} >
              <div className="appSelected" hidden={item.code!=selectedAppWidget.code} ><CheckCircleOutlined className="appSelectedIcon"/></div>
                {/*<React.Suspense fallback="Loading Component">*/}
                {/*  <AppComponent  />*/}
                {/*</React.Suspense>*/}
            </div>
          </div>
        )
    })
    return (
      <div className="appList">
        <div className="appSearch">
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索小组件"
            className="appSearchInput"
            onPressEnter={(event) => onSearch(event.target)}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
        <div className="appContainer" hidden={selectedAppKey == "innospot-libra-app-kernel"}>
          {/*<div className="appItem"  onClick={()=>{setSelectedAppWidget("appItem1");}} >*/}
          {/*  <div className="appSelected" hidden={selectedAppWidget.code !="appItem1"}><CheckCircleOutlined className="appSelectedIcon"/></div>*/}
          {/*  <div className="appItemContent" id="appItem1"></div>*/}
          {/*</div>*/}
        </div>
        <div className="appContainer" hidden={selectedAppKey != "innospot-libra-app-kernel"}>
          <GridLayout className="layout"
                      cols={12}
                      rowHeight={32}
                      width={690}
                      layout={layout}
                      verticalCompact={true}
                      compactType={'vertical'}>
            {appsComps}
          </GridLayout>
        </div>
      </div>
    )
  }

  const getFormItem = (formItem: any) => {
    let element;
    switch (formItem.type) {
      case 'RADIO':
        element = (
          <Radio.Group style={{marginTop: 8}}>
            {
              map(formItem.options, (option) => {
                return <Radio value={option.value}>{option.name}</Radio>;
              })
            }
          </Radio.Group>
        );
        break;
      case 'SELECT':
        element = (
          <Select placeholder={formItem.placeholder} style={{width: '100%', borderRadius: '8px'}}>
            {
              map(formItem.options, (option) => {
                return <Select.Option value={option.value}>{option.name}</Select.Option>;
              })
            }
          </Select>
        );
        break;
      case 'CHECKBOX':
        element = (
          <Checkbox.Group style={{width: '100%', borderRadius: '8px'}}>
            {
              map(formItem.options, (option) => {
                return (
                  <> <Checkbox value={option.value} style={{marginTop: 15}} /> {option.name}<br /></>
                )
              })
            }
          </Checkbox.Group>
        );
        break;
      case 'INPUT':
        element = <Input placeholder={formItem.placeholder} style={{marginTop: 15, borderRadius: 8}} />;
        break;
      default:
        element = "";
        break;
    }
    return (
      <>
        <Col span={Math.max(formItem.gridSize, 2)}>
          <div className={cls('formItem', {['hasError']: !!formError[formItem.name]})}>
            <span style={{paddingTop: 30, display: 'inline-block'}}> {formItem.label}</span>
            <Form.Item
              noStyle
              name={formItem.name}
              label={formItem.name}
              rules={[
                {
                  message: formItem.tips,
                  required: formItem.required,
                },
              ]}
            >
              {element}
            </Form.Item>
            <div className={'error'}>{formError[formItem.name]}</div>
          </div>
        </Col>
      </>
    );
  }
  const renderConfigContent = useCallback(() => {
      return (
        <div className="formContent">
          <div className="formTitle">插件设置</div>
          <Form form={formIns}
                layout="vertical"
                preserve={false}
               >
                  {
                    selectedAppWidget.configItem && selectedAppWidget.configItem.length>0 &&
                    map(selectedAppWidget.configItem, (item) => {
                      return getFormItem(item);
                    })
                  }
          </Form>
        </div>
      )
    }
    ,[selectedAppWidget])

  return (
    <Modal
      title={type=='add'?"新建小组件":"更新小组件"}
      visible={widgetApplicationVisible}
      onOk={onSubmit}
      centered
      destroyOnClose
      width={1380}
      afterClose={afterClose}
      onCancel={() => setWidgetApplicationVisible(false)}
    >
      <Container>
        { renderCategoryList() }
        { renderAppsList() }
        { renderConfigContent() }
      </Container>
    </Modal>
  );
});
export default ApplicationWidgetPanel;
const Container = styled.div`
  display: flex;
  flex: 1;
  height: 600px;

  .appTypeList {
    padding:0 0 0 24px;

    .listItem {
      width:262px;
      height: 65px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 12px;

      .label {
        font-size: 16px;
        margin-left: 24px;
        font-weight: 600;
      }

      .icon {
        //font-size: 26px;
        width: 48px;
        height: 48px;
        margin-left: 24px;
      }

      &:hover:not(.active) {
        background-color: #E5ECFF;
      }

      &.active {
        cursor: default;
        background-color: #E5ECFF;
      }
    }
  }
  .formContent{
    width: 320px;
    padding: 0 20px;
    overflow: auto;

    .formTitle{
      font-size: 18px;
      font-weight: 650;
    }
  }
  .appList{
    flex: 1;
    overflow-y: auto;

    .appSearch{
      margin-left: 24px;
      .polaris-input-affix-wrapper:before{content: '' ;}
      .appSearchInput{
        width: 320px;
        background-color: #fff;
        border-radius: 8px;
      }
    }

    .appContainer{
      margin-top: 8px;
      display: flex;
      flex-wrap: wrap;

      .appItem{
        margin-left: 24px;
        margin-top: 12px;
        position: relative;
        box-shadow: 0px 4px 10px rgb(0 0 0 / 10%);

        .appSelected{
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, 0.3);
          text-align: right;
          z-index: 99999;
        }
        .appSelectedIcon{
          color: #15AD31;
          font-size: 22px;
          margin-top: 3px;
          margin-right: 3px;
          opacity: 1;
        }
        .appItemContent{
            width: 100%;
            height: 100%;
        }
      }
    }
  }
  `
