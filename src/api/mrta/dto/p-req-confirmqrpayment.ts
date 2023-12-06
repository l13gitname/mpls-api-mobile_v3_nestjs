import { ApiProperty } from "@nestjs/swagger";

export class PReqConfirmqrpayment {
    @ApiProperty({
        type: String, default: `0110202209160002`, description: `Application Number`
    })
    application_num: string

    @ApiProperty({
        type: String, default: `110202200010071`, description: `Contract Number`
    })
    contract_no: string

}