import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsUpdatePhoneNumber {
    @ApiProperty({
        type: String, default: ''
    })
    quotationid: string
    @ApiProperty({
        type: String, default: ''
    })
    phone_number: string
}
