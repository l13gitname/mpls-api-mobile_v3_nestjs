import { ApiProperty } from "@nestjs/swagger";

export class PReqSaveqrpayment {
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    pay_status: number | null
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    application_num: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    quotationid: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    insurance_code: string
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    insurance_year: number | null
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    insurer_code: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    insurance_seller: string
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    premium_mrta: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    out_stand: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    gender: number | null
    @ApiProperty({
        type: Number, default: ``, description: ``
    })
    age: number | null
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    uudid: string
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    phone_number: string
    
}
