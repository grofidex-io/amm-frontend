import { useTranslation } from "@pancakeswap/localization";
import { AutoColumn, Box, Button, Modal, ModalV2, Text } from "@pancakeswap/uikit";
import styled from "styled-components";
import { Break, TableWrapper } from 'views/Info/components/InfoTables/shared';
import { StyledButton } from "../styles";



const StyledModal = styled(Modal)`
  width: 770px;
`
const Wrapper = styled.div`
  width: 100%;
`
const LayoutScroll = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-x: auto;
`
const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: repeat(5, 1fr);
  padding: 0 24px;
  > * {
    min-width: 120px;
    &:nth-child(4) {
      min-width: 123px;
    }
  }

`
const StyledText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`
const StyledButtonCancel = styled(Button)`
  height: 32px;
  font-size: 12px;
  font-weight: 500;
`

const data = [
  { round: 'Tier 1', committed: '30.0000 U2U', giveBack: '12.0000 U2U', tokenx: '1,800.0000 TOKENX' },
  { round: 'Apply Whitelist', committed: '10.0000 U2U', giveBack: '10.0000 U2U', tokenx: 'Calculating' },
  { round: 'Community', committed: '0.0000 U2U', giveBack: 'Calculating', tokenx: 'Calculating' },
]

export default function ModalDetail({
  isOpen,
  onDismiss,
  closeOnOverlayClick
}) {

  const { t } = useTranslation();

  return (
    <ModalV2 onDismiss={onDismiss} isOpen={isOpen} closeOnOverlayClick={closeOnOverlayClick}>
      <StyledModal title={t('Your Committed Detail')}>
        <Wrapper>
          <TableWrapper>
            <LayoutScroll>
              <ResponsiveGrid>
                <Text color="textSubtle" textAlign="center">
                  {t('Hash')}
                </Text>
                <Text color="textSubtle" textAlign="center">
                  {t('Type')}
                </Text>
                <Text color="textSubtle" textAlign="center">
                  {t('Token')}
                </Text>
                <Text color="textSubtle" textAlign="center">
                  {t('Time')}
                </Text>
                <Text color="textSubtle" textAlign="center">
                  {t('Action')}
                </Text>
              </ResponsiveGrid>
              <AutoColumn gap="16px">
                <Break/>
                {data?.map(item => (
                  <>
                    <ResponsiveGrid>
                      <StyledText>{item.round}</StyledText>
                      <StyledText>{item.committed}</StyledText>
                      <StyledText>{item.giveBack}</StyledText>
                      <StyledText>{item.tokenx}</StyledText>
                      <Box style={{ textAlign: 'center' }}>
                        <StyledButtonCancel variant="cancel">{t('Cancel')}</StyledButtonCancel>
                      </Box>
                    </ResponsiveGrid>
                    <Break />
                  </>
                ))}
              </AutoColumn>
            </LayoutScroll>
          </TableWrapper>
        </Wrapper>
        <Box mt="16px" style={{ textAlign: 'center' }}>
          <StyledButton className="button-hover" width="200px">{t('Claim Now')}</StyledButton>
        </Box>
      </StyledModal>
    </ModalV2>
  )
}
