import { useTranslation } from "@pancakeswap/localization";
import { AtomBox, Box, Button, Flex, InjectedModalProps, ModalWrapper, Text } from "@pancakeswap/uikit";
import React, { useState } from "react";
import styled from "styled-components";

const StyledTitle = styled(Text)`
  font-family: 'Metuo', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  max-width: 330px;
  margin: auto;

`
const StyledImage = styled.img`
  --size: 180px;
  height: var(--size);
  min-width: calc(var(--size) * 157 / 180);
`
const StyledButton = styled(Button)`
  height: 44px;
`
const Span = styled.span`
  font-weight: 700;
`

export enum LoansView {
  AVAILABLE,
  BORROWING
}

interface LoansModalProps extends InjectedModalProps {
  initialView?: LoansView
}

const LoansModal: React.FC<React.PropsWithChildren<LoansModalProps>> = ({
  initialView = LoansView.AVAILABLE,
  onDismiss,

}) => {
  const { t } = useTranslation()
  const [view, setView] = useState(initialView)

  return (
    <ModalWrapper maxWidth="525px" m="auto">
      <AtomBox position="relative">
        <AtomBox
          display="flex"
          flexDirection="column"
          bg="backgroundAlt"
          py="32px"
          zIndex="modal"
          borderRadius="card"
        >
          <AtomBox px={[ "20px", "20px", "32px" ]}>
            <StyledTitle color="text" textAlign="center">
              {t('System does not have enough tokens')}
            </StyledTitle>
            <Flex alignItems="center" mt="20px">
              {view === LoansView.AVAILABLE && (
                <Box mr="40px">
                  <Text fontSize="14px" lineHeight="24px" mb="10px" color="textSubtle">
                    Sorry, the system does not have enough funds left to process your <Span>1000 U2U</Span> borrow request.
                  </Text>
                  <Text fontSize="14px" lineHeight="24px" mb="10px" color="textSubtle">
                    The system can lend you <Span>600 U2U</Span> token.
                  </Text>
                  <Text fontSize="14px" lineHeight="24px" color="textSubtle">
                    Click “<Span>Borrow 600 U2U</Span>” to proceed or “<Span>Cancel</Span>” to cancelled
                  </Text>
                </Box>
              )}
              {view === LoansView.BORROWING && (
                <Text fontSize="14px" lineHeight="24px" mr="40px" color="textSubtle">{t('Sorry, the system no longer has tokens to perform your transaction. Please come back another time to make the transaction.')}</Text>
              )}
              <StyledImage src="/images/loans-borrow.png" alt=""/>
            </Flex>
            <Box mt="24px">
              {view === LoansView.AVAILABLE && (
                <Flex>
                  <StyledButton
                    width="100%"
                    className="button-hover"
                    mr="8px"
                  >
                    {t('Borrow 600 U2U')}
                  </StyledButton>
                  <StyledButton
                    width="100%"
                    variant="silver"
                    className="button-hover"
                    ml="8px"
                    onClick={onDismiss}
                  >
                    {t('Cancel')}
                  </StyledButton>
                </Flex>
              )}
              {view === LoansView.BORROWING && (
                <StyledButton
                  width="100%"
                  className="button-hover"
                >
                  {t('OK! I understand')}
                </StyledButton>
              )}
            </Box>
          </AtomBox>
        </AtomBox>
      </AtomBox>
    </ModalWrapper>
  )
}

export default LoansModal