import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import isISO4217 from 'validator/lib/isISO4217'

@ValidatorConstraint({ async: true })
class CurrencyValidator implements ValidatorConstraintInterface {
  validate(currency: any, args: ValidationArguments) {
    return currency ? isISO4217(currency) : false
  }
}

/**
 * TODO: Replace with native class-validator validator once it's released
 * and remove dependency on validator package
 */
export function IsValidCurrency(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: CurrencyValidator,
    })
  }
}
