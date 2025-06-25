import { memo } from 'react';
import { Paper, Typography } from '@mui/material';
import { PriceDirection } from './types';

interface PriceTickerProps {
	price: number | null;
	direction?: PriceDirection | null;
	bid?: number | null;
	ask?: number | null;
	spread?: number | null;
}

const PriceTicker = memo(
	({ price, direction, bid, ask, spread }: PriceTickerProps) => {
		// Set price background based if price is up or down
		const setBackgroundColor = () => {
			if (!direction) return '#f8f9fa';
			return direction === 'up' ? '#e8f5e8' : '#ffeaea';
		};

		// Set price color based if price is up or down
		const setTextColor = () => {
			if (!direction) return '#141414';
			return direction === 'up' ? '#2e7d32' : '#d32f2f';
		};

		// CSS switch color transition
		const switchAnimation = direction
			? {
					animation: 'switch 0.5s ease-in-out',
					'@keyframes switch': {
						'0%': { opacity: 1 },
						'50%': { opacity: 0.5 },
						'100%': { opacity: 1 },
					},
			  }
			: {};

		return (
			<Paper
				elevation={2}
				sx={{
					padding: 3,
					textAlign: 'center',
					backgroundColor: setBackgroundColor(),
					color: setTextColor(),
					transition: 'all 0.3s ease-in-out',
					...switchAnimation,
				}}
			>
				<Typography variant='body1' gutterBottom>
					Last price:
				</Typography>

				<Typography variant='h3' component='div' gutterBottom>
					{price ? `${price.toFixed(2)} $` : ''}
				</Typography>

				{direction && (
					<Typography variant='body2'>
						{direction === 'up' ? '↑ price up' : '↓ price down'}
					</Typography>
				)}
			</Paper>
		);
	}
);

export default PriceTicker;
