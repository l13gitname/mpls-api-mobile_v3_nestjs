import { ApiProperty } from "@nestjs/swagger";

export class PReqCheckmrtarecent {
    @ApiProperty({
        type: String, default: `5873337a-e6e6-4511-8f6a-0f5124895e5c`, description: `Quotation ID`
    })
    quotationid: string
}
