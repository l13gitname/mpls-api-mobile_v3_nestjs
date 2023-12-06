import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsCalculateMotoYear {
    @ApiProperty({
        type: String, default: `12/04/2017`, description: `Register Date`
    })
    reg_date: string
}
