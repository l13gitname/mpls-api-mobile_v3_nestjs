import { ApiProperty } from '@nestjs/swagger';

export class Ireqbasicexecutebinding {
  @ApiProperty({
    default: `SELECT  RATE FROM BTW.RATE_P WHERE SIZE_CODE = :size_model AND PRO_CODE = :pro_code AND TRUNC(SYSDATE) BETWEEN TRUNC(ST_DATE) AND TRUNC(NVL(EN_DATE,SYSDATE)) ORDER BY RATE`
  })
  strsql: string;

  @ApiProperty({ default: {
    size_model: '03',
    pro_code: '01'
  }})
  bindparams: Object;

}