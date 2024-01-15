import { Controller, Next, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express'
import { EConsentService } from './e-consent.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { PReqMplsCheckMotoYear } from './dto/p-req-mpls_check_moto_year.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PReqMplsGetimagefilebyid } from './dto/p-req-mpls_getimagefilebyid';
import { PReqMplsGetimageMultipleFilebyid } from './dto/p-req-mpls_getimage_multiple_filebyid';
import { PReqMplsCreateImageAttachFile } from './dto/p-req-mpls_create_image_attach_file';
import { PReqMplsCreateImageAttachFileMultiple } from './dto/p-req-mpls_create_image_attach_file_multiple';
import { PReqMplsUpdateImageAttachFileMultiple } from './dto/p-req-mpls_update_image_attach_file_multiple';
import { PReqMplsUpdateFlagImageAttachFile } from './dto/p-req-mpls_update_flag_image_attach_file';
import { PReqMplsUpdateFlagImageAttachFileMultiple } from './dto/p-req-mpls_update_flag_image_attach_file_multiple';
import { PReqMplsGetimageMultipleFilebyappid } from './dto/p-req-mpls_getimage_multiple_filebyappid';

@ApiTags('E-consent')
@Controller('e-consent')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AnyFilesInterceptor())

export class EConsentController {

    constructor(
        private econsentService: EConsentService
    ) {

    }

    /* ...  E-cosnent Controller ... */

    /* ... quotation-detail ...*/

    @ApiBody({
        type: PReqMplsCheckMotoYear
    })
    @Post('/MPLS_check_moto_year')
    async MPLS_check_moto_year(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_check_moto_year(req, user, res, next)
    }

    /*... image-attach page ...*/
    @ApiBody({
        type: PReqMplsGetimagefilebyid
    })
    @Post('/MPLS_getimagefilebyid')
    async MPLS_getimagefilebyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_getimagefilebyid(req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsGetimageMultipleFilebyid
    })
    @Post('/MPLS_getimage_multiple_filebyid')
    async MPLS_getimage_multiple_filebyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_getimage_multiple_filebyid(req, user, res, next)
    }


    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file',
        type: PReqMplsCreateImageAttachFile,
    })
    @Post('/MPLS_create_image_attach_file')
    async MPLS_create_image_attach_file(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_create_image_attach_file(files, req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsCreateImageAttachFileMultiple
    })
    @Post('/MPLS_create_image_attach_file_multiple')
    async MPLS_create_image_attach_file_multiple(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_create_image_attach_file_multiple(files, req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsUpdateImageAttachFileMultiple
    })
    @Post('/MPLS_update_image_attach_file_multiple')
    async MPLS_update_image_attach_file_multiple(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_update_image_attach_file_multiple(files, req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsUpdateFlagImageAttachFile
    })
    @Post('/MPLS_update_flag_image_attach_file')
    async MPLS_update_flag_image_attach_file(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_update_flag_image_attach_file(req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsUpdateFlagImageAttachFileMultiple
    })
    @Post('/MPLS_update_flag_image_attach_file_multiple')
    async MPLS_update_flag_image_attach_file_multiple(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.econsentService.MPLS_update_flag_image_attach_file_multiple(req, user, res, next)
    }

    /* ... view-car-attach ... */
    @ApiBody({
        type: PReqMplsGetimageMultipleFilebyappid
    })
    @Post('/MPLS_getimage_multiple_filebyappid')
    async MPLS_getimage_multiple_filebyappid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

    }
}
