import { ApiProperty } from "@nestjs/swagger";

export class ItemBypasssignature {
    @ApiProperty({
        type: String, default: ``, description: ``
    })
    quotationid: string | null
}

export class PReqBypasssignature {
    @ApiProperty({ type: 'string', format: 'binary', name: 'customersig_image' })
    customersig_image: any;
    @ApiProperty({ type: 'string', format: 'binary', name: 'witnesssig_image' })
    witnesssig_image: any;
    @ApiProperty({ type: ItemBypasssignature, description: `quotationid` })
    quotationid: ItemBypasssignature
}