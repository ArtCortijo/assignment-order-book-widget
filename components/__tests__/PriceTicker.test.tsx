import { render, screen } from '@testing-library/react';
import PriceTicker from '../PriceTicker';

describe('PriceTicker Display', () => {
	it('displays price from stream data', () => {
		render(<PriceTicker price={100.5} />);
		expect(screen.getByText('100.50 $')).toBeInTheDocument();
	});

	it('shows waiting state when no stream data', () => {
		render(<PriceTicker price={null} />);
		expect(screen.getByText('Last price:')).toBeInTheDocument();
		expect(screen.queryByText('100.50 $')).not.toBeInTheDocument();
	});

	it('shows price direction when provided', () => {
		render(<PriceTicker price={100.5} direction='up' />);
		expect(screen.getByText('↑ price up')).toBeInTheDocument();
	});
});
