import { ApiProperty } from "@nestjs/swagger";

export class PReqCalculateageDb {
    @ApiProperty({
        type: String, default: `31/10/2003`, description: `Birthdate`
    })
    birthdate: string
}
