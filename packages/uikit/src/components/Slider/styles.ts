import { InputHTMLAttributes } from "react";
import { styled } from "styled-components";
import Text from "../Text/Text";

interface SliderLabelProps {
  progress: string;
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  $isMax: boolean;
}

interface DisabledProp {
  disabled?: boolean;
}

const getCursorStyle = ({ disabled = false }: DisabledProp) => {
  return disabled ? "not-allowed" : "pointer";
};

const bunnyHeadMax = `/images/d.svg`;
const bunnyHeadMain = `/images/d.svg`;
const bunnyButt = `/images/u.svg`;

const getBaseThumbStyles = ({ $isMax, disabled }: StyledInputProps) => `
  -webkit-appearance: none;
  background-image: url(${$isMax ? bunnyHeadMax : bunnyHeadMain});
  background-color: transparent;
  background-repeat: no-repeat;
  box-shadow: none;
  border: 0;
  cursor: ${getCursorStyle};
  width: 15px;
  height: 40px;
  filter: ${disabled ? "grayscale(100%)" : "none"};
  transition: 200ms opacity;
  &:hover {
    opacity: ${disabled ? 1 : 0.8}
  }
`;

export const SliderLabelContainer = styled.div`
  bottom: 0;
  position: absolute;
  left: 14px;
  width: calc(100% - 30px);
`;

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: ${({ progress }) => progress};
  position: absolute;
  text-align: center;
  min-width: 24px; // Slider thumb size
`;

export const BunnyButt = styled.div<DisabledProp>`
  background: url(${bunnyButt}) no-repeat center;
  height: 39px;
  filter: ${({ disabled }) => (disabled ? "grayscale(100%)" : "none")};
  position: absolute;
  width: 15px;
`;

export const BunnySlider = styled.div`
  position: absolute;
  left: 14px;
  width: calc(100% - 14px);
`;

export const StyledInput = styled.input<StyledInputProps>`
  cursor: ${getCursorStyle};
  height: 34px;
  position: relative;
  &::-webkit-slider-thumb {
    ${getBaseThumbStyles}
  }
  &::-moz-range-thumb {
    ${getBaseThumbStyles}
  }
  &::-ms-thumb {
    ${getBaseThumbStyles}
  }
`;

export const BarBackground = styled.div<DisabledProp>`
  background-color: ${({ theme, disabled }) => theme.colors[disabled ? "textDisabled" : "backgroundItem"]};
  height: 10px;
  position: absolute;
  top: 15px;
  width: 100%;
  border-radius: 4px;
`;

export const BarProgress = styled.div<DisabledProp>`
  background-color: ${({ theme }) => theme.colors.hover};
  filter: ${({ disabled }) => (disabled ? "grayscale(100%)" : "none")};
  height: 10px;
  position: absolute;
  top: 15px;
`;
