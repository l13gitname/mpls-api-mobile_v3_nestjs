import { Controller, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ImageHandleService } from './image-handle.service';
import { PReqGetdealersignimage } from './dto/p-req-getdealersignimage';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { PReqGetsignimagebyid } from './dto/p-req-getsignimagebyid';
import { PReqGentotallosssqrpayment } from './dto/p-req-gentotallosssqrpayment';

@Controller('image-handle')
@ApiTags('Image-handle')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

export class ImageHandleController {
    constructor(
        private imageService: ImageHandleService
    ) { }


    /* ... *** getDealerSignaturebyid change into getdealersignimage and move in mrta module *** ... */
    /* ... getUrlImage function in avalible in client ... */

    /* ... bypass-signature ... */
    @ApiBody({
        type: PReqGetsignimagebyid
    })
    @Post('/getsignimagebyid')
    async getsignimagebyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        this.imageService.getsignimagebyid(req, user, res, next)
    }
}
