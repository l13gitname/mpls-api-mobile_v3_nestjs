import { ApiProperty } from "@nestjs/swagger";

export class PReqGetdealersignimage {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
}
