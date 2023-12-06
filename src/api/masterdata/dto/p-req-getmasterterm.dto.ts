import { ApiProperty } from "@nestjs/swagger";

export class PReqGetmasterterm {
    @ApiProperty({
        type: String, default: `01`, description: `Product Code (fix value in api with '01')`
    })
    pro_code: string
    @ApiProperty({
        type: String, default: `03`, description: `Size Model (get value from getmastersizemodel)`
    })
    size_model: string
    @ApiProperty({
        type: Number, default: 1.12, description: `FLat Rate`
    })
    rate: number | null
    @ApiProperty({
        type: String, default: 60000, description: `ยอดกู้รวมเบี้ยประกัน (ถ้ามี)`
    })
    net_finance: number | null
    @ApiProperty({
        type: String, default: `001`, description: `รถจักรยานยนต์ : '001' , รถมือสอง MPLUS : '002'`
    })
    bussiness_code: string
}