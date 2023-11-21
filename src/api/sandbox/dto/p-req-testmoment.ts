import { ApiProperty } from "@nestjs/swagger";

export class PReqTestmoment {
    @ApiProperty({
        type: String, default: `18/04/1994`, description: `Date string in format (DD/MM/YYYY)`
    })
    datestring: string
}
