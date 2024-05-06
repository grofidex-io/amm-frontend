import { Flex, Text } from "@pancakeswap/uikit"
import styled from "styled-components"

const StyledFlex = styled(Flex)`
  display: flex !important;
`
const StyledImage = styled.svg`
  --size: 120px;
  width: var(--size);
  height: var(--size);
  @media screen and (max-width: 991px) {
    --size: 100px;
  }
  @media screen and (max-width: 424px) {
    --size: 80px;
  }
`

const NoData = () => {
  return (
    <StyledFlex mt={["60px", "60px", "80px"]} mb="60px" flexDirection="column" alignItems="center" justifyContent="center">
      <StyledImage viewBox="0 0 126 126" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_1193_6672)">
        <circle cx="62" cy="62" r="61" stroke="black" stroke-width="2" shape-rendering="crispEdges"/>
        </g>
        <circle opacity="0.2" cx="62" cy="62" r="61" fill="#E1FABB" stroke="black" stroke-width="2"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M62.0013 57.1928L58.9591 52.719C58.6685 52.2915 58.0854 52.18 57.6569 52.4706C57.2294 52.7622 57.1179 53.3453 57.4085 53.7737L60.5238 58.3553L43.6329 63.8537L39.8163 58.194C41.9716 57.4937 49.4951 55.0487 49.4951 55.0487C49.9872 54.8893 50.2572 54.3597 50.0969 53.8675C49.9376 53.3753 49.4079 53.1062 48.9157 53.2656C48.9157 53.2656 41.3922 55.7106 39.2369 56.4109C38.6763 56.5928 38.2347 57.0268 38.0435 57.5837C37.8513 58.1397 37.9319 58.7547 38.261 59.2422L42.1207 64.9637L37.7163 71.4934C37.3872 71.9818 37.3057 72.5959 37.4979 73.1528C37.6891 73.7087 38.1316 74.1437 38.6913 74.3256L42.3138 75.5022V82.3187C42.3138 83.5609 43.1285 84.6559 44.3182 85.0122C48.0851 86.1428 58.6816 89.3218 61.1932 90.0747C61.7201 90.2331 62.2826 90.2331 62.8094 90.0747C65.321 89.3218 75.9176 86.1428 79.6844 85.0122C80.8741 84.6559 81.6888 83.5609 81.6888 82.3187V75.5022L85.3113 74.3256C85.871 74.1437 86.3135 73.7087 86.5047 73.1528C86.6969 72.5959 86.6154 71.9818 86.2863 71.4934L81.8819 64.9637L85.7416 59.2422C86.0707 58.7547 86.1513 58.1397 85.9591 57.5837C85.7679 57.0268 85.3263 56.5928 84.7657 56.4109L67.8944 50.9284C67.1013 50.6715 66.2332 50.9678 65.7644 51.6578L62.0013 57.1928ZM61.9854 72.7412L57.6926 79.075C57.2247 79.7668 56.3557 80.065 55.5616 79.8072L44.1888 76.1115V82.3187C44.1888 82.7331 44.4607 83.0978 44.8572 83.2169L61.7322 88.2794C61.8016 88.3 61.8738 88.3131 61.946 88.3168C61.8832 85.404 61.9526 76.495 61.9854 72.7412ZM43.5579 73.9347L56.141 78.0231L60.5257 71.5543L43.6338 66.0737L39.2707 72.5415L43.5232 73.9234C43.5354 73.9272 43.5466 73.9309 43.5579 73.9347ZM80.4794 73.9234L84.7319 72.5415L80.3688 66.0737L63.4769 71.5543L67.8616 78.0231L80.4447 73.9347C80.456 73.9309 80.4672 73.9272 80.4794 73.9234ZM62.0013 70.0619L77.7185 64.9618L62.0013 59.8459V70.0619ZM84.1863 58.194L80.3697 63.8537L63.4788 58.3553L67.3151 52.7125L84.1863 58.194ZM55.3132 58.6722C55.0347 58.2943 54.7994 57.9147 54.6063 57.535C54.3719 57.0737 53.8066 56.89 53.3454 57.1243C52.8841 57.3587 52.7004 57.924 52.9347 58.3853C53.1729 58.8522 53.4616 59.32 53.8038 59.784C54.1104 60.2003 54.6972 60.2893 55.1144 59.9828C55.5307 59.6753 55.6197 59.0884 55.3132 58.6722ZM53.9426 54.8462C53.9519 54.4684 54.0072 54.1018 54.1085 53.7503C54.251 53.2534 53.9632 52.7331 53.4654 52.5906C52.9685 52.4481 52.4482 52.7359 52.3057 53.2337C52.1622 53.7362 52.0816 54.2603 52.0676 54.7993C52.0554 55.3168 52.4641 55.7472 52.9816 55.7593C53.4991 55.7725 53.9294 55.3637 53.9426 54.8462ZM55.3844 51.715C55.6254 51.4918 55.8954 51.2856 56.1907 51.099C56.6285 50.8225 56.7597 50.2431 56.4841 49.8062C56.2076 49.3684 55.6282 49.2372 55.1904 49.5128C54.7938 49.7631 54.4338 50.0397 54.1104 50.3397C53.7307 50.6912 53.7082 51.2847 54.0597 51.6643C54.4113 52.044 55.0047 52.0665 55.3844 51.715ZM58.871 50.0978C59.3426 50.0106 59.8422 49.9543 60.3691 49.9328C60.8866 49.9103 61.2879 49.4725 61.2663 48.9559C61.2447 48.4393 60.8069 48.0372 60.2894 48.0587C59.6707 48.085 59.0838 48.1515 58.5297 48.2537C58.0216 48.3484 57.6841 48.8378 57.7788 49.3459C57.8726 49.855 58.3619 50.1915 58.871 50.0978ZM63.7572 50.0425C64.5569 50.0518 65.3013 50.0237 65.9922 49.9628C66.5079 49.9168 66.8894 49.4612 66.8435 48.9456C66.7976 48.4309 66.3419 48.0493 65.8263 48.0953C65.1935 48.1506 64.5119 48.1768 63.7788 48.1675C63.2613 48.1618 62.8366 48.5772 62.831 49.0937C62.8244 49.6112 63.2397 50.0368 63.7572 50.0425ZM69.0738 49.3881C70.0019 49.104 70.7857 48.7403 71.4419 48.3231C71.8779 48.0447 72.0072 47.4653 71.7288 47.0284C71.4513 46.5925 70.871 46.4631 70.4341 46.7415C69.9063 47.0772 69.2735 47.3659 68.5254 47.5947C68.0313 47.7465 67.7519 48.2706 67.9038 48.7656C68.0547 49.2606 68.5797 49.539 69.0738 49.3881ZM73.8457 45.699C74.2882 44.784 74.4579 43.8165 74.4147 42.8837C74.3904 42.3662 73.9507 41.9668 73.4341 41.9912C72.9176 42.0156 72.5172 42.4543 72.5416 42.9709C72.5716 43.6047 72.4572 44.2618 72.1572 44.8834C71.9322 45.3493 72.1272 45.9109 72.5932 46.1359C73.0591 46.3609 73.6207 46.165 73.8457 45.699ZM61.0404 37.7762C61.6235 35.0425 63.9991 33.7628 65.6444 33.8078C67.2869 33.8528 68.201 35.2187 65.8751 37.7762H67.1941C67.7116 37.7762 68.1316 38.1962 68.1316 38.7137C68.1316 39.2312 67.7116 39.6512 67.1941 39.6512H65.8929C68.1963 42.1965 67.2822 43.555 65.6444 43.6009C64.0029 43.6459 61.6338 42.3718 61.0441 39.6512H60.9166C60.4001 39.6512 59.9791 39.2312 59.9791 38.7137C59.9791 38.1962 60.4001 37.7762 60.9166 37.7762H61.0404ZM73.2485 39.5687C72.5651 38.6453 71.6379 38.0022 70.6272 37.795C70.1201 37.6918 69.6241 38.0181 69.5201 38.5253C69.4169 39.0325 69.7441 39.5284 70.2504 39.6325C70.8335 39.7515 71.3472 40.1518 71.7419 40.6853C72.0504 41.1006 72.6382 41.1878 73.0535 40.8803C73.4697 40.5718 73.5569 39.984 73.2485 39.5687Z" fill="#69CF00"/>
        <defs>
        <filter id="filter0_d_1193_6672" x="0" y="0" width="126" height="126" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dx="2" dy="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1193_6672"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1193_6672" result="shape"/>
        </filter>
        </defs>
      </StyledImage>
      <Text color="#9F9F9F" fontSize={["16px", "16px", "18px", "18px", "20px"]} fontWeight="700" marginTop="10px" fontFamily="Metuo,sans-serif">No Data</Text>
    </StyledFlex>
  )
}

export default NoData