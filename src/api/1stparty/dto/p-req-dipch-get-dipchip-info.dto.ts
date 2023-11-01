
import { ApiProperty } from "@nestjs/swagger";

export interface IReqDipchGetDipchipInfo {
    token: string
    username: string
    fromBody: string | object
}

export class PReqDipchGetDipchipInfo {
    @ApiProperty({
        default: '', description: '*Token will generate auto when call dipchip api'
    })
    token: string

    @ApiProperty({
        default: '10654004', description: 'USERID of employee'
    })
    username: string

    @ApiProperty({
        default: '', description: 'default empty string (non-require)'
    })
    fromBody: string | object
}

export class SampleDto {
    @ApiProperty({
        default: '', description: '*Token will generate auto when call dipchip api'
    })
    token: string

    @ApiProperty({
        default: '10654004', description: 'USERID of employee'
    })
    username: string

    @ApiProperty({
        default: '', description: 'default empty string (non-require)'
    })
    fromBody: string | object
}