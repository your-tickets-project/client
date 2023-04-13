/* eslint-disable no-undef */
import React from 'react';
import toast from 'react-hot-toast';
// components
import Wrapper from 'client/components/googleMaps/Wrapper';
// helpers
import { formatGoogleMapsAddress } from 'client/helpers';
// interfaces
import { AddressType } from 'interfaces';

type onDragEnd = (address: AddressType) => void;

interface Props {
  draggable?: boolean;
  location: { lat: number; lng: number };
  onDragEnd?: onDragEnd;
}

export default React.memo(function MapWithMarker({
  draggable,
  location,
  onDragEnd,
}: Props) {
  return (
    <Wrapper>
      <Map center={location as unknown as google.maps.LatLng}>
        <Marker
          position={location}
          draggable={draggable}
          onDragEnd={onDragEnd}
        />
      </Map>
    </Wrapper>
  );
});

const Map = ({
  center,
  children,
}: {
  center: google.maps.LatLng;
  children: React.ReactNode;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading) return;
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center,
          fullscreenControl: false,
          mapTypeControl: true,
          minZoom: 8,
          scaleControl: false,
          streetViewControl: false,
          zoom: 15,
          zoomControl: true,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, ref, map]);

  return (
    <>
      <div ref={ref} style={{ height: '100%', width: '100%' }} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // @ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker: React.FC<
  google.maps.MarkerOptions & {
    onDragEnd?: onDragEnd;
  }
> = (props) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [marker, setMarker] = React.useState<google.maps.Marker>();
  const [geocoder, setGeocoder] = React.useState<google.maps.Geocoder>();
  const [infoWindow, setInfoWindow] = React.useState<google.maps.InfoWindow>();

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading) return;
    if (!marker) {
      setMarker(new window.google.maps.Marker());
      setGeocoder(new window.google.maps.Geocoder());
      setInfoWindow(new window.google.maps.InfoWindow());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [isLoading, marker]);

  React.useEffect(() => {
    if (isLoading) return;
    if (marker && infoWindow) {
      marker.setOptions(props);
      if (props.draggable) {
        infoWindow.setContent('Move me for more precision');
        infoWindow.open(props.map, marker);
      }
      const map = props.map as google.maps.Map;
      map.setCenter(marker.getPosition() as google.maps.LatLng);
    }
  }, [infoWindow, isLoading, marker, props]);

  React.useEffect(() => {
    if (isLoading) return;
    if (marker && geocoder && infoWindow) {
      marker.addListener('dragend', async () => {
        infoWindow.close();

        try {
          const map = props.map as google.maps.Map;
          map.setCenter(marker.getPosition() as google.maps.LatLng);

          const res = await geocoder.geocode({
            location: marker.getPosition(),
          });
          if (res.results[0]) {
            const address = formatGoogleMapsAddress(
              res.results[0].address_components
            );
            infoWindow.setContent(address.formattedAddress);
            infoWindow.open(props.map, marker);

            const lat = marker.getPosition()?.lat();
            const lng = marker.getPosition()?.lng();
            props.onDragEnd?.({ ...address, lat, lng });
          }
        } catch (error) {
          toast.error('Error with google maps, please try again.');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, geocoder, infoWindow, marker]);

  return null;
};
