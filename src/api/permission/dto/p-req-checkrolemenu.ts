import { ApiProperty } from "@nestjs/swagger";

export class PReqCheckrolemenu {
    @ApiProperty({
        type: String, default: `0723`, description: `Menu ID for each page of user login to check permission`
    })
    menu_id: string
}
