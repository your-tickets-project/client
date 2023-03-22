/* eslint-disable no-undef */
export const formatGoogleMapsAddress = (
  addressArray: google.maps.GeocoderAddressComponent[]
) => {
  const address = {
    formattedAddress: '',
    route: '',
    city: '',
    postalCode: '',
    state: '',
    country: '',
  };

  for (let i = 0; i < addressArray.length; i++) {
    if (addressArray[i].types.includes('route')) {
      address.route += addressArray[i].long_name;
    }
    if (addressArray[i].types.includes('administrative_area_level_2')) {
      address.city += addressArray[i].long_name;
    }
    if (addressArray[i].types.includes('postal_code')) {
      address.postalCode += addressArray[i].long_name;
    }
    if (addressArray[i].types.includes('administrative_area_level_1')) {
      address.state += addressArray[i].long_name;
    }
    if (addressArray[i].types.includes('country')) {
      address.country += addressArray[i].long_name;
    }
  }

  if (address.route.length) {
    address.formattedAddress += `${address.route}, `;
  }

  if (address.city.length) {
    address.formattedAddress += `${address.city} `;
  }

  if (address.postalCode.length) {
    address.formattedAddress += `${address.postalCode}, `;
  }

  if (address.state.length) {
    address.formattedAddress += `${address.state}, `;
  }

  if (address.country.length) {
    address.formattedAddress += `${address.country}`;
  }

  return address;
};
