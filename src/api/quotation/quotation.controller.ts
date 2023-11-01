import { QuotationService } from './quotation.service';
import { Controller, Get, Next, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('Quotation')
@Controller('quotation')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

export class QuotationController {
    constructor(
        private quotationService: QuotationService
    ) {

    }

    @Get('/getquotationbyid')
    async getquotationbyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        return this.quotationService.getquotationbyid(req, user, res, next)
    }
}
