import { useTranslation } from "@pancakeswap/localization";
import { Currency, CurrencyAmount } from "@pancakeswap/sdk";
import { memo, useCallback } from "react";
import { styled } from "styled-components";

import { BalanceInput, Box, Button, Card, CardBody, Flex, QuestionHelper, RowBetween, Text } from "@pancakeswap/uikit";
import { CurrencyLogo } from "../components/CurrencyLogo";

type Props = UsdAmountInputProps & TokenAmountsDisplayProps;

export const DepositAmountInput = memo(function DepositAmountInput({
  value,
  max,
  onChange,
  amountA,
  amountB,
  currencyA,
  currencyB,
  maxLabel,
}: Props) {
  return (
    <>
      <Box mb="1em">
        <DepositUsdAmountInput value={value} max={max} onChange={onChange} maxLabel={maxLabel} />
      </Box>
      <TokenAmountsDisplay amountA={amountA} amountB={amountB} currencyA={currencyA} currencyB={currencyB} />
    </>
  );
});

const StyledBalanceInput = styled(BalanceInput)`
  padding: 0 16px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  text-transform: uppercase;
  border-radius: 2px;

  @media screen and (max-width: 575px) {
    font-size: 12px;
  }
`;

interface UsdAmountInputProps {
  value?: string;
  max?: string;
  onChange?: (val: string) => void;
  maxLabel?: string;
}

export const DepositUsdAmountInput = memo(function DepositUsdAmountInput({
  value = "",
  max = "",
  onChange = () => {
    // default
  },
  maxLabel,
}: UsdAmountInputProps) {
  const { t } = useTranslation();

  const onMax = useCallback(() => onChange(max), [max, onChange]);

  return (
    <>
      <Box mb="0.5em" width="100%">
        <StyledBalanceInput value={value} onUserInput={onChange} unit={<Text color="textSubtle">{t("USD")}</Text>} />
      </Box>
      <Flex>
        <Flex flex="3" mr="0.25em">
          <StyledButton className='button-hover' variant={value === "100" ? "hover" : "tertiary"} scale="xs" onClick={() => onChange("100")}>
            $100
          </StyledButton>
        </Flex>
        <Flex flex="3" mr="0.25em">
          <StyledButton className='button-hover' variant={value === "1000" ? "hover" : "tertiary"} scale="xs" onClick={() => onChange("1000")}>
            $1,000
          </StyledButton>
        </Flex>
        <Flex flex="4">
          <StyledButton className='button-hover' variant={value === max ? "hover" : "tertiary"} scale="xs" mr="0.25em" onClick={onMax}>
            {maxLabel || t("Max")}
          </StyledButton>
          <QuestionHelper
            text={t("Automatically fill in the maximum token amount according to your balance and position settings.")}
            placement="top"
          />
        </Flex>
      </Flex>
    </>
  );
});

interface TokenAmountsDisplayProps {
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  amountA?: CurrencyAmount<Currency>;
  amountB?: CurrencyAmount<Currency>;
}

const TokenDisplayRow = memo(function TokenDisplayRow({
  amount,
  currency,
}: {
  amount?: CurrencyAmount<Currency>;
  currency?: Currency | null;
}) {
  if (!currency) {
    return null;
  }

  return (
    <RowBetween>
      <Flex>
        <CurrencyLogo currency={currency} />
        <Text color="textSubtle" ml="0.25em">
          {currency.symbol}
        </Text>
      </Flex>
      <Text>{amount?.toExact() || "0"}</Text>
    </RowBetween>
  );
});

export const TokenAmountsDisplay = memo(function TokenAmountsDisplay({
  amountA,
  amountB,
  currencyA,
  currencyB,
}: TokenAmountsDisplayProps) {
  if (!currencyA && !currencyB) {
    return null;
  }

  return (
    <Card>
      <CardBody p="16px">
        <Box mb="0.5em">
          <TokenDisplayRow amount={amountA} currency={currencyA} />
        </Box>
        <TokenDisplayRow amount={amountB} currency={currencyB} />
      </CardBody>
    </Card>
  );
});
