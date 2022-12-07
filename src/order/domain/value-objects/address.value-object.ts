import { Guard } from 'shared/domain/guards/guard'
import { ValueObject } from 'shared/domain/value-objects/value-object.base'

export interface AddressProps {
  addressLine1: string
  addressLine2: string
  zipCode: string
  city: string
  country: string
}

export class Address extends ValueObject<AddressProps> {
  protected validate(payload: AddressProps): void {
    Guard.forNullOrEmpty(payload.addressLine1, 'Address1 cannot be empty')
    Guard.forNullOrEmpty(payload.addressLine2, 'Address2 cannot be empty')
    Guard.forNullOrEmpty(payload.zipCode, 'Zipcde cannot be empty')
    Guard.forNullOrEmpty(payload.city, 'City cannot be empty')
    Guard.forNullOrEmpty(payload.country, 'Country cannot be empty')
  }
}
