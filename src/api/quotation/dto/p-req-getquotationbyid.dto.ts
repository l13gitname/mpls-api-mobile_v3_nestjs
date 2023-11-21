import { ApiProperty } from "@nestjs/swagger";

export class PReqGetquotationbyid {
    @ApiProperty({
        default: '27dac4a1-0752-49c1-b4a8-3cb1abb068a4'
    })
    quotationid: string
}
