import React from "react";
import styled from 'styled-components';

const Index: React.FC = () => {

  return (
    <Container>
      <p>系统信息</p>
      <div>
        <div style={{ width: 24, float: 'left'}}>
          <img src={require('app/assets/images/logo.svg').default} alt="right" style={{ width: 24 }}/>
        </div>
        <div style={{paddingLeft: 32}}>
          <p className={'title'}>
            您使用的Innospot Libra是最新版本
          </p>
          <p className={'value'}>当前版本：5.8.2</p>
          <p className={'value'}>最后检查时间：2021年11月22日 12:43</p>
        </div>
      </div>
    </Container>
  )
}
export default Index;
const Container = styled.div`
    width: 100%;
    height: 100%;
    padding: 12px;
    position: relative;
    border-radius: 10px;
    border: 1px solid #000;
    background-color: #fff;
    font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
    font-weight: 500;
    font-style: normal;

    .title {
      font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
      font-weight: 500;
      font-style: normal;
      font-size: 16px;
    }

    p.title {
      margin-bottom: 4px;
    }

    p.value {
      margin-bottom: 8px;
    }

    .value {
      font-family: 'ArialMT', 'Arial', sans-serif;
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #333333;
    }

    .operation {
      //width: 80px;
      bottom: 8px;
      right: 12px;
      position: absolute;
    }

`
