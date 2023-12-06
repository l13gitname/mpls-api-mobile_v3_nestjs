
import { ApiProperty } from "@nestjs/swagger";

export class ItemMplsCreateImageAttachFile {
    @ApiProperty({
        type: String, default: ``, description: `Quotation ID`
    })
    quotationid: string
    @ApiProperty({
        type: String, default: ``, description: `Image Code`
    })
    image_code: string
    @ApiProperty({
        type: String, default: ``, description: `Image Name`
    })
    image_name: string

}

export class PReqMplsCreateImageAttachFile {
    @ApiProperty({ type: 'string', format: 'binary', name: 'image_file' })
    image_file: any;
    @ApiProperty({ type: ItemMplsCreateImageAttachFile, description: `item` })
    item: ItemMplsCreateImageAttachFile
}