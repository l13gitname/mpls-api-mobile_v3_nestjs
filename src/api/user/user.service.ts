import { AuthService } from 'src/auth/auth.service';
import { Injectable, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UtilityService } from 'src/utility/utility.service';
import { DbService } from 'src/db/db.service';
import oracledb, { BindParameter } from 'oracledb';

@Injectable()
export class UserService {

    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService,
        private authService: AuthService
    ) {

    }

    async login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        return await this.authService.loginget(req, res, next)
    }

    async findOneget(username: string, password: string) {
        return await this.authService.findOneget(username, password)
    }


    async findOnepost(username: string, password: string) {
        return await this.authService.findOnepost(username, password)
    }

    async validlogin(@Req() req: Request, @Res() res: Response) {
        return await this.authService.validlogin(req, res)
    }
}
