import { Controller, Next, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { PReqGetattachimagedeliverbyid } from './dto/p-req-getattachimagedeliverbyid';
import { PReqMplsCreateSendCarDeliverAndLoyaltyConsent } from './dto/p-req-mpls_create_send_car_deliver_and_loyalty_consent';
import { ApproveDeliverService } from './approve-deliver.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Approve-Deliver')
@Controller('approve-deliver')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AnyFilesInterceptor())

export class ApproveDeliverController {

    constructor(
        private approvedeliverService: ApproveDeliverService
    ) {

    }

    @ApiBody({
        type: PReqGetattachimagedeliverbyid
    })
    @Post('/getattachimagedeliverbyid')
    async getattachimagedeliverbyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.approvedeliverService.getattachimagedeliverbyid(req, user, res, next)
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: PReqMplsCreateSendCarDeliverAndLoyaltyConsent
    })
    @Post('/MPLS_create_send_car_deliver_and_loyalty_consent')
    async MPLS_create_send_car_deliver_and_loyalty_consent(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        this.approvedeliverService.MPLS_create_send_car_deliver_and_loyalty_consent(files, req, user, res, next)
    }


}
