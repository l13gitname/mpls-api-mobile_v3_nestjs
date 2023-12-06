import { Controller, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { PReqSendsmsconfirmpayment } from './dto/p-req-sendsmsconfirmpayment';
import { PReqTestsmsservice } from './dto/p-req-testsmsservice';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@Controller('sms')
@ApiTags('SMS')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

export class SmsController {

    constructor(
        private smsService: SmsService
    ) { }


    @ApiBody({
        type: PReqTestsmsservice
    })
    @Post('/testsmsservice')
    async testsmsservice(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.smsService.testsmsservice(req, user, res, next)
    }

    @ApiBody({
        type: PReqSendsmsconfirmpayment
    })
    @Post('/sendsmsconfirmpayment')
    async sendsmsconfirmpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.smsService.sendsmsconfirmpayment(req, user, res, next)
    }
}
