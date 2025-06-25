import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderBook from '../OrderBook';

// Mock EventSource
const mockEventSource = {
	onopen: null as ((event: Event) => void) | null,
	onmessage: null as ((event: MessageEvent) => void) | null,
	onerror: null as ((event: Event) => void) | null,
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
	close: jest.fn(),
	readyState: 0,
};

global.EventSource = jest.fn(() => mockEventSource) as any;

describe('Stream Handler', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(mockEventSource as any).onopen = null;
		(mockEventSource as any).onmessage = null;
		(mockEventSource as any).onerror = null;
		(mockEventSource as any).close = jest.fn();
		(mockEventSource as any).readyState = 0;
	});

	it('processes valid price updates from stream', async () => {
		render(<OrderBook />);

		// Simulate connection
		act(() => {
			if (mockEventSource.onopen) {
				mockEventSource.onopen(new Event('open'));
			}
		});

		// Simulate valid price update
		act(() => {
			if (mockEventSource.onmessage) {
				mockEventSource.onmessage({
					data: JSON.stringify({ price: 100.5 }),
				} as MessageEvent);
			}
		});

		// Verify price is processed and displayed
		await waitFor(() => {
			expect(screen.getByText('100.50 $')).toBeInTheDocument();
		});
	});

	it('handles invalid JSON data gracefully', async () => {
		render(<OrderBook />);

		// Simulate connection
		act(() => {
			if (mockEventSource.onopen) {
				mockEventSource.onopen(new Event('open'));
			}
		});

		// Simulate malformed JSON
		act(() => {
			if (mockEventSource.onmessage) {
				mockEventSource.onmessage({
					data: 'invalid json',
				} as MessageEvent);
			}
		});

		// Verify component remains functional
		await waitFor(() => {
			expect(screen.getByText('🟢 Connected')).toBeInTheDocument();
		});
	});

	it('handles connection events', async () => {
		render(<OrderBook />);

		// Test connection open
		act(() => {
			if (mockEventSource.onopen) {
				mockEventSource.onopen(new Event('open'));
			}
		});

		await waitFor(() => {
			expect(screen.getByText('🟢 Connected')).toBeInTheDocument();
		});

		// Test connection error
		act(() => {
			if (mockEventSource.onerror) {
				mockEventSource.onerror(new Event('error'));
			}
		});

		await waitFor(() => {
			expect(screen.getByText('🔴 Disconnected')).toBeInTheDocument();
			expect(mockEventSource.close).toHaveBeenCalled();
		});
	});
});
