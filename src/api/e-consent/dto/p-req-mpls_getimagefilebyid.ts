import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsGetimagefilebyid {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    qutoationid: string
}
