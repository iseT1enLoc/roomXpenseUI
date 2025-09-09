import { Card, CardContent, Box, Typography, Chip } from '@mui/material';

export default function RoomCard({ room, handleRoomSelect, getRoomIcon }) {
  return (
    <Card
      onClick={() => handleRoomSelect(room.room_id || room.id, room.room_name)}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
        borderRadius: 3,
        p: 2
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" noWrap>
              {getRoomIcon()}
            </Typography>
            <Typography variant="h6" fontWeight="bold" noWrap>
              {room.room_name || room.name || "Unnamed Room"}
            </Typography>
          </Box>
        </Box>

        {/* Created Info */}
        <Box display="flex" flexDirection="column" gap={0.5} mt={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>Created at:</strong> {room.created_at
                                        ? new Date(room.created_at).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            })
                                        : "Unknown"}
          </Typography>
          {/* <Typography variant="body2" color="text.secondary">
            <strong>By:</strong> {room.createdBy || "Unknown"}
          </Typography> */}
        </Box>

        {/* Member count */}
        {room.memberCount && (
          <Chip
            label={`${room.memberCount} member${room.memberCount !== 1 ? 's' : ''}`}
            size="small"
            color="primary"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );
}
