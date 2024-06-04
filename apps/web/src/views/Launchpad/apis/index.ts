import { launchpadClients } from "utils/graphql"
import { Address } from "viem"
import { ICommittedItem, IHistoryTransaction, ILaunchpadDetail, ILaunchpadItem, IPagination } from "../types/LaunchpadType"

const BASE_LAUNCHPAD_URL = 'http://192.168.1.182:8080/api/v1'
export const fetchListLaunchpad = async (page: number) : Promise<{data: ILaunchpadItem[], status: boolean, pagination: IPagination}> => {
	// const response = await fetch(`${BASE_LAUNCHPAD_URL}/launchpad?page=${page}`)
	// const data = await response.json()
	return {
		"data": [
			{
				"tokenName": "SPHERE",
				"tokenLogo": "https://photos.pinksale.finance/file/pinksale-logo-upload/1716442763338-23dae22dd52e14e328bc295094257b29.gif",
				"projectName": "SPHERE fairlaunch",
				"shortDescription": "SPHERE - Cryptocurrency transfer ecosystem.",
				"projectImageThumbnail": "https://photos.pinksale.finance/file/pinksale-logo-upload/1716443513875-5295e191878b40d57b5b81df23de8e27.gif",
				"contractAddress": "0x2dDC5162ED02738Fdcb6C712B44f1b3f211eeBAb",
				"priceToken": 10,
				"totalRaise": 100000,
				"saleStart": 1716578183000,
				"saleEnd": 1717010183000,
				"status": "UPCOMING"
			},
			{
				"tokenName": "LION",
				"tokenLogo": "https://liontoken.io/wp-content/uploads/2024/05/photo_2024-05-02_13-19-55-1.jpg",
				"projectName": "LION Presale",
				"shortDescription": "Secure royal shares, witness $LION's birth, and join the legend!",
				"projectImageThumbnail": "https://pbs.twimg.com/profile_banners/1785390990116749313/1714951618/1500x500",
				"contractAddress": "0x3B3686DC902F25287Bf513C7cCCb5C4Bb38fD573",
				"priceToken": 5,
				"totalRaise": 50000,
				"saleStart": 1717212268213,
				"saleEnd": 1717860268213,
				"status": "ON_GOING"
			}
		],
		"status": true,
		"pagination": {
			"totalPages": 1,
			"totalRecords": 2,
			"page": 1,
			"size": 20
		}
	}
}

export const fetchLaunchpadDetail = async (_contract: string) : Promise<{data: ILaunchpadDetail, status: boolean}> => {
	// const response = await fetch(`${BASE_LAUNCHPAD_URL}/launchpad/${_contract}`)
	// const data = await response.json()
	return {
  "data": {
    "tokenName": "LION",
    "tokenSymbol": "LION",
    "tokenDecimals": 18,
    "totalSupply": 50000000,
    "tokenAddress": "0x0f308999C96caBdBD4755A183Ba2Bf1D21f0c25b",
    "tokenLogo": "https://liontoken.io/wp-content/uploads/2024/05/photo_2024-05-02_13-19-55-1.jpg",
    "projectName": "LION Presale",
    "description": "Secure royal shares, witness $LION's birth, and join the legend!\nExperience the majestic journey of the lion, where courage reigns.\n\n1st phase of presale starts, followed by 2nd phase.\nWe perform a manual listing at UniSwap.\n\n🦁$LION releases between June 18-20 on UniSwap.\n\n🦁Total supply: 50,000,000\n🦁TAX: 0%\n🦁Not mineable\n🦁LP will be burned\n🦁DEX: UniSwap\n\nStep into this captivating tale and secure your chance! ❤️\nLet the lion within you awaken!\nLET HIM ROAR!",
    "shortDescription": "Secure royal shares, witness $LION's birth, and join the legend!",
    "projectImageThumbnail": "https://pbs.twimg.com/profile_banners/1785390990116749313/1714951618/1500x500",
    "contractAddress": "0x3B3686DC902F25287Bf513C7cCCb5C4Bb38fD573",
    "priceToken": 5,
    "totalRaise": 50000,
    "totalSale": 5000000,
    "softCap": 60000,
    "snapshotTime": 1716579183000,
    "saleStart": 1717212268213,
    "saleEnd": 1717860268213,
    "status": "ON_GOING",
    "socials": [
      {
        "type": "WEBSITE",
        "link": "https://liontoken.io/"
      },
      {
        "type": "TWITTER",
        "link": "https://x.com/LIONTOKENKING"
      },
      {
        "type": "FACEBOOK",
        "link": "https://www.facebook.com/profile.php?id=61556342785355&mibextid=ZbWKwL"
      }
    ],
    "phases": [
      {
        "name": "Upcoming",
        "startTime": 1717212268213,
        "endTime": 1717212268213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x5EDEcE1Fc3A26A803B8573025fb54A711440D1fb",
        "type": "NONE"
      },
      {
        "name": "IDO Start",
        "startTime": 1717212268213,
        "endTime": 1717215868213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x5EDEcE1Fc3A26A803B8573025fb54A711440D1fb",
        "type": "NONE"
      },
      {
        "name": "IDO Tier 1",
        "startTime": 1717215868213,
        "endTime": 1717226668213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x5EDEcE1Fc3A26A803B8573025fb54A711440D1fb",
        "type": "TIER"
      },
      {
        "name": "IDO Tier 2",
        "startTime": 1717226668213,
        "endTime": 1717237468213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x566c65B2cdA5cF9CD9dD56B28b48D9CF8582A4E8",
        "type": "TIER"
      },
      {
        "name": "IDO Tier 3",
        "startTime": 1717237468213,
        "endTime": 1717248268213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x822891074Af82dEFcB6c9f6949707059b17d70C0",
        "type": "TIER"
      },
      {
        "name": "IDO Whitelist",
        "startTime": 1717248268213,
        "endTime": 1717259068213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x6Efc2F8a725A6EAA2ce7a16bDbb6c8db9579b05B",
        "type": "WHITELIST"
      },
      {
        "name": "IDO Community",
        "startTime": 1717259068213,
        "endTime": 1717269868213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x7A5Da6f87dBd6f46bC59046fa9B2e10E5590326e",
        "type": "COMMUNITY"
      },
      {
        "name": "Finished",
        "startTime": 1717269868213,
        "endTime": 1717280668213,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x5EDEcE1Fc3A26A803B8573025fb54A711440D1fb",
        "type": "NONE"
      }
    ]
  },
  "status": true
}
}

const LIST_COMMITTED = `
query listCommitted($user: String!, $launchpad: String!)  {
	userCommits(
		where: {user: $user, launchpadAddress: $launchpad, u2uAmount_gt: "0"}
	) {
		id
		u2uAmount
		roundType
		roundAddress
		startCancel
    endCancel
	}
}
`

const HISTORY_TRANSACTION = `
query listTransaction($user: String!, $launchpad: String!, $skip: Int)  {
	transactionHistories(
		where: {user: $user, launchpadAddress: $launchpad}, skip: $skip , first: 10
	) {
    processTime
		hash
    u2uAmount
    transactionType
    tokenAmount
    roundType
	}
}
`

export async function fetchListCommitted(user: Address, launchpad: Address): Promise<{
  data: ICommittedItem[]
}> {
  try {
    const data = await launchpadClients.request(LIST_COMMITTED, {
      client: launchpadClients,
      user: user?.toLowerCase(),
      launchpad:  launchpad?.toLowerCase(),
      fetchPolicy: 'cache-first',
    })

    return {
      data: data.userCommits
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
    }
  }
}

export async function fetchListHistory(user: Address, launchpad: Address, page: number): Promise<{
  data: IHistoryTransaction[]
}> {
  try {
    const data = await launchpadClients.request(HISTORY_TRANSACTION, {
      client: launchpadClients,
      user: user?.toLowerCase(),
      launchpad:  launchpad?.toLowerCase(),
			skip: (page - 1) * 10,
      fetchPolicy: 'cache-first',
    })

    return {
      data: data.transactionHistories
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
    }
  }
}