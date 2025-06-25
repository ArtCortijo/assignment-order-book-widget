'use client';
/* TODO:
   ✅ connect to /api/order-stream via EventSource or fetch‑stream
   ✅ maintain bid/ask list in React state
   ✅ render Material UI table, last price ticker, loading/error states
   ✅ clean up on unmount
*/

import { useState, useEffect, useCallback, useRef } from 'react';
import {
	PriceUpdate,
	ConnectionStatus,
	OrderBookProps,
	PriceDirection,
} from './types';
import PriceTicker from './PriceTicker';
import ConnectionStatusComponent from './ConnectionStatus';
import ErrorMessage from './ErrorMessage';
import PriceTable from './PriceTable';
import { Box, Typography } from '@mui/material';

export default function OrderBook({
	maxUpdates = 20,
	reconnectInterval = 5000,
}: OrderBookProps) {
	const [priceHistory, setPriceHistory] = useState<PriceUpdate[]>([]);
	const [currentPrice, setCurrentPrice] = useState<number | null>(null);
	// Use ref to track current price without causing re-renders
	const currentPriceRef = useRef<number | null>(null);
	const [previousPrice, setPreviousPrice] = useState<number | null>(null);
	const [isConnected, setIsConnected] =
		useState<ConnectionStatus>('disconnected');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Price direction
	const getPriceDirection = useCallback(
		(current: number, previous: number): PriceDirection | null => {
			if (previous === null) return null;
			if (current > previous) return 'up';
			if (current < previous) return 'down';
			return null; // same price
		},
		[]
	);

	// Handle new price updates
	const handlePriceUpdate = useCallback(
		(newPrice: number) => {
			// Validate price
			if (typeof newPrice !== 'number' || isNaN(newPrice)) {
				console.error('Invalid price received:', newPrice);
				return;
			}

			// Update previous price
			setPreviousPrice(currentPriceRef.current);

			// Generate a bid/ask spread (0.05$)
			const spread = 0.05;
			const bid = newPrice - spread;
			const ask = newPrice + spread;

			// New price with timestamp
			const priceUpdate: PriceUpdate = {
				timestamp: new Date(),
				price: newPrice,
				bid,
				ask,
				spread: spread * 2, // Total spread
			};

			// Update price history
			setPriceHistory((prevPrices) => {
				const updatedPrices = [priceUpdate, ...prevPrices];
				return updatedPrices.slice(0, maxUpdates);
			});

			// Update current price and ref
			setCurrentPrice(newPrice);
			currentPriceRef.current = newPrice;

			// console.log(`Price updated: ${newPrice.toFixed(2)}$`);
		},
		[maxUpdates]
	);

	const currentPriceDirection = getPriceDirection(currentPrice, previousPrice);

	const connectToStream = useCallback(() => {
		try {
			const priceStream = new EventSource('/api/order-stream');

			// Connection ready
			priceStream.onopen = () => {
				console.log('Connected to stream');
				setIsConnected('connected');
				setErrorMessage(null);
			};

			// Handling new price data + timestamp
			priceStream.onmessage = (e) => {
				try {
					const priceData = JSON.parse(e.data);
					const newPrice = priceData.price;

					handlePriceUpdate(newPrice);
				} catch (error) {
					console.error('Error parsing price data:', error);
				}
			};

			priceStream.onerror = (e) => {
				console.error('Stream connection error:', e);
				setIsConnected('error');
				setErrorMessage('Lost connection to price feed');
				priceStream.close();
			};

			const handleConnectionClose = () => {
				console.log('Stream connection closed');
				setIsConnected('disconnected');
			};

			priceStream.addEventListener('close', handleConnectionClose);

			return () => {
				priceStream.removeEventListener('close', handleConnectionClose);
				priceStream.close();
			};
		} catch (error) {
			console.error('Failed to start price feed:', error);
			setIsConnected('error');
			setErrorMessage('Could not connect to price feed');
			return () => {};
		}
	}, [maxUpdates, handlePriceUpdate]);

	useEffect(() => {
		const cleanup = connectToStream();
		return cleanup;
	}, [connectToStream]);

	// Automatic reconnection
	useEffect(() => {
		if (isConnected === 'error' || isConnected === 'disconnected') {
			const reconnectionTimer = setTimeout(() => {
				setErrorMessage(null);
				connectToStream();
			}, reconnectInterval);

			return () => clearTimeout(reconnectionTimer);
		}
	}, [isConnected, reconnectInterval, connectToStream]);

	return (
		<Box sx={{ padding: 3 }}>
			<Typography
				variant='h4'
				component='h1'
				gutterBottom
				sx={{ fontWeight: '700', color: '#141414' }}
			>
				Order Book
			</Typography>

			<Box sx={{ marginBottom: 2 }}>
				<ConnectionStatusComponent status={isConnected} />
			</Box>

			<Box sx={{ marginBottom: 2 }}>
				<PriceTicker
					price={currentPrice}
					direction={currentPriceDirection}
					bid={priceHistory[0]?.bid || null}
					ask={priceHistory[0]?.ask || null}
					spread={priceHistory[0]?.spread || null}
				/>
			</Box>

			<PriceTable priceHistory={priceHistory} />

			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					isConnected={isConnected}
					reconnectInterval={reconnectInterval}
				/>
			)}
		</Box>
	);
}
