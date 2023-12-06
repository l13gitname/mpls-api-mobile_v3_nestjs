import { ApiProperty } from "@nestjs/swagger";

export class PReqGetmastermrtainsurance {
    @ApiProperty({
        type: Number, default: 124272, description: `Outstand`
    })
    out_stand: number | null

    @ApiProperty({
        type: String, default: `001`, description: `Business Code`
    })
    busi_code: string

    @ApiProperty({
        type: String, default: `14/09/1984`, description: `Birth Date (string format ('dd/mm/yyyy'))`
    })
    birth_date: string

    @ApiProperty({
        type: Number, default: 1, description: `Gender (1: male, 2: female)`
    })
    gender: number | null
}