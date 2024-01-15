import { Controller, Get, Next, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { PReqCheckrolemenu } from './dto/p-req-checkrolemenu';

@Controller('permission')
@ApiTags('permission')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)

export class PermissionController {
    constructor(
        private permissionService: PermissionService
    ) {

    }

    /* ... check permission of user each page by menu_id in oracle ... */
    
    @ApiBody({
        type: PReqCheckrolemenu
    })
    @Post('/checkrolemenu')
    async checkrolemenu(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        this.permissionService.checkrolemenu(req, user, res, next)
    }
}
