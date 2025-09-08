import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Phone,
  Email,
  AccessTime,
  Group,
  TableBar,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Reservation {
  id: number;
  reservationCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  restaurantName: string;
  tableNumber: string;
  reservationDateTime: string;
  partySize: number;
  status: string;
  specialRequests?: string;
  occasionType?: string;
}

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails: (reservation: Reservation) => void;
  onEdit?: (reservation: Reservation) => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onViewDetails,
  onEdit,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'ARRIVED':
        return 'info';
      case 'COMPLETED':
        return 'default';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="div">
              {reservation.customerName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Code: {reservation.reservationCode}
            </Typography>
          </Box>
          <Chip
            label={reservation.status}
            color={getStatusColor(reservation.status) as any}
            size="small"
          />
        </Box>

        {/* Details Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
          {/* Date & Time */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2">
                {format(new Date(reservation.reservationDateTime), 'MMM dd')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(reservation.reservationDateTime), 'h:mm a')}
              </Typography>
            </Box>
          </Box>

          {/* Party Size */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Group sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {reservation.partySize} guests
            </Typography>
          </Box>

          {/* Phone */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {reservation.customerPhone}
            </Typography>
          </Box>

          {/* Table */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TableBar sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2">
              {reservation.tableNumber}
            </Typography>
          </Box>
        </Box>

        {/* Occasion */}
        {reservation.occasionType && (
          <Box sx={{ mb: 1 }}>
            <Chip label={reservation.occasionType} size="small" variant="outlined" />
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => onViewDetails(reservation)}
              aria-label={`View details for ${reservation.customerName}`}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit(reservation)}
                aria-label={`Edit reservation for ${reservation.customerName}`}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReservationCard;