import { ApiProperty } from "@nestjs/swagger";

export class PReqGetinsurancedetailbyid {
    @ApiProperty({
        type: String, default: `0110202206010001`, description: `Application ID`
    })
    applicationid: string
}
