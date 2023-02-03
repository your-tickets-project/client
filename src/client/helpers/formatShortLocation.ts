import { EventLocationType } from 'interfaces';

export const formatShortLocation = ({
  location,
}: {
  location: EventLocationType;
}) => `${location.venue_name} • ${location.city}, ${location.state}`;
