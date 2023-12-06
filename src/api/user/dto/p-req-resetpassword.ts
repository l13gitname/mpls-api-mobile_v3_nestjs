import { ApiProperty } from "@nestjs/swagger"

export class PReqResetpassword {
    @ApiProperty({
        type: String, default: ``, description: `User ID for Login`
    })
    username: string
    @ApiProperty({
        type: String, default: ``, description: `Old Password`
    })
    oldpassword: string
    @ApiProperty({
        type: String, default: ``, description: `New Password`
    })
    newpassword: string
}
