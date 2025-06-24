import { memo } from 'react';
import { ConnectionStatus } from './types';

interface ErrorMessageProps {
	errorMessage: string;
	isConnected: ConnectionStatus;
	reconnectInterval: number;
}

const ErrorMessage = memo(
	({ errorMessage, isConnected, reconnectInterval }: ErrorMessageProps) => {
		return (
			<div style={{ color: 'red' }}>
				<div>{errorMessage}</div>
				{(isConnected === 'error' || isConnected === 'disconnected') && (
					<div>Reconnecting in {reconnectInterval / 1000} seconds...</div>
				)}
			</div>
		);
	}
);

export default ErrorMessage;
