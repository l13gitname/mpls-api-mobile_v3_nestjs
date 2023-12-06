import { Controller, Get, Next, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { CalculateService } from './calculate.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { PReqCalculateageDb } from './dto/p-req-calculateage_db.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Calculate')
@Controller('calculate')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AnyFilesInterceptor())

export class CalculateController {

    constructor(
        private calculateService: CalculateService
    ) { }

    @ApiBody({
        type: PReqCalculateageDb
    })
    @Post('/calculateage_db')
    async calculateage_db(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.calculateService.calculateage_db(req, user, res, next)
    }

    @ApiQuery({ name: 'birthdate', type: 'string', description: 'Birthdate String', example: '18/4/1994' })
    @Get('/getagefrombirthdate')
    async getagefrombirthdate(@Query('birthdate') birthdateparam: string, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.calculateService.getagefrombirthdate(birthdateparam, req, user, res, next)
    }
}
