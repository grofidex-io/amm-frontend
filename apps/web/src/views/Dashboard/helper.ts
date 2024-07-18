export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export const LIST_COLOR = {
	// U2U: '#129E7D',
	// USDT: '#27B9C4',
	// WBTC: '#2882CC',
	// WETH: '#8051D6',
	U2U: '#15C179',
	USDT: '#FFD238',
	WBTC: '#F12C73',
	WETH: '#7F4EE0',
	WBNB: '#FF6384',
	WTRX: '#FF9F40',
	WSOL: '#FFCD56',
	WDOGE: '#4BC0C0',
	WXRP: '#36A2EB',
	WADA: '#9966FF',
	WNEAR: '#C9CBCF'
}