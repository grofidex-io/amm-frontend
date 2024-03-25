import React from "react";
import styled, { keyframes } from "styled-components";
import { Box } from "../Box";
import { SpinnerProps } from "./types";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`;
const AnimatedImg = styled.div`
  animation: ${bounce} 500ms linear infinite 1700ms;
  padding-top: 30px;
`;

const AnimatedShadow = styled.div`
  animation: ${pulse} 500ms linear infinite;
  width: 50px;
  height: 5px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
`;

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 50 }) => {
  return (
    <Box>
      <AnimatedImg>
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 40 40" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.6252 3.71618L19.1838 0.592719V39.4073L4 30.6604V8.15383L9.5764 4.94124L9.55899 11.3558V27.4584L13.6252 29.8009V3.71618Z"
            fill="#8EF102"
          />
          <mask id="mask0_2012_998" maskUnits="userSpaceOnUse" x="21" y="0" width="17" height="40">
            <path
              d="M27.4878 30.3936V9.60641L31.554 11.9485V28.0511L27.4878 30.3936ZM21.9292 0V40L37.113 31.2535V8.74652L21.9292 0Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_2012_998)">
            <path d="M37.113 0H21.9292V40H37.113V0Z" fill="#8EF102" />
          </g>
        </svg>
      </AnimatedImg>
      <AnimatedShadow />
    </Box>
  );
};

export default Spinner;
