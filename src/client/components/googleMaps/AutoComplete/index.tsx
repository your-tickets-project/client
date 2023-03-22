/* eslint-disable no-undef */
import React from 'react';
import toast from 'react-hot-toast';
// components
import Wrapper from 'client/components/googleMaps/Wrapper';
import { Input } from 'client/components/ui';
import { SearchIcon } from 'client/components/icons';
// helpers
import { formatGoogleMapsAddress } from 'client/helpers';
// interfaces
import { AddressType } from 'interfaces';
// styles
import { colors, fluidFont } from 'client/styles/variables';

interface Props {
  addressError?: boolean;
  inputValue?: string;
  onPlaceChange: (address: AddressType) => void;
}

export default React.memo(function AutoComplete({
  addressError,
  inputValue,
  onPlaceChange,
}: Props) {
  return (
    <Wrapper>
      <AutoCompleteInput
        addressError={addressError}
        inputValue={inputValue}
        onPlaceChange={onPlaceChange}
      />
    </Wrapper>
  );
});

const AutoCompleteInput = ({
  addressError,
  inputValue,
  onPlaceChange,
}: Props) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [autoComplete, setAutoComplete] =
    React.useState<google.maps.places.Autocomplete>();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading) return;
    if (inputValue === undefined) return;
    setValue(inputValue);
  }, [isLoading, inputValue]);

  React.useEffect(() => {
    if (isLoading) return;
    if (ref.current && !autoComplete) {
      setAutoComplete(
        new window.google.maps.places.Autocomplete(ref.current, {
          types: ['establishment'],
          fields: ['address_components', 'geometry', 'name'],
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, ref, autoComplete]);

  React.useEffect(() => {
    if (isLoading) return;
    if (autoComplete) {
      autoComplete.addListener('place_changed', () => {
        try {
          const placeResult = autoComplete.getPlace();

          if (!placeResult.address_components) return;

          const address = formatGoogleMapsAddress(
            placeResult.address_components
          );
          setValue(
            `${placeResult.name ? `${placeResult.name},` : ''} ${
              address.formattedAddress
            }`
          );
          onPlaceChange({
            ...address,
            name: placeResult.name || '',
            lat: placeResult.geometry?.location?.lat(),
            lng: placeResult.geometry?.location?.lng(),
          });
        } catch (error) {
          toast.error('Error with google maps, please try again');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, autoComplete]);

  return (
    <>
      <Input
        addonBefore={<SearchIcon />}
        error={addressError}
        inputRef={ref}
        name="auto-complete"
        placeholder="Search for a venue or address."
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {addressError && (
        <div
          style={{
            color: colors.warning,
            fontSize: fluidFont.small,
            marginTop: '.3rem',
          }}
        >
          Location is required
        </div>
      )}
    </>
  );
};
