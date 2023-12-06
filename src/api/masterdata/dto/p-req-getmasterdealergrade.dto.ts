import { ApiProperty } from "@nestjs/swagger";

export class PReqGetMasterdealergrade {
    @ApiProperty({
        type: String, default: `20220002`, description: `Daealer Code`
    })
    dl_code: string
}
