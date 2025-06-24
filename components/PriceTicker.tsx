interface PriceTickerProps {
	price: number | null;
}

export default function PriceTicker({ price }: PriceTickerProps) {
	return <div>Current price: {price ? `${price.toFixed(2)} $` : ''}</div>;
}
