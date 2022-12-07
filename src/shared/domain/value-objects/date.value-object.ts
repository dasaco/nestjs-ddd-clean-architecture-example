import { ArgumentInvalidException } from 'shared/domain/exceptions';
import { DomainPrimitive, ValueObject } from './value-object.base';

export class DateVO extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value);
    super({ value: date });
  }

  public get value(): Date {
    return this.props.value;
  }

  public static now(): DateVO {
    return new DateVO(Date.now());
  }

  subtractSeconds(numOfSeconds: number) {
    const newDate = new Date(this.value);
    newDate.setSeconds(newDate.getSeconds() - numOfSeconds);

    return new DateVO(newDate);
  }

  addSeconds(numOfSeconds: number) {
    const newDate = new Date(this.value);
    newDate.setSeconds(newDate.getSeconds() + numOfSeconds);

    return new DateVO(newDate);
  }

  protected validate({ value }: DomainPrimitive<Date>): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new ArgumentInvalidException('Incorrect date');
    }
  }

  public isAfter(date: DateVO) {
    return this.value > date.value;
  }
}
