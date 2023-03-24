export interface AddressType {
  formattedAddress: string;
  route: string;
  city: string;
  name?: string;
  postalCode: string;
  state: string;
  country: string;
  lat?: number;
  lng?: number;
}
