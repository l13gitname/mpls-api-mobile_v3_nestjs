import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsUpdateFlagImageAttachFile {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
}
