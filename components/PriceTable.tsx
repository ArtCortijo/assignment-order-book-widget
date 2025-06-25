import { memo } from 'react';
import { PriceUpdate, PriceDirection } from './types';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';

interface PriceTableProps {
	priceHistory: PriceUpdate[];
}

const PriceTable = memo(({ priceHistory }: PriceTableProps) => {
	// Format timestamp
	const formatTimeStamp = (timestamp: Date) => {
		return timestamp.toLocaleTimeString();
	};

	// Format price
	const formatPrice = (price: number) => {
		return `${price.toFixed(2)} $`;
	};

	// Set price direction for each row
	const setPriceDirection = (currentIndex: number): PriceDirection | null => {
		// For the last item, compare with the previous one
		if (currentIndex === priceHistory.length - 1) {
			if (priceHistory.length < 2) return null; // Need at least 2 items to compare
			const currentPrice = priceHistory[currentIndex].price;
			const previousPrice = priceHistory[currentIndex - 1].price;

			if (currentPrice > previousPrice) return 'up';
			if (currentPrice < previousPrice) return 'down';
			return null; // same price
		}

		// For other items, compare with the next one (as before)
		const currentPrice = priceHistory[currentIndex].price;
		const nextPrice = priceHistory[currentIndex + 1].price;

		if (currentPrice > nextPrice) return 'up';
		if (currentPrice < nextPrice) return 'down';
		return null; // same price
	};

	const setRowStyle = (direction: PriceDirection | null) => {
		if (!direction) return {};

		return {
			backgroundColor: direction === 'up' ? '#e8f5e8' : '#ffeaea',
			'&:hover': {
				backgroundColor: direction === 'up' ? '#d4edda' : '#f8d7da',
			},
		};
	};

	return (
		<Paper elevation={2} sx={{ marginTop: 6 }}>
			<Typography
				variant='h6'
				sx={{ padding: 2, borderBottom: 1, borderColor: '#ccc' }}
			>
				Bid/Ask Table ({priceHistory.length} updates)
			</Typography>

			<Table>
				<TableHead>
					<TableRow>
						{/* Adding this column for counting purposes */}
						<TableCell sx={{ fontWeight: '700' }}>#</TableCell>
						<TableCell sx={{ textAlign: 'center', fontWeight: '700' }}>
							Timestamp
						</TableCell>
						<TableCell sx={{ textAlign: 'center', fontWeight: '700' }}>
							Bid
						</TableCell>
						<TableCell sx={{ textAlign: 'center', fontWeight: '700' }}>
							Ask
						</TableCell>
						<TableCell sx={{ textAlign: 'center', fontWeight: '700' }}>
							Price change
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{priceHistory.length > 0 ? (
						priceHistory.map((item, index) => {
							const direction = setPriceDirection(index);
							return (
								<TableRow key={index} hover sx={setRowStyle(direction)}>
									{/* Adding this column for counting purposes */}
									<TableCell>{index + 1}</TableCell>
									<TableCell sx={{ textAlign: 'center' }}>
										{formatTimeStamp(item.timestamp)}
									</TableCell>
									<TableCell sx={{ textAlign: 'center' }}>
										{formatPrice(item.bid)}
									</TableCell>
									<TableCell sx={{ textAlign: 'center' }}>
										{formatPrice(item.ask)}
									</TableCell>
									<TableCell sx={{ textAlign: 'center' }}>
										{direction === 'up' && '↗'}
										{direction === 'down' && '↘'}
										{direction === null && '-'}
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell colSpan={5} align='center'>
								No price data available
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Paper>
	);
});

export default PriceTable;
