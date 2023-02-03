import { EventLocationType } from 'interfaces';

export const formatLongLocation = ({
  location,
}: {
  location: EventLocationType;
}) => {
  let strLocation = '';
  strLocation += `${location.venue_name},`;
  strLocation += ` ${location.address_1},`;
  strLocation += ` ${location.address_2 || ''},`;
  strLocation += ` ${location.city}`;
  strLocation += ` ${location.state}`;
  strLocation += ` ${location.postal_code}`;
  strLocation += ` ${location.country}`;

  return strLocation;
};
