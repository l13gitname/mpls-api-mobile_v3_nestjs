import { ApiProperty } from "@nestjs/swagger";

export class PReqGetcoveragetotalloss {
    @ApiProperty({
        type: String, default: `10001`, description: `Insurance Code (product)`
    })
    insurance_code: string
    @ApiProperty({
        type: String, default: `001`, description: `Business Code`
    })
    bussi_code: string
    @ApiProperty({
        type: String, default: `01`, description: `Brand Code`
    })
    brand_code: string
    @ApiProperty({
        type: String, default: `0001`, description: `Model Code`
    })
    model_code: string
    @ApiProperty({
        type: String, default: `20220002`, description: `Dealer Code`
    })
    dl_code: string
    @ApiProperty({
        type: Number, default: 123743, description: `Factory Price`
    })
    factory_price: number | null

}
