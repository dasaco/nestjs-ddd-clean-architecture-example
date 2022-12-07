import { ObjectLiteral } from 'shared/domain/types'

export function randomEnum<T extends ObjectLiteral>(anEnum: T): T[keyof T] {
  const values = Object.keys(anEnum)
  const enumKey = values[Math.floor(Math.random() * values.length)]

  return anEnum[enumKey!] as T[keyof T]
}
