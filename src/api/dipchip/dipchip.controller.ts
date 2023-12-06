import { Controller, Get, Next, Req, Res, UseGuards } from '@nestjs/common';
import { DipchipService } from './dipchip.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { NextFunction, Request, Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('Dipchip')
@Controller('dipchip')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

export class DipchipController {
    constructor(
        private dipchipService: DipchipService
    ) {

    }

    /* .... Dipchip Service ...*/

    @Get('/getdipchiptoken')
    async getdipchiptoken(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.dipchipService.getdipchiptoken(req, user, res, next)
    }
}
