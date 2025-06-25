// Shared types for OrderBook components
export interface PriceUpdate {
	timestamp: Date;
	price: number;
	bid: number;
	ask: number;
	spread: number;
}

export interface OrderBookProps {
	maxUpdates?: number;
	reconnectInterval?: number;
}

export type ConnectionStatus = 'connected' | 'error' | 'disconnected';

export type PriceDirection = 'up' | 'down';
