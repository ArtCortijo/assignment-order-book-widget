import { memo } from 'react';

interface PriceTickerProps {
	price: number | null;
}

const PriceTicker = memo(({ price }: PriceTickerProps) => {
	return <div>Current price: {price ? `${price.toFixed(2)} $` : ''}</div>;
});

export default PriceTicker;
