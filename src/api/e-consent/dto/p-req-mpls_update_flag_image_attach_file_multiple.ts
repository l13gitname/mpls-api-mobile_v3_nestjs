import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsUpdateFlagImageAttachFileMultiple {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
}
