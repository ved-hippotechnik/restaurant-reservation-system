import { Restaurant } from '../services/api';

export interface CalendarEventDetails {
  title: string;
  startDateTime: string; // Format: YYYYMMDDTHHMMSS
  endDateTime: string;   // Format: YYYYMMDDTHHMMSS
  details: string;
  location: string;
  restaurantName: string;
  partySize: number;
  customerName: string;
  customerPhone: string;
  specialRequests?: string;
}

/**
 * Formats a date and time into Google Calendar format (YYYYMMDDTHHMMSS)
 */
export const formatDateTimeForGoogle = (date: string, time: string): string => {
  // date format: YYYY-MM-DD
  // time format: HH:MM
  const dateStr = date.replace(/-/g, '');
  const timeStr = time.replace(/:/g, '') + '00'; // Add seconds
  return `${dateStr}T${timeStr}`;
};

/**
 * Creates a Google Calendar event URL
 */
export const createGoogleCalendarUrl = (
  reservation: {
    restaurantName: string;
    restaurantAddress: string;
    date: string;
    time: string;
    partySize: number;
    customerName: string;
    customerPhone: string;
    specialRequests?: string;
  }
): string => {
  // Calculate start and end times
  const startDateTime = formatDateTimeForGoogle(reservation.date, reservation.time);
  
  // Assume 2-hour reservation window
  const [hours, minutes] = reservation.time.split(':').map(Number);
  const endHours = (hours + 2).toString().padStart(2, '0');
  const endTime = `${endHours}:${minutes.toString().padStart(2, '0')}`;
  const endDateTime = formatDateTimeForGoogle(reservation.date, endTime);

  // Create event title
  const title = `Restaurant Reservation at ${reservation.restaurantName}`;

  // Create event details
  const details = [
    `Reservation Details:`,
    `Restaurant: ${reservation.restaurantName}`,
    `Party Size: ${reservation.partySize} ${reservation.partySize === 1 ? 'person' : 'people'}`,
    `Contact: ${reservation.customerName}`,
    `Phone: ${reservation.customerPhone}`,
    reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}` : '',
    '',
    'Note: Please arrive 5-10 minutes early for your reservation.',
  ].filter(Boolean).join('\n');

  // Build the Google Calendar URL
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDateTime}/${endDateTime}`,
    details: details,
    location: reservation.restaurantAddress,
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Downloads an ICS file for the reservation
 */
export const downloadICSFile = (
  reservation: {
    restaurantName: string;
    restaurantAddress: string;
    date: string;
    time: string;
    partySize: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
  }
): void => {
  const startDate = new Date(`${reservation.date}T${reservation.time}`);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

  const formatICSDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Restaurant Reservation System//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@restaurant-reservation`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:Restaurant Reservation at ${reservation.restaurantName}`,
    `DESCRIPTION:Reservation for ${reservation.partySize} ${reservation.partySize === 1 ? 'person' : 'people'}\\n` +
      `Contact: ${reservation.customerName}\\n` +
      `Phone: ${reservation.customerPhone}\\n` +
      (reservation.specialRequests ? `Special Requests: ${reservation.specialRequests}\\n` : '') +
      `\\nPlease arrive 5-10 minutes early.`,
    `LOCATION:${reservation.restaurantAddress}`,
    `ORGANIZER;CN=${reservation.restaurantName}:mailto:${reservation.customerEmail}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Restaurant reservation in 1 hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  // Create and download the file
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `reservation-${reservation.restaurantName.replace(/\s+/g, '-')}-${reservation.date}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};