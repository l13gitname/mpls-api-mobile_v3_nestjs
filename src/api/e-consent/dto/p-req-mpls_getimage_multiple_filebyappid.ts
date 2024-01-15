import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsGetimageMultipleFilebyappid {
    @ApiProperty({
        type: String, default: `b6b1e65d-86e9-4951-a96b-eb928061c492`, description: `Application ID`
    })
    applicationid: string
}
