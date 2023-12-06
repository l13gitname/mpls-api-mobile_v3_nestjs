import { ApiProperty } from "@nestjs/swagger";

export class PReqGenadvanceqrpayment {
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    application_num: string
}
