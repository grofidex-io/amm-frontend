import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      {...props}
      viewBox="0 0 34 41"
      fill="none"
    >
    <mask id="mask0_2001_654" maskUnits="userSpaceOnUse" x="18" y="0" width="16" height="41">
    <path d="M24.1808 31.1842V10.3993L28.2466 12.7412V28.842L24.1808 31.1842ZM18.6228 0.793944V40.7896L33.8049 32.044V9.5395L18.6228 0.793944Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_2001_654)">
    <path d="M33.8049 0.793944H18.6228V40.7896H33.8049V0.793944Z" fill="#8EF102"/>
    </g>
    <path d="M5.99633 12.7374V28.8399L10.0657 31.184V20.5011L15.6228 23.7141V40.7917L0.439209 32.0466V9.53687L15.6103 0.791748H15.6228V7.199L10.0657 10.3932L8.703 11.1809L5.99633 12.7374Z" fill="#8EF102"/>
    </Svg>
  );
};

export default Icon;
