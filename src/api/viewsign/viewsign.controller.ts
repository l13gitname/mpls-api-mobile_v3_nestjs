import { Controller, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ViewsignService } from './viewsign.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { PReqGetviewsignimage } from './dto/p-req-getviewsignimage';
import { PReqVerifyviewsignimage } from './dto/p-req-verifyviewsignimage';

@Controller('viewsign')
@ApiTags('viewsign')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ViewsignController {
    constructor(
        private viewsignService: ViewsignService
    ) {

    }

    /* ... viewsign page ... */

    @ApiBody({
        type: PReqGetviewsignimage
    })
    @Post('/viewsignimagebyid')
    async getviewsignimage(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.viewsignService.viewsignimagebyid(req, user, res, next)
    }


    @ApiBody({
        type: PReqVerifyviewsignimage
    })
    @Post('/verifyviewsignimage')
    async verifyviewsignimage(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.viewsignService.verifyviewsignimage(req, user, res, next)
    }

}
