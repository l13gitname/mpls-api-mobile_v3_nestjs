import { ApiProperty } from "@nestjs/swagger";

export class PReqGentotallosssqrpayment {

    @ApiProperty({
        type: String, default: `0110202209150001`, description: `Application Number (Application ID)`
    })
    application_num: string
}
