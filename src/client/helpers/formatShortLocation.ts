export const formatShortLocation = ({
  location,
}: {
  location: { city: string; state: string | null; venue_name: string };
}) => `${location.venue_name} • ${location.city}, ${location.state || ''}`;
