/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { createGlobalStyle } from 'styled-components/macro';
import { BORDER_RADIUS } from 'styles/StyleConstants';

export const Form = createGlobalStyle`
  .datart-ant-input {
    &.ant-input {
      color: ${p => p.theme.textColorSnd};
      background-color: ${p => p.theme.componentBackground};
      border-color: ${p => p.theme.emphasisBackground};
      box-shadow: none;

      &:hover,
      &:focus {
        border-color: ${p => p.theme.emphasisBackground};
        box-shadow: none;
      }

      &:focus {
        background-color: ${p => p.theme.emphasisBackground};
      }
    }
  }

  .datart-ant-select {
    &.ant-select {
      color: ${p => p.theme.textColorSnd};
    }

    &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
      border-color: ${p => p.theme.emphasisBackground} !important;
      border-radius: ${BORDER_RADIUS};
      box-shadow: none !important;
    }
  }

  .datart-ant-input-number {
    &.ant-input-number {
      width: 100%;
      background-color: ${p => p.theme.componentBackground};
      border-color: ${p => p.theme.emphasisBackground};
      border-radius: ${BORDER_RADIUS};
      box-shadow: none;

      &:hover,
      &:focus {
        border-color: ${p => p.theme.emphasisBackground};
        box-shadow: none;
      }

      &:focus {
        background-color: ${p => p.theme.emphasisBackground};
      }
    }

    .ant-input-number-input {
      color: ${p => p.theme.textColorSnd};
    }

    .ant-input-number-handler-wrap {
      background-color: ${p => p.theme.bodyBackground};
    }

    .ant-input-number-disabled {
      background-color: ${p => p.theme.textColorDisabled};
    }
  }

  .datart-ant-upload {
    &.ant-upload.ant-upload-drag {
      background-color: ${p => p.theme.bodyBackground} !important;
      border-color: transparent !important;
      border-radius: ${BORDER_RADIUS};
    }
  }

  .datart-modal-button {
    &.ant-btn {
      color: ${p => p.theme.textColorSnd};
      background-color: ${p => p.theme.bodyBackground};
      border: 0;
      border-radius: ${BORDER_RADIUS};

      &:hover,
      &:active {
        color: ${p => p.theme.textColorSnd};
        background-color: ${p => p.theme.emphasisBackground};
      }
    }
  }
  .formWrapper {
    .formItems {
      .formLabel {
        margin-bottom: 20px;
        line-height: @height-base;
        text-align: right;

        .x {
          color: @error-color;
        }
      }
      .formItem {
        position: relative;

        &.hasError {
          .error {
            display: block;
          }

          :global {
            .@{ant-prefix}-input,
            .@{ant-prefix}-input-affix-wrapper {
              border-color: @error-color;
            }
          }
        }

        .error {
          position: absolute;
          bottom: -20px;
          display: none;
          color: @error-color;
          font-size: 12px;
        }
      }
    }
  }
  .ant-input{
    border-radius: 4px;
  }
  .ant-btn{
    border-radius: 4px;
    &.ant-btn-primary{
      background: #1245FA !important;
      border: 1px solid #1245FA !important;
      &:active,&:hover{
        background: #1245FA;
        border: 1px solid #1245FA;
      }
    }
  }
  .ant-modal-content .ant-modal-footer{
    .ant-btn{
      height: 38px;
    }
  }
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #1245FA;
    text-shadow: 0 0 .25px currentColor;
    font-weight: bold;
  }
  .ant-tabs-nav-list .ant-tabs-ink-bar {
    background: #1245FA;
  }
  .datart-confirm-modal{
    .ant-modal-content{
      .ant-modal-body{
        padding: 0;
        border-radius: 4px;
        .ant-modal-confirm-body-wrapper{
          .ant-modal-confirm-body{
            .ant-modal-confirm-title{
              font-size: 20px;
              border: 1px solid #F5F5F5;
              display: block;
              padding: 24px;
            }
            .ant-modal-confirm-content{
              padding: 16px 24px;
              margin-top: 0;
            }
          }
          .ant-modal-confirm-btns {
            margin: 24px;
            .ant-btn {
              height: 38px;
            }
          }
        }
      }
    }
  }
  .ant-pagination .ant-pagination-item-active{
    color: #1245FA;
    border-color: #1245FA;
  }
  .ant-menu-item-selected, .ant-menu-item-selected a, .ant-menu-item-selected a:hover{
    color: #1245FA !important;
  }
`;
