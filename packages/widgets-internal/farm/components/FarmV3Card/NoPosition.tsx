import { useTranslation } from "@pancakeswap/localization";
import { Button, Flex, Text } from "@pancakeswap/uikit";
import { ReactNode } from "react";

interface NoPositionProps {
  inactive: boolean;
  account: string;
  hasNoPosition: boolean;
  boostedAction?: ReactNode;
  connectWalletButton: ReactNode;
  onAddLiquidityClick: () => void;
}

const NoPosition: React.FunctionComponent<React.PropsWithChildren<NoPositionProps>> = ({
  inactive,
  account,
  hasNoPosition,
  boostedAction,
  connectWalletButton,
  onAddLiquidityClick,
}) => {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column">
      {boostedAction && <>{boostedAction}</>}
      {account && hasNoPosition ? (
        <Flex flexDirection="column">
          <Text color="textSubtle" bold textTransform="uppercase" fontSize="12px" mb="8px">
            {t("no position found")}
          </Text>
          {!inactive && (
            <Button className="button-hover" width="100%" onClick={onAddLiquidityClick}>
              {t("Add Liquidity")}
            </Button>
          )}
        </Flex>
      ) : (
        <>{connectWalletButton}</>
      )}
    </Flex>
  );
};

export default NoPosition;
