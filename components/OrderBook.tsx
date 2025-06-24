'use client';
/* TODO:
   ✅ connect to /api/order-stream via EventSource or fetch‑stream
   – maintain bid/ask list in React state
   – render Material UI table, last price ticker, loading/error states
   ✅ clean up on unmount
*/

import { useState, useEffect, useCallback } from 'react';
import { PriceUpdate, ConnectionStatus, OrderBookProps } from './types';
import PriceTicker from './PriceTicker';
import ConnectionStatusComponent from './ConnectionStatus';
import ErrorMessage from './ErrorMessage';

export default function OrderBook({
	maxUpdates = 20,
	reconnectInterval = 5000,
}: OrderBookProps) {
	const [priceHistory, setPriceHistory] = useState<PriceUpdate[]>([]);
	const [currentPrice, setCurrentPrice] = useState<number | null>(null);
	const [isConnected, setIsConnected] =
		useState<ConnectionStatus>('disconnected');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
			priceStream.onmessage = (event) => {
				try {
					const priceData = JSON.parse(event.data);
					const newPrice = priceData.price;

					if (typeof newPrice === 'number') {
						const priceUpdate: PriceUpdate = {
							timestamp: new Date(),
							price: newPrice,
						};

						setPriceHistory((prevPrices) => {
							const updatedPrices = [priceUpdate, ...prevPrices];
							return updatedPrices.slice(0, maxUpdates);
						});

						setCurrentPrice(newPrice);
					}
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
	}, [maxUpdates]);

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
		<>
			<h1>Order Book</h1>
			<ConnectionStatusComponent status={isConnected} />
			<PriceTicker price={currentPrice} />

			{errorMessage && (
				<ErrorMessage
					errorMessage={errorMessage}
					isConnected={isConnected}
					reconnectInterval={reconnectInterval}
				/>
			)}
		</>
	);
}
