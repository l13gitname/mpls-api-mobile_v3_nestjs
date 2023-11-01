import { Controller, Get, Next, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FirstPartyApiMultipleService } from './first-party-api-multiple.service';
import { FilesUploadDtoMultiple } from './fileupload/p-fileupload-array.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { FileUploadDto } from '../dto/fileupload/p-fileupload.dto';

@Controller('first-party-api-multiple')
@Controller('first_party_api')
@ApiTags('first_party_api')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard)
// @UseInterceptors(FileInterceptor('image_file'))

/*.... user AnyFilesInterceptor for recieve file form-data multiple ....*/
@UseInterceptors(AnyFilesInterceptor())

export class FirstPartyApiMultipleController {

    constructor(
        private firstPartyApiMultipleService: FirstPartyApiMultipleService
    ) {
        
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file',
        type: FilesUploadDtoMultiple,
    })
    @Post('/MPLS_create_image_attach_file_party_multiple')
    async MPLS_create_image_attach_file_party(@UploadedFiles() image_file: Array<Express.Multer.File>, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        // console.log(file)
        (await this.firstPartyApiMultipleService.MPLS_create_image_attach_file_party_multiple(image_file, req, res, next)).subscribe({
            next: (data) => {
                return res.status(200).send(data)
            }, error: (e) => {

            }, complete: () => {
                return null
            }
        })
    }
}
