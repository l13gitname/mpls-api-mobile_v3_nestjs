import { ApiProperty } from "@nestjs/swagger";

export class PReqGenmrtaqr {
    @ApiProperty({
        type: String, default: `0110202206010001`, description: `Application Number`
    })
    application_num: string

    @ApiProperty({
        type: Number, default: 6750, description: `ค่าเบี้ย mrta`
    })
    premium_mrta: number | null
}
