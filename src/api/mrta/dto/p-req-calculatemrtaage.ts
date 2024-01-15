import { ApiProperty } from "@nestjs/swagger";

export class PReqCalculatemrtaage {
    @ApiProperty({
        type: String, default: `10005`, description: `Insure Code`
    })
    insur_code: string
    @ApiProperty({
        type: String, default: `001`, description: `Bussiness Code`
    })
    busi_code: string
    @ApiProperty({
        type: String, default: `14/09/1984`, description: `Birth Date (format 'dd/mm/yyyy)`
    })
    birth_date: string
    @ApiProperty({
        type: String, default: `15/06/2023`, description: `Request Date (format 'dd/mm/yyyy)`
    })
    request_date: string
}
