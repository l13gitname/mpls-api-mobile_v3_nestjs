import { ApiProperty } from "@nestjs/swagger";

export class PReqVerifyviewsignimage {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
}
