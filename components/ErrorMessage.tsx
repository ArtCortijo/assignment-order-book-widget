import { memo } from 'react';
import { ConnectionStatus } from './types';
import { Alert } from '@mui/material';

interface ErrorMessageProps {
	errorMessage: string;
	isConnected: ConnectionStatus;
	reconnectInterval: number;
}

const ErrorMessage = memo(
	({ errorMessage, isConnected, reconnectInterval }: ErrorMessageProps) => {
		return (
			<Alert severity='error'>
				<div>{errorMessage}</div>
				{(isConnected === 'error' || isConnected === 'disconnected') && (
					<div>Reconnecting in {reconnectInterval / 1000} seconds...</div>
				)}
			</Alert>
		);
	}
);

export default ErrorMessage;
