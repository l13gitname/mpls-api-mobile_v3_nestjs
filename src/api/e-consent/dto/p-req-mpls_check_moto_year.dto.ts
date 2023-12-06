import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsCheckMotoYear {
    @ApiProperty({
        type: Number, default: 1, description: ``
    })
    moto_year: number
    @ApiProperty({
        type: String, default: `002`, description: ``
    })
    bussiness_code: string
    @ApiProperty({
        type: String, default: `01`, description: ``
    })
    product_code: string
    @ApiProperty({
        type: String, default: `01`, description: ``
    })
    brand_code: string
    @ApiProperty({
        type: String, default: `0072`, description: ``
    })
    model_code: string
    @ApiProperty({
        type: String, default: `20220004`, description: ``
    })
    sl_code: string

}
