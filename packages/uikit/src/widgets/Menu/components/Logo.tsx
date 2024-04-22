import React, { useContext } from "react";
import { keyframes, styled } from "styled-components";
import Flex from "../../../components/Box/Flex";
import { LogoIcon, LogoWithTextIcon } from "../../../components/Svg";
import { MenuContext } from "../context";

interface Props {
  href: string;
}

const blink = keyframes`
  0%,  100% { transform: scaleY(1); }
  50% { transform:  scaleY(0.1); }
`;

const StyledLink = styled("a")`
  display: flex;
  .mobile-icon {
    width: 36px;
    height: 36px;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: none;
    }
  }
  .desktop-icon {
    width: 160px;
    display: none;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: block;
    }
  }
  .eye {
    animation-delay: 20ms;
  }
  &:hover {
    .eye {
      transform-origin: center 60%;
      animation-name: ${blink};
      animation-duration: 350ms;
      animation-iteration-count: 1;
    }
  }
`;

const Logo: React.FC<React.PropsWithChildren<Props>> = ({ href }) => {
  const { linkComponent } = useContext(MenuContext);
  const isAbsoluteUrl = href.startsWith("http");
  const innerLogo = (
    <>
      <LogoIcon className="mobile-icon" />
      <LogoWithTextIcon className="desktop-icon" />
    </>
  );

  return (
    <Flex alignItems="center">
      {isAbsoluteUrl ? (
        <StyledLink as="a" href={href} aria-label="GroFi Dex page">
          {innerLogo}
        </StyledLink>
      ) : (
        <StyledLink href={href} as={linkComponent} aria-label="GroFi Dex page">
          {innerLogo}
        </StyledLink>
      )}
    </Flex>
  );
};

export default React.memo(Logo);
