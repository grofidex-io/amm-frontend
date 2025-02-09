import { vars } from "../../css/vars.css";
import { darkColors, lightColors } from "../../theme/colors";
import { TooltipTheme } from "./types";

export const light: TooltipTheme = {
  background: lightColors.backgroundItem,
  text: lightColors.text,
  boxShadow: vars.shadows.tooltip,
};

export const dark: TooltipTheme = {
  background: darkColors.backgroundItem,
  text: darkColors.text,
  boxShadow: vars.shadows.tooltip,
};
