import { ElementType, ReactNode } from "react";
import { BorderRadiusProps, LayoutProps, ResponsiveValue, SpaceProps } from "styled-system";
import type { PolymorphicComponentProps } from "../../util/polymorphic";

export const scales = {
  MD: "md",
  SM: "sm",
  XS: "xs",
} as const;

export const variants = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
  TEXT: "text",
  DANGER: "danger",
  SUBTLE: "subtle",
  SUCCESS: "success",
  LIGHT: "light",
  BUBBLEGUM: "bubblegum",
  SILVER: "silver",
  HOVER: "hover",
  CANCEL: "cancel",
} as const;

export type Scale = (typeof scales)[keyof typeof scales];
export type Variant = (typeof variants)[keyof typeof variants];

export interface BaseButtonProps extends LayoutProps, SpaceProps, BorderRadiusProps {
  as?: "a" | "button" | ElementType;
  external?: boolean;
  isLoading?: boolean;
  scale?: ResponsiveValue<Scale>;
  variant?: Variant;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  decorator?: {
    backgroundColor?: string;
    color?: string;
    text: string;
    direction?: "left" | "right";
  };
}

export type ButtonProps<P extends ElementType = "button" | "a"> = PolymorphicComponentProps<P, BaseButtonProps>;
