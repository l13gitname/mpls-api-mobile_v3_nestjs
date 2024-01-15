import { ApiProperty } from "@nestjs/swagger";

export class PReqGenadvanceqrpayment {
    @ApiProperty({
        type: String, default: `0110202209150001`, description: `Application Number`
    })
    application_num: string
}
