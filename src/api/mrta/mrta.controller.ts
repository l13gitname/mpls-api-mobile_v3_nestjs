import { Controller, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MrtaService } from './mrta.service';
import { Request, Response, NextFunction } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { PReqMplsCheckBusiCode } from './dto/p-req-mpls_check_busi_code';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { PReqSaveqrpayment } from './dto/p-req-saveqrpayment';
import { PReqGetdealersignimage } from '../image-handle/dto/p-req-getdealersignimage';
import { PReqGentotallosssqrpayment } from '../image-handle/dto/p-req-gentotallosssqrpayment';
import { PReqGenadvanceqrpayment } from './dto/p-req-genadvanceqrpayment';
import { PReqCheckmrtarecent } from './dto/p-req-checkmrtarecent';
import { PReqGetmastermrtainsurance } from './dto/p-req-getmastermrtainsurance';
import { PReqGenmrtaqr } from './dto/p-req-genmrtaqr';
import { PReqConfirmqrpayment } from './dto/p-req-confirmqrpayment';


@Controller('mrta')
@ApiTags('Mrta')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

export class MrtaController {

    constructor(
        private mrtaservice: MrtaService
    ) {

    }

    /* ... image-attach ... */
    @ApiBody({
        type: PReqMplsCheckBusiCode
    })
    @Post('/MPLS_check_busi_code')
    async MPLS_check_busi_code(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.mrtaservice.MPLS_check_busi_code(req, user, res, next)
    }

    /* ... send-car ... */

    @ApiBody({
        type: PReqSaveqrpayment
    })
    @Post('/saveqrpayment')
    async saveqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.mrtaservice.saveqrpayment(req, user, res, next)
    }

    @ApiBody({
        type: PReqGetdealersignimage
    })
    @Post('/getdealersignimage')
    async getdealersignimage(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.mrtaservice.getdealersignimage(req, user, res, next)
    }

    /* ... send-car, mrta-info ... */
    @ApiBody({
        type: PReqCheckmrtarecent
    })
    @Post('/checkmrtarecent')
    async checkmrtarecent(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.mrtaservice.checkmrtarecent(req, user, res, next)
    }

    /* ... send-car ==> app-mrta-product-new, product-detail ==> app-mrta-product-new ... */
    @ApiBody({
        type: PReqGetmastermrtainsurance
    })
    @Post('/getmastermrtainsurance')
    async getmastermrtainsurance(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

    }

    /* ... send-car ==> app-qr-barcode-mrta, mrta-info ==> app-qr-barcode-mrta ... */
    @ApiBody({
        type: PReqGenmrtaqr
    })
    @Post('/genmrtaqr')
    async genmrtaqr(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

    }

    /* ... send-car ==> app-qr-barcode-mrta ... */
    @ApiBody({
        type: PReqConfirmqrpayment
    })
    @Post('/confirmqrpayment')
    async confirmqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

    }

    /* ... send-car ==> app-advance-payment-qr-code ... */
    @ApiBody({
        type: PReqGenadvanceqrpayment
    })
    @Post('/genadvanceqrpayment')
    async genadvanceqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        this.mrtaservice.genadvanceqrpayment(req, user, res, next)
    }

    /* ... send-car ==> totalloss-QR ... */
    @ApiBody({
        type: PReqGentotallosssqrpayment
    })
    @Post('/gentotallossqrpayment')
    async gentotallossqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        this.mrtaservice.gentotallossqrpayment(req, user, res, next)
    }

}
