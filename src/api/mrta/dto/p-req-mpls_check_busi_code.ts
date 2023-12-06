import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsCheckBusiCode {
    @ApiProperty({
        type: String, default: `aad32a64-fa6f-4f33-86a8-366c17a6fb1c`, description: `Quotation ID`
    })
    quotation_id: string;
}
