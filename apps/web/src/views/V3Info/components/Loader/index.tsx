import { Box } from '@pancakeswap/uikit'
import { css, keyframes, styled } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledSVG = styled.svg<{ size: string; stroke?: string }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
  path {
    stroke: ${({ stroke, theme }) => stroke ?? theme.colors.primary};
  }
`

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function Loader({
  size = '16px',
  stroke,
  ...rest
}: {
  size?: string
  stroke?: string
  [k: string]: any
}) {
  return (
    <StyledSVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" size={size} stroke={stroke} {...rest}>
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 9.27455 20.9097 6.80375 19.1414 5"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledSVG>
  )
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-20%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`

const Wrapper = styled.div<{ fill: number; height?: string }>`
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, fill }) => (fill ? 'black' : theme.colors.background)};
  height: 100%;
  width: 100%;
  ${(props) =>
    props.fill && !props.height
      ? css`
          height: 100vh;
        `
      : css`
          height: 180px;
        `}
`

const AnimatedImg = styled.div`
  animation: ${bounce} 500ms linear infinite 1700ms;
  padding-top: 30px;
`

const AnimatedShadow = styled.div`
  animation: ${pulse} 500ms linear infinite;
  width: 50px;
  height: 5px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
`

export const LocalLoader = ({ fill }: { fill: boolean }) => {
  return (
    <Wrapper fill={fill ? 1 : 0}>
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
    </Wrapper>
  )
}

const loadingAnimation = keyframes`
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

export const LoadingRows = styled.div`
  display: grid;
  min-width: 75%;
  max-width: 100%;
  grid-column-gap: 0.5em;
  grid-row-gap: 0.8em;
  grid-template-columns: repeat(1, 1fr);
  & > div {
    animation: ${loadingAnimation} 1.5s infinite;
    animation-fill-mode: both;
    background: linear-gradient(
      to left,
      ${({ theme }) => theme.colors.background} 25%,
      ${({ theme }) => theme.colors.backgroundAlt} 50%,
      ${({ theme }) => theme.colors.backgroundAlt2} 75%
    );
    background-size: 400%;
    border-radius: 12px;
    height: 2.4em;
    will-change: background-position;
  }
  & > div:nth-child(4n + 1) {
    grid-column: 1 / 3;
  }
  & > div:nth-child(4n) {
    grid-column: 3 / 4;
    margin-bottom: 2em;
  }
`
