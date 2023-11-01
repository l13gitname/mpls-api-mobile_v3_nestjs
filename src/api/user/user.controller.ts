import { UserService } from './user.service';
import { Controller, Get, Next, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import { LocalAuthGuard } from 'src/auth/local-auth/local-auth.guard';
import { PReqUser } from './dto/p-req-user.dto';
// import { LocalAuthGuard } from 'src/auth/local.auth.guard';


@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(
        private userService: UserService
    ) {

    }

    @UseGuards(LocalAuthGuard)
    @Get('/login')
    @ApiQuery({ name: 'username', type: 'string', description: 'Username of user (BTW db)', example: '10654004' })
    @ApiQuery({ name: 'password', type: 'string', description: 'Password of user (BTW db)', example: 'R@mire1994' })
    @ApiQuery({ name: 'channal', type: 'string', description: 'Channal type to login in system (checker: 1, FCR: 2, Store: 0)', example: '1' })
    async getbranch(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        return this.userService.login(req, res, next)
    }

    @ApiTags('User')
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: PReqUser })
    @Post('auth/login')
    async login(@Req() req: Request, @Res() res: Response) {
        return this.userService.validlogin(req, res)
    }
}
