import { useTranslation } from "@pancakeswap/localization";
import { Box, InfoFilledIcon, LinkExternal, Placement, Text, TooltipText, useTooltip } from "@pancakeswap/uikit";
import { isMobile } from "react-device-detect";
import styled from "styled-components";

const InlineLink = styled(LinkExternal)`
  display: inline-flex;
  margin-left: 4px;
`;

type MerklNoticeContentProps = {
  linkColor?: string;
  merklLink: string;
  hasFarm?: boolean;
};

export const MerklNoticeContent: React.FC<MerklNoticeContentProps> = ({
  linkColor = "primary",
  merklLink,
  hasFarm,
}) => {
  const { t } = useTranslation();

  if (hasFarm) {
    return (
      <>
        <Box>
          <Text display="inline" color="currentColor">
            {t("Incentives can be earned on either Merkl or Farm but NOT both")}
            <br />
            <br />
            <p>
              {t(
                "To earn Merkl rewards, continue seeding liquidity on GroFi DEX but DO NOT stake your LP token in the Farm. Claim your rewards directly on "
              )}
              <InlineLink color={linkColor} external display="inline" href={merklLink}>
                {t("Merkl")}
              </InlineLink>
            </p>
            <br />
            {t("To earn Farm rewards, continue seeding liquidity on GroFi DEX and stake your LP token in the Farm.")}
          </Text>
        </Box>
      </>
    );
  }
  return (
    <>
      <Box>
        <Text display="inline" color="currentColor">
          <p>
            {t("Incentives have moved to")}
            <InlineLink color={linkColor} external display="inline" href={merklLink}>
              {t("Merkl")}
            </InlineLink>
          </p>
          <br />
          {t(
            "To earn Merkl rewards, continue seeding liquidity on GroFi DEX, but DO NOT stake your LP token in the Farm. Otherwise, you will not accrue rewards."
          )}
        </Text>
      </Box>
    </>
  );
};

type MerklNoticeProps = {
  // warning icon width/height px
  size?: string;
  placement?: Placement;
  tooltipOffset?: [number, number];
  merklLink: string;
  hasFarm?: boolean;
};

const MerklNotice: React.FC<MerklNoticeProps> = ({
  size = "20px",
  placement = "top-start",
  tooltipOffset = [-20, 10],
  merklLink,
  hasFarm,
}) => {
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    <MerklNoticeContent merklLink={merklLink} hasFarm={hasFarm} />,
    {
      placement,
      tooltipOffset,
      trigger: isMobile ? "focus" : "hover",
    }
  );
  return (
    <>
      <TooltipText ref={targetRef} display="inline">
        <Text lineHeight={0}>
          <InfoFilledIcon color="#6532CD" width={size} height={size} />
        </Text>
      </TooltipText>
      {tooltipVisible ? tooltip : null}
    </>
  );
};

export default {
  WithTooltip: MerklNotice,
  Content: MerklNoticeContent,
};
