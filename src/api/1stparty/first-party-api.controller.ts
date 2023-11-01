import { Controller, UseGuards, UseInterceptors, Post, UploadedFile, UploadedFiles } from '@nestjs/common';
import { Next, Req, Res } from '@nestjs/common/decorators/http/route-params.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { PReqDipchGetDipchipInfo } from './dto/p-req-dipch-get-dipchip-info.dto';
import { FirstPartyApiService } from './first-party-api.service';
import { PReqMplsCreateImageAttachFileParty, IReqMplsCreateImageAttachFileParty } from './dto/p-req-mpls-create-image-attach-file-party.interface';
import { FileUploadDto } from './dto/fileupload/p-fileupload.dto';
import { diskStorage } from 'multer';

@Controller('first_party_api')
@ApiTags('first_party_api')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard)
@UseInterceptors(FileInterceptor('file'))

export class FirstPartyApiController {


    constructor(private firstPartyApiService: FirstPartyApiService) { }

    @ApiBody({ type: PReqDipchGetDipchipInfo })
    @Post('/MPLS_DIPCH_get_dipchip_info')
    async MPLS_DIPCH_get_dipchip_info(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        this.firstPartyApiService.MPLS_DIPCH_get_dipchip_info().subscribe({
            next: (data) => {
                return res.status(200).send(data);
            }, error: (e) => {
                return res.status(200).send({
                    status: 500,
                    message: `Error : ${e.message ? e.message : 'No return message'}`,
                    data: []
                });
            }, complete: () => {
                // console.log(`complete MPLS_DIPCH_get_dipchip_info !`)
            }
        })
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file',
        type: FileUploadDto,
    })
    @Post('/MPLS_create_image_attach_file_party')
    async MPLS_create_image_attach_file_party(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        // console.log(file)
        (await this.firstPartyApiService.MPLS_create_image_attach_file_party(file, req, res, next)).subscribe({
            next: (data) => {
                return res.status(200).send(data)
            }, error: (e) => {

            }, complete: () => {
                return null
            }
        })
    }
}
