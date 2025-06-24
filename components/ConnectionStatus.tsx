import { memo } from 'react';
import { ConnectionStatus as ConnectionStatusType } from './types';

interface ConnectionStatusProps {
	status: ConnectionStatusType;
}

const ConnectionStatus = memo(({ status }: ConnectionStatusProps) => {
	return <div>Connection status: {status}</div>;
});

export default ConnectionStatus;
