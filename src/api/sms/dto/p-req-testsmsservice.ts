import { ApiProperty } from "@nestjs/swagger";

export class PReqTestsmsservice {
    @ApiProperty({
        type: String, default: `Test message Here`, description: `Message SMS body`
    })
    message: string

    @ApiProperty({
        type: String, default: `0952483338`, description: `Phone Number`
    })
    phone_no: string
}
