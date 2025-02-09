import { ColorProps } from "styled-system";

export interface TabMenuProps {
  activeIndex?: number;
  onItemClick?: (index: number) => void;
  children: React.ReactElement[];
  fullWidth?: boolean;
  customWidth?: boolean;
  gap?: string;
  isColorInverse?: boolean;
  isShowBorderBottom?: boolean;
}
export interface TabProps extends ColorProps {
  isActive?: boolean;
  isCustom?: boolean;
  onClick?: () => void;
  scale?: "md" | "lg";
}
