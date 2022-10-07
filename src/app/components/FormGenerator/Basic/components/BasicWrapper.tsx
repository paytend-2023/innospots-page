import { Form, FormItemProps } from 'antd';
import styled from 'styled-components/macro';

export function BW(props: FormItemProps) {
  return <Wrapper {...props} colon={false} />;
}

const Wrapper = styled(Form.Item)`
  &.ant-form-item{
    //flex-direction: column;
    margin: 0;

    .ant-form-item-control{
      margin-bottom: 16px;
    }
    .ant-form-item-label{
      text-align: left;
      margin-bottom: 12px;

      .ant-form-item-no-colon{
        color: #4E5969;
        font-weight: 400;
        line-height: 22px;
      }
    }
  }
`;
