import { memo } from 'react';
import { ConnectionStatus as ConnectionStatusType } from './types';
import { Box, Chip } from '@mui/material';

interface ConnectionStatusProps {
	status: ConnectionStatusType;
}

const ConnectionStatus = memo(({ status }: ConnectionStatusProps) => {
	return (
		<Box sx={{ marginTop: 2, marginBottom: 2 }}>
			<Chip
				label={status === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
				color={status === 'connected' ? 'success' : 'error'}
				variant='outlined'
			></Chip>
		</Box>
	);
});

export default ConnectionStatus;
