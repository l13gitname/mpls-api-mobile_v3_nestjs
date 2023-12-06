import { ApiProperty } from "@nestjs/swagger";

export class PReqGetmaxltv {
    @ApiProperty({
        type: Number, default: 92555, description: `Factory Price`
    })
    factory_price: number | null ;
    @ApiProperty({
        type: String, default: `001`, description: `Bussiness Code`
    })
    bussi_code: string;
    @ApiProperty({
        type: String, default: `01`, description: `Product Code`
    })
    pro_code: string;
    @ApiProperty({
        type: String, default: `04`, description: `Brand Code`
    })
    brand_code: string;
    @ApiProperty({
        type: String, default: `0036`, description: `Model Code`
    })
    model_code: string;
    @ApiProperty({
        type: String, default: `20220004`, description: `Dealer Code`
    })
    dl_code: string;
    @ApiProperty({
        type: Number, default: 1, description: `Motocycle Year (age)`
    })
    moto_year: number;
    @ApiProperty({
        type: String, default: ``, description: `Contract Reference Number`, required: false
    })
    con_ref: string;
}
