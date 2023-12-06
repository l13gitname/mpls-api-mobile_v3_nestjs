import { ApiProperty, ApiQuery } from "@nestjs/swagger";

export class PReqGetmasterrate {
    @ApiProperty({
        type: String, default: `03`, description: `ไซส์โมเดลที่ได้จาก getSizeModel`
    })
    size_model: string
    @ApiProperty({
        type: String, default: `01`, description: `Pro code of Product`
    })
    pro_code: string
    @ApiProperty({
        type: String, default: `001`, description: `รถจักรยานยนต์ : '001' , รถมือสอง MPLUS : '002'`
    })
    bussiness_code: string
} 