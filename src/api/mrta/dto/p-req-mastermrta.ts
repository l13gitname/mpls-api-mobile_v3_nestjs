import { ApiProperty } from "@nestjs/swagger";

export class PReqMastermrta {
    @ApiProperty({
        type: String, default: `001`, description: `Bussiness Code`
    })
    busi_code: string
}
