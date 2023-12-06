import { ApiProperty } from "@nestjs/swagger";

export class PReqGetpaymentvalue {
    @ApiProperty({
        type: Number, default: 92555, description: `ยอดกู้รวมดอกเบี้ย`
    })
    net_finance: number | null
    @ApiProperty({
        type: Number, default: 24, description: `จำนวนงวด`
    })
    term: number | null
    @ApiProperty({
        type: Number, default: 1.25, description: `อัตราดอกเบี้ย`
    })
    rate: number | null
}