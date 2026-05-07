import { AddressInput } from '@tstypes/address-input';

export function isAddressChanged(address: Partial<AddressInput>): boolean {
  return !!(
    address.street ||
    address.city ||
    address.zipcode ||
    address.country
  );
}

export function buildFullAdress(
  address: Partial<AddressInput>,
  existingAddress: Required<AddressInput>,
) {
  return {
    street: address.street ?? existingAddress.street,
    city: address.city ?? existingAddress.city,
    zipcode: address.zipcode ?? existingAddress.zipcode,
    country: address.country ?? existingAddress.country,
  };
}
