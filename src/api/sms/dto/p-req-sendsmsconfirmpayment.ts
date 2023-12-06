import { ApiProperty } from "@nestjs/swagger";

export class PReqSendsmsconfirmpayment {
    @ApiProperty({
        type: String, default: ``, description: `Phone Number`
    })
    phone_no: string

    @ApiProperty({
        type: String, default: ``, description: `SMS Message`
    })
    sms_message: string

    @ApiProperty({
        type: String, default: `Sender`, description: `sender`
    })
    sender: string

    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string

    @ApiProperty({
        type: String, default: ``, description: ``
    })
    force: string
}