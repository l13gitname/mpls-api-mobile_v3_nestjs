import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsGetimageMultipleFilebyid {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
}

