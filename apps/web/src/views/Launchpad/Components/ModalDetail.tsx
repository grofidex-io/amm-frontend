import { useTranslation } from "@pancakeswap/localization";
import { AutoColumn, Box, Button, Modal, Text, useToast } from "@pancakeswap/uikit";
import { formatNumber } from "@pancakeswap/utils/formatBalance";
import BigNumber from "bignumber.js";
import { ToastDescriptionWithTx } from "components/Toast";
import { formatEther } from "ethers/lib/utils";
import { useActiveChainId } from "hooks/useActiveChainId";
import useCatchTxError from "hooks/useCatchTxError";
import forEach from "lodash/forEach";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getLaunchpadContract, getLaunchpadManagerContract } from "utils/contractHelpers";
import { Break, TableWrapper } from 'views/Info/components/InfoTables/shared';
import { useWalletClient } from "wagmi";
import { PHASES_TYPE } from "../helpers";
import { useFetchListCommit } from "../hooks/useFetchListCommit";
import { StyledButton } from "../styles";



const StyledModal = styled(Modal)`
  width: 800px;
  @media screen and (max-width: 767px) {
    width: 100%;
  }
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



export default function ModalDetail({
	tokenName,
	saleEnd,
	account,
	launchpad,
	listPhase,
	onDismiss,
	getTotalUserCommitted,
	rate,
	isSortCap
}) {
	const { data: signer } = useWalletClient()
	const { chainId } = useActiveChainId()
  const { fetchWithCatchTxError } = useCatchTxError()
	const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation();
	const { data : list, refetch } = useFetchListCommit(account, launchpad)
	const [giveBackAmount, setGiveBackAmount] = useState<number | string>(0)
	const launchpadContract = useRef<any>()

	const getGiveBack = async () => {
		try {
			if(launchpadContract.current.account) { 
				const res = await launchpadContract.current.read.getGiveBack([account])
				setGiveBackAmount(formatEther(res))
			}
		}catch{
			//
		}
	}




	const handleCancel = async (item) => {
		const _contract = getLaunchpadContract(item.roundAddress, signer ?? undefined, chainId)
		try {
			const res = await fetchWithCatchTxError(() => _contract.write.cancelCommit())
			if(res?.status) {
				toastSuccess(
					t('Success!'),
					<ToastDescriptionWithTx txHash={res.transactionHash}>
						Cancel successfully
					</ToastDescriptionWithTx>,
				)
			}
		} catch(error: any) {
			const errorDescription = `${error.message} - ${error.data?.message}`
			toastError(t('Failed'), errorDescription)
		}
	}

	const handleClaim = async () => {
		const _contract = getLaunchpadManagerContract(launchpad, signer ?? undefined, chainId)
		try {
			const res = await fetchWithCatchTxError(() => isSortCap ? _contract.write.claimToken() : _contract.write.withdrawSoftCap())
			if(res?.status) {
				refetch()
				getGiveBack()
				getTotalUserCommitted()
				toastSuccess(
					t('Success!'),
					<ToastDescriptionWithTx txHash={res.transactionHash}>
						Claim Token successfully
					</ToastDescriptionWithTx>,
				)
			}
		} catch(error: any) {
			const errorDescription = `${error.message} - ${error.data?.message}`
			toastError(t('Failed'), errorDescription)
		}
	}


	useEffect(() => {
		if(list && list?.length > 0 && signer) {
			forEach(list, (item) => {
				if(item.roundType === PHASES_TYPE.TIER) {
					launchpadContract.current = getLaunchpadContract(item.roundAddress, signer, chainId)
				}
			})
			if(launchpadContract.current.account) {
				getGiveBack()
			}
		}
	}, [list, signer])


	const endTime = saleEnd < Date.now()

	const enableClaim = BigNumber(giveBackAmount).gt(0) || endTime

  return (
      <StyledModal title={t('Your Committed Detail')} onDismiss={onDismiss}  >
          <TableWrapper>
            <LayoutScroll>
              <ResponsiveGrid>
                <Text color="textSubtle" textAlign="center">
                  {t('ROUND')}
                </Text>
                <Text color="textSubtle" textAlign="center">
                  {t('U2U COMMITTED')}
                </Text>
								<Text color="textSubtle" textAlign="center">
                  {t('U2U GIVE BACK')}
                </Text>
                <Text color="textSubtle" textAlign="center">
                  {t('TOKEN')}
                </Text>
                <Text color="textSubtle" textAlign="center">
                  {t('ACTION')}
                </Text>
              </ResponsiveGrid>
              <AutoColumn gap="16px">
                <Break/>
                {list?.map(item => (
                  <>
                    <ResponsiveGrid key={item.id}>
                      <StyledText>{listPhase[item.roundAddress.toLowerCase()]?.name}</StyledText>
                      <StyledText>{formatNumber(BigNumber(formatEther(item.u2uAmount)).toNumber(), 0, 6)} U2U</StyledText>
                      <StyledText>{item.roundType === PHASES_TYPE.TIER && formatNumber(Number(giveBackAmount), 0, 6)}</StyledText>
											<StyledText>{ endTime ? `${formatNumber(BigNumber(formatEther(item.u2uAmount)).toNumber() * rate, 0, 6)} ${tokenName}`: null } </StyledText>
                      <Box style={{ textAlign: 'center' }}>
												{(item.startCancel * 1000) < Date.now() && (item.endCancel * 1000) > Date.now() && (
                        	<StyledButtonCancel variant="cancel" onClick={() => handleCancel(item)}>{t('Cancel')}</StyledButtonCancel>
												)}
                      </Box>
                    </ResponsiveGrid>
                    <Break />
                  </>
                ))}
              </AutoColumn>
            </LayoutScroll>
          </TableWrapper>
        <Box mt="16px" style={{ textAlign: 'center' }}>
          <StyledButton disabled={!enableClaim} className="button-hover" width="200px" onClick={handleClaim}>{t('Claim Now')}</StyledButton>
        </Box>
      </StyledModal>
  )
}
