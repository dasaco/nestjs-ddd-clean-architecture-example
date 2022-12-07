import { ValidationError } from 'class-validator'

export function flattenValidationErrors(validationErrors: ValidationError[]): string[] {
  return validationErrors
    .flatMap((error) => mapChildrenToValidationErrors(error))
    .filter((item) => !!item.constraints)
    .flatMap((item) => Object.values(item.constraints!))
}

function mapChildrenToValidationErrors(error: ValidationError, parentPath?: string): ValidationError[] {
  if (!(error.children && error.children.length > 0)) {
    return [error]
  }
  const validationErrors = []
  const newParentPath = parentPath ? `${parentPath}.${error.property}` : error.property

  for (const item of error.children) {
    if (item.children && item.children.length > 0) {
      validationErrors.push(...mapChildrenToValidationErrors(item, newParentPath))
    }
    validationErrors.push(prependConstraintsWithParentProp(newParentPath, item))
  }
  return validationErrors
}

function prependConstraintsWithParentProp(parentPath: string, error: ValidationError): ValidationError {
  const constraints: Record<string, string> = {}

  // eslint-disable-next-line guard-for-in
  for (const key in error.constraints) {
    constraints[key] = `${parentPath}.${error.constraints[key]}`
  }

  return {
    ...error,
    constraints,
  }
}
