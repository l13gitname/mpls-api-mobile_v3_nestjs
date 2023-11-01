import { ApiProperty } from '@nestjs/swagger';

export class PReqUser {
    @ApiProperty({
        default: '10654004'
    })
    username: string;

    @ApiProperty({
        default: 'R@mire1994'
    })
    password: string;

    @ApiProperty({
        default: '1'
    })
    channal: string;
}