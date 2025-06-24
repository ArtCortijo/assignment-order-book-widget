import { ConnectionStatus } from './types';

interface ErrorMessageProps {
	errorMessage: string;
	isConnected: ConnectionStatus;
	reconnectInterval: number;
}

export default function ErrorMessage({
	errorMessage,
	isConnected,
	reconnectInterval,
}: ErrorMessageProps) {
	return (
		<div style={{ color: 'red' }}>
			<div>{errorMessage}</div>
			{(isConnected === 'error' || isConnected === 'disconnected') && (
				<div>Reconnecting in {reconnectInterval / 1000} seconds...</div>
			)}
		</div>
	);
}
