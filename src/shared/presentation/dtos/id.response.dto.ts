import { ApiProperty } from '@nestjs/swagger';

export class IdResponse {
  constructor(id: string) {
    this.id = id;
  }

  @ApiProperty({
    example: '6cdcbda1-6d50-51cc-ba14-54e4ac7ec231',
    format: 'uuid',
  })
  readonly id: string;
}
