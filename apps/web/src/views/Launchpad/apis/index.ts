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
				"contractAddress": "0x794236E6594ff178bC921E0E77c40fa1aA36F0Bc",
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
    "tokenAddress": "0x8d41937345Fd19075e6625d6872D9a29B8331AAd",
    "tokenLogo": "https://liontoken.io/wp-content/uploads/2024/05/photo_2024-05-02_13-19-55-1.jpg",
    "projectName": "LION Presale",
    "description": "Secure royal shares, witness $LION's birth, and join the legend!\nExperience the majestic journey of the lion, where courage reigns.\n\n1st phase of presale starts, followed by 2nd phase.\nWe perform a manual listing at UniSwap.\n\n🦁$LION releases between June 18-20 on UniSwap.\n\n🦁Total supply: 50,000,000\n🦁TAX: 0%\n🦁Not mineable\n🦁LP will be burned\n🦁DEX: UniSwap\n\nStep into this captivating tale and secure your chance! ❤️\nLet the lion within you awaken!\nLET HIM ROAR!",
    "shortDescription": "Secure royal shares, witness $LION's birth, and join the legend!",
    "projectImageThumbnail": "https://pbs.twimg.com/profile_banners/1785390990116749313/1714951618/1500x500",
    "contractAddress": "0x794236E6594ff178bC921E0E77c40fa1aA36F0Bc",
    "priceToken": 5,
    "totalRaise": 50000,
    "totalSale": 5000000,
    "softCap": 60000,
    "snapshotTime": 1716579183000,
    "saleStart": 1717488000000,
    "saleEnd": 1717560000000,
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
        "name": "IDO Tier 1",
        "startTime": 1717488000000,
        "endTime": 1717490400000,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x6377747d02749436b3174B154B8D2846EBAB0254",
        "type": "NONE"
      },
      {
        "name": "IDO Tier 2",
        "startTime": 1717491600000,
        "endTime": 1717494000000,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x8Fb02b997B8f51fa197Db6058D98F792797e4EeC",
        "type": "NONE"
      },
      {
        "name": "IDO Whitelist",
        "startTime": 1717495200000,
        "endTime": 1717497600000,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x016E24788aBF93877D40b22eF56681df02F27F34",
        "type": "WHITELIST"
      },
      {
        "name": "IDO Community",
        "startTime": 1717556400000,
        "endTime": 1717558800000,
        "isActive": false,
        "imageUrl": null,
        "contractAddress": "0x56e7165d8D9597b13F7586E5Ff6DbD06ee4e33c2",
				"type": "COMMUNITY"
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