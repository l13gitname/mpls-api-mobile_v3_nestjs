import { ApiProperty } from "@nestjs/swagger";

export class PReqMplsCheckSecondhandCarImageAttach {
    @ApiProperty({
        type: String, default: '', description: `QuotationID`
    })
    quotationid: string
    @ApiProperty({
        type: String, default: '', description: `Contract Reference Number`
    })
    contract_ref: string
}
