import { ApiProperty } from "@nestjs/swagger";

export class PReqMrtainfobyid {
    @ApiProperty({
        type: String, default: `0110202206010006`, description: `Application Number`
    })
    application_num: string
}
