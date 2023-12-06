import { ApiProperty } from "@nestjs/swagger";

export class PReqForgetpassword {

    @ApiProperty({
        type: String, default: ``, description: `Email`
    })
    email: string
}
