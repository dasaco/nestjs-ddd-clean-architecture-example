import { isEmpty, min, validateSync } from 'class-validator'
import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
} from 'shared/domain/exceptions'
import { flattenValidationErrors } from 'shared/domain/utils'

export const Guard = {
  forInvalidObjects(value: object): void {
    const errors = validateSync(value, { stopAtFirstError: true })

    if (errors.length > 0) {
      const flattenErrors = flattenValidationErrors(errors)

      throw new ArgumentInvalidException(flattenErrors[0]!)
    }
  },

  forNumbersSmallerThan(value: number, minim: number, desc: string): void {
    if (!min(value, minim)) {
      throw new ArgumentOutOfRangeException(desc)
    }
  },

  forUnexpectedType(value: unknown, type: string, desc?: string): void {
    if (typeof value !== type) {
      throw new ArgumentInvalidException(desc || `Expected ${type} but got ${typeof value}`)
    }
  },

  /**
   * Checks if given value is empty (=== '', === null, === undefined).
   */
  forNullOrEmpty(value: unknown, desc: string): void {
    if (isEmpty(value)) {
      throw new ArgumentNotProvidedException(desc)
    }
  },
  /**
   * Checks if value is empty. Accepts strings, numbers, booleans, objects and arrays.
   */
  isEmpty(value: unknown): value is undefined | null | '' | 0 | false {
    if (typeof value === 'number' || typeof value === 'boolean') {
      return false
    }
    if (typeof value === 'undefined' || value === null) {
      return true
    }
    if (value instanceof Date) {
      return false
    }
    if (value instanceof Object && Object.keys(value).length === 0) {
      return true
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true
      }
      if (value.every((item) => Guard.isEmpty(item))) {
        return true
      }
    }
    if (value === '') {
      return true
    }

    return false
  },

  /**
   * Checks length range of a provided number/string/array
   */
  lengthIsBetween(value: number | string | Array<unknown>, minim: number, max: number): boolean {
    if (Guard.isEmpty(value)) {
      throw new Error('Cannot check length of a value. Provided value is empty')
    }
    const valueLength = typeof value === 'number' ? Number(value).toString().length : value.length
    if (valueLength >= minim && valueLength <= max) {
      return true
    }
    return false
  },
}
