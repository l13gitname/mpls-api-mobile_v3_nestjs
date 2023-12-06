import { ApiProperty } from "@nestjs/swagger";

export class PReqGetsignimagebyid {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
}

