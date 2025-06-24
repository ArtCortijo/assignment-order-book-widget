import { ConnectionStatus as ConnectionStatusType } from './types';

interface ConnectionStatusProps {
	status: ConnectionStatusType;
}

export default function ConnectionStatus({ status }: ConnectionStatusProps) {
	return <div>Connection status: {status}</div>;
}
