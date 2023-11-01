import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger";
import { FileUploadDto } from "./fileupload/p-fileupload.dto";
import { FileInterceptor } from "@nestjs/platform-express/multer";

export interface IReqMplsCreateImageAttachFileParty {
    quotationid: string
    image_code: string
    image_name: string
}

export class IReqMplsCreateImageAttachFileParty {
    @ApiProperty({
        default: 'b5dfa9a7-1392-4d84-a874-ee08818e4880'
    })
    quotationid: string;

    @ApiProperty({
        default: '16'
    })
    image_code: string;

    @ApiProperty({
        default: 'kyc_image'
    })
    image_name: string;
}


export class PReqMplsCreateImageAttachFileParty {
    
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    // @ApiBody(
    //     {
    //         type: IReqMplsCreateImageAttachFileParty
    //     }
    // )
    @ApiBody(
        {
            description: 'image upload',
            type: FileUploadDto,
        }
    )
    uploadFile(@UploadedFile() image_file) { }
}