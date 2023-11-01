import { ApiProperty } from '@nestjs/swagger';

export class Ireqbasicexecute {
  @ApiProperty({
    default: `SELECT * FROM BTW.NEG_RESULT_P`
  })
  strsql: string;

}