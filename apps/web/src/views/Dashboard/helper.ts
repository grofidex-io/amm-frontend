export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export const LIST_COLOR = {
	U2U: '#15C179',
	WBTC: '#7F4EE0',
	USDT: '#FFD238',
	WETH: '#F12C73',
	WBNB: '#00DEFF',
	WTRX: '#F4924A',
	WSOL: '#6E0C3A',
	WDOGE: '#4f5c31',
	WXRP: '#B170B9',
	WADA: '#481943',
	WNEAR: '#773F4A'
}