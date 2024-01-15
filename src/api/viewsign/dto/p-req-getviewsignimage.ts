import { ApiProperty } from "@nestjs/swagger";

export class PReqGetviewsignimage { 
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
}
