import React, { useCallback, useState } from 'react';
// components
import MapWithMarker from 'client/components/googleMaps/MapWithMarker';
import AutoComplete from 'client/components/googleMaps/AutoComplete';
// interfaces
import { AddressType } from 'interfaces';

interface Props {
  addressError?: boolean;
  position?: {
    lat: number;
    lng: number;
  };
  onAddress?: (location: AddressType) => void;
}

export default React.memo(function MapLocation({
  addressError,
  position,
  onAddress,
}: Props) {
  const [autoCompleteValue, setAutoCompleteValue] = useState<
    string | undefined
  >();
  const [location, setLocation] = useState<
    { lat: number; lng: number } | undefined
  >(position && { lat: position.lat, lng: position.lng });

  const handlePlaceChange = useCallback(
    (address: AddressType) => {
      if (!address.lat || !address.lng) return;
      setLocation({ lat: address.lat, lng: address.lng });
      onAddress?.(address);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setLocation]
  );

  const handleDragEnd = useCallback(
    (address: AddressType) => {
      setAutoCompleteValue(address.formattedAddress);
      onAddress?.(address);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setAutoCompleteValue]
  );

  return (
    <>
      <div className="row">
        <div className="col-12">
          <AutoComplete
            addressError={addressError}
            inputValue={autoCompleteValue}
            onPlaceChange={handlePlaceChange}
          />
        </div>
        {location && (
          <div className="col-12">
            <div className="map-container">
              <MapWithMarker
                draggable
                location={location}
                onDragEnd={handleDragEnd}
              />
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .map-container {
          height: 300px;
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
});
