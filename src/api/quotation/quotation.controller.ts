import { QuotationService } from './quotation.service';
import { Body, Controller, Get, Next, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { PReqGetquotationbyid } from './dto/p-req-getquotationbyid.dto';
import { PReqGetquotationlist } from './dto/p-req-getquotationlist.dto';
import { PReqMplsCanclequotation } from './dto/p-req-mpls_canclequotation.dto';
import { PReqGetDopaValidStatus } from './dto/p-req-get_dopa_valid_status.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PReqMplsDipchip } from './dto/p-req-mpls_dipchip.dto';
import { PReqMplsDipchipnoneconsent } from './dto/p-req-mpls_dipchipnoneconsent.dto';
import { PReqMplsCreateOrUpdateCitizendata } from './dto/p-req-mpls_create_or_update_citizendata.dto';
import { PReqMplsUpdatePhoneNumber } from './dto/p-req-mpls_update_phone_number.dto';
import { PReqMplsCheckSecondhandCarImageAttach } from './dto/p-req-mpls_check_secondhand_car_image_attach.dto';
import { PReqMplsCreateOrUpdateCredit } from './dto/p-req-mpls_create_or_update_credit.dto';
import { PReqMplsCheckApplicationNo } from './dto/p-req-mpls_check_application_no.dto';
import { PReqMplsValidationOtpEconsentNon } from './dto/p-req-mpls_validation_otp_econsent_non.dto';
import { PReqMplsCreateConsent } from './dto/p-req-mpls_create_consent.dto';

@ApiTags('Quotation')
@Controller('quotation')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AnyFilesInterceptor())

export class QuotationController {
    constructor(
        private quotationService: QuotationService
    ) {

    }

    /* ... quotation-view-page ...*/

    @Post('/getquotationlist')
    @ApiBody({ type: PReqGetquotationlist })
    async getquotationlist(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.getquotationlist(req, user, res, next)
    }

    @Post('/MPLS_canclequotation')
    @ApiBody({ type: PReqMplsCanclequotation })
    async MPLS_canclequotation(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_canclequotation(req, user, res, next)
    }

    /* ... quotation-detail-page ...*/

    @Post('/getquotationbyid')
    @ApiBody({ type: PReqGetquotationbyid })
    async getquotationbyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.getquotationbyid(req, user, res, next)
    }

    @Post('/MPLS_get_dopa_valid_status')
    @ApiBody({ type: PReqGetDopaValidStatus })
    async MPLS_get_dopa_valid_status(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_get_dopa_valid_status(req, user, res, next)
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file',
        type: PReqMplsDipchip,
    })
    @Post('/MPLS_dipchip')
    async MPLS_dipchip(@UploadedFiles() files: { image_file?: Array<Express.Multer.File> }, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_dipchip(files, req, user, res, next)
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image file',
        type: PReqMplsDipchipnoneconsent,
    })
    @Post('/MPLS_dipchipnoneconsent')
    async getbranch(@UploadedFiles() files: { image_file?: Array<Express.Multer.File> }, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_dipchipnoneconsent(files, req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsCreateOrUpdateCitizendata
    })
    @Post('/MPLS_create_or_update_citizendata')
    async MPLS_create_or_update_citizendata(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_create_or_update_citizendata(req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsUpdatePhoneNumber
    })
    @Post('/MPLS_update_phone_number')
    async MPLS_update_phone_number(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_update_phone_number(req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsCheckSecondhandCarImageAttach
    })
    @Post('/MPLS_check_secondhand_car_image_attach')
    async MPLS_check_secondhand_car_image_attach(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_check_secondhand_car_image_attach(req, user, res, next)
    }


    @ApiBody({
        type: PReqMplsCreateOrUpdateCredit
    })
    @Post('/MPLS_create_or_update_credit')
    async MPLS_create_or_update_credit(@UploadedFiles() files: { image_file?: Array<Express.Multer.File> }, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_create_or_update_credit(files, req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsCheckApplicationNo
    })
    @Post('/MPLS_check_application_no')
    async MPLS_check_application_no(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

    }

    @Get('/MPLS_getservertime')
    async MPLS_getservertime(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_getservertime(req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsValidationOtpEconsentNon
    })
    @Post('/MPLS_validation_otp_econsent_non')
    async MPLS_validation_otp_econsent_non(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_validation_otp_econsent_non(req, user, res, next)
    }

    @ApiBody({
        type: PReqMplsCreateOrUpdateCredit
    })
    @Post('/MPLS_create_or_update_careerandpurpose')
    async MPLS_create_or_update_careerandpurpose(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_create_or_update_careerandpurpose(req, user, res, next)
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'item file',
        type: PReqMplsCreateConsent,
    })
    @Post('/MPLS_create_consent')
    async MPLS_create_consent(@UploadedFiles() files: Array<Express.Multer.File> , @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.MPLS_create_consent(files, req, user, res, next)
    }



}
