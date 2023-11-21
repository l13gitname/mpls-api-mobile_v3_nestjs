import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsCanclequotation {
    @ApiProperty({
        default: 'dc6c993d-bea1-4b0d-b6e4-7dc12a7ead7d'
    })
    quotationid: string
}

