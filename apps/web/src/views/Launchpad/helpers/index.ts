import { DefaultTheme } from "styled-components/dist/types";

export const LAUNCHPAD_STATUS = {
	UPCOMING: 'UPCOMING',
	CANCELLED: 'CANCELLED',
	CLAIMABLE: 'CLAIMABLE',
	ENDED: 'ENDED',
	ON_GOING: 'ON_GOING'
}
export const convertTierInfo = (args) => {
  return {
    minStake: args[0],
    maxBuyPerUser: args[1],
    start: args[2],
    end: args[3],
    maxCommitAmount: args[4],
    currentCommit: args[5],
    startCancel: args[6],
    endCancel: args[7],
    startCalculate: args[8],
    endCalculate: args[9]
  }
}

export const capitalize = (s: string) => {
  return s[0].toUpperCase() + s.slice(1);
}

const formatTime = (_time: number) => {
	if(_time < 10) {
		return `0${_time}`
	}
	return _time
}

export const countdownDate = (countDownDate: number, cb: (_time: any ) => void, type?: number) => {
	const x = setInterval(() => {
		// Get today's date and time
		const now = new Date().getTime();
	
		// Find the distance between now and the count down date
		const distance = countDownDate - now;
	
		// Time calculations for days, hours, minutes and seconds
		const days = formatTime(Math.floor(distance / (1000 * 60 * 60 * 24)));
		const hours = formatTime(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
		const minutes = formatTime(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
		const seconds = formatTime(Math.floor((distance % (1000 * 60)) / 1000));
		
		// Display the result in the element with id="demo"
		const _time = `${days}d : ${  hours  }h : ${
			minutes  }m : ${  seconds  }s `;
		if(cb) {
			cb(type ? [days, hours, minutes, seconds] : _time);
		}
		// If the count down is finished, write some text
		if (distance < 0) {
			clearInterval(x);
			cb(type ? ['00d', '00h', '00m', '00s'] : '00d : 00h : 00m : 00s' );
		}

	}, 1000);
	return x
}

export const getStatusNameLaunchpad = (_type: string) => {
	return _type === LAUNCHPAD_STATUS.UPCOMING ? 'Upcoming'
	: _type === LAUNCHPAD_STATUS.CANCELLED ? 'Cancelled'
	: _type === LAUNCHPAD_STATUS.CLAIMABLE ? 'Claimable'
	: _type === LAUNCHPAD_STATUS.ENDED ? 'Ended'
	: 'On Going'
}

export const getColorLaunchpadByStatus = (_status: string, theme: DefaultTheme) => {
	return  _status === LAUNCHPAD_STATUS.UPCOMING ? theme.colors.yellow
	: _status === LAUNCHPAD_STATUS.CANCELLED ? theme.colors.orange
	: _status ===  LAUNCHPAD_STATUS.CLAIMABLE  ? theme.colors.cyan
	: _status === LAUNCHPAD_STATUS.ENDED ? theme.colors.textSubtle
	: theme.colors.primary
}

