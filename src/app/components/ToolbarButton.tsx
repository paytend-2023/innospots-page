import { Button, ButtonProps } from 'antd';
import { lighten } from 'polished';
import styled from 'styled-components/macro';
import { FONT_SIZE_BASE } from 'styles/StyleConstants';
import { mergeClassNames } from 'utils/utils';

export interface ToolbarButtonProps extends ButtonProps {
  fontSize?: number;
  iconSize?: number;
  color?: string;
  disabled?: boolean;
  label?: string;
}

export function ToolbarButton({
  fontSize = FONT_SIZE_BASE,
  iconSize = 13,
  color,
  disabled,
  label,
  ...buttonProps
}: ToolbarButtonProps) {
  return (
    <Wrapper
      fontSize={fontSize}
      iconSize={iconSize}
      color={color}
      disabled={disabled}
    >
      <Button
        type="link"
        disabled={disabled}
        {...buttonProps}
        className={mergeClassNames(buttonProps.className, 'btn')}
      >
        {label}
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.span<ToolbarButtonProps>`
  .btn {
    color: ${p =>
      p.disabled
        ? p.theme.textColorDisabled
        : p.color || '#86909C'};

    &:hover {
      color: ${p =>
        p.disabled
          ? p.theme.textColorDisabled
          : p.color || '#5278FF'};
      // background-color: ${p => p.theme.bodyBackground};
    }

    &:focus,
    &:active {
      color: ${p =>
        p.disabled
          ? p.theme.textColorDisabled
          : '#1245FA'};
    }

    .anticon {
      font-size: ${p => p.iconSize}px;
    }
  }
`;
