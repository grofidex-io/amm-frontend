import { useTranslation } from "@pancakeswap/localization";
import { Balance, Button, Heading, Skeleton, Text, TooltipText, useTooltip } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";

import styled from "styled-components";
import { FARMS_SMALL_AMOUNT_THRESHOLD } from "../../../constants";
import { ActionContainer, ActionContent, ActionTitles } from "./styles";

const StyledButton = styled(Button)`
  @media screen and (max-width: 575px) {
    height: 40px;
  }
`

export interface HarvestActionProps {
  earnings: BigNumber;
  earningsBusd: number;
  displayBalance: string | JSX.Element;
  pendingTx: boolean;
  userDataReady: boolean;
  disabled: boolean;
  proxyCakeBalance?: number;
  handleHarvest: () => void;
}

const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  earnings,
  earningsBusd,
  displayBalance,
  pendingTx,
  userDataReady,
  proxyCakeBalance,
  disabled,
  handleHarvest,
}) => {
  const { t } = useTranslation();

  const toolTipBalance = !userDataReady ? (
    <Skeleton width={60} />
  ) : earnings.isGreaterThan(FARMS_SMALL_AMOUNT_THRESHOLD) ? (
    earnings.toFixed(5, BigNumber.ROUND_DOWN)
  ) : (
    `< 0.00001`
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    `${toolTipBalance} ${t(
      `U2U has been harvested to the farm booster contract and will be automatically sent to your wallet upon the next harvest.`
    )}`,
    {
      placement: "bottom",
    }
  );

  return (
    <ActionContainer style={{ minHeight: 124.5 }}>
      <ActionTitles>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          U2U
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t("Earned")}
        </Text>
      </ActionTitles>
      <ActionContent>
        <div>
          {proxyCakeBalance ? (
            <>
              <TooltipText ref={targetRef} decorationColor="secondary">
                <Heading>{displayBalance}</Heading>
              </TooltipText>
              {tooltipVisible && tooltip}
            </>
          ) : (
            <Heading>{displayBalance}</Heading>
          )}
          {earningsBusd > 0 && (
            <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
          )}
        </div>
        <StyledButton ml="4px" disabled={disabled} onClick={handleHarvest}>
          {pendingTx ? t("Harvesting") : t("Harvest")}
        </StyledButton>
      </ActionContent>
    </ActionContainer>
  );
};

export default HarvestAction;
