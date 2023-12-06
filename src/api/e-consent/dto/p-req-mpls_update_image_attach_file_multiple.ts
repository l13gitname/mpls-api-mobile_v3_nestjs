import { ApiProperty } from "@nestjs/swagger";

export class ItemMplsUpdateImageAttachFileMultiple {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
    @ApiProperty({
        type: String, default: ``, description: `Image ID`
    })
    image_id: string
}

export class PReqMplsUpdateImageAttachFileMultiple {
    @ApiProperty({ type: 'string', format: 'binary', name: 'image_file' })
    image_file: any;
    @ApiProperty({ type: ItemMplsUpdateImageAttachFileMultiple, description: `item` })
    item: ItemMplsUpdateImageAttachFileMultiple
}