import throttle from "lodash/throttle";
import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { Button } from "../Button";
import { ArrowUpIcon } from "../Svg";

const FixedContainer = styled.div`
  position: fixed;
  right: 18px;
  bottom: calc(110px + env(safe-area-inset-bottom));
`;

const ScrollToTopButtonV2 = () => {
  const [visible, setVisible] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 500) {
        setVisible(true);
      } else if (scrolled <= 500) {
        setVisible(false);
      }
    };

    const throttledToggleVisible = throttle(toggleVisible, 200);

    window.addEventListener("scroll", throttledToggleVisible);

    return () => window.removeEventListener("scroll", throttledToggleVisible);
  }, []);

  return (
    <FixedContainer style={{ display: visible ? "inline" : "none" }}>
      <Button
        width={["40px", "40px", "44px", "44px", "48px"]}
        height={["40px", "40px", "44px", "44px", "48px"]}
        p="0"
        endIcon={<ArrowUpIcon color="invertedContrast" style={{ marginLeft: 0 }} />}
        onClick={scrollToTop}
        className="button-hover"
      />
    </FixedContainer>
  );
};

export default ScrollToTopButtonV2;
