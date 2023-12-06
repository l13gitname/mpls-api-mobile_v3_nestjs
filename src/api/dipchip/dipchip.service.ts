import { Injectable, Next, Req, Res } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { NextFunction, Request, Response } from 'express';
import { IExecGettoken } from 'src/interface/dipchip/i-exec-gettoken.interface';

@Injectable()
export class DipchipService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    /* ... just only getdipchiptoken other api on client ... */

    async getdipchiptoken(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role

            if (dbconnect) {

                /* ... Check User ID from jwt ... */
                if (userid) {
                    if (dbconnect[0]) {

                        const gettokenexec = await dbconnect[0].execute(
                            `
                                SELECT USERID , TOKEN_KEY
                                FROM BTW.USERS
                                WHERE USERID = :USERID
                            `, {
                        }, {
                            outFormat: 4002,
                        })

                        const checkcounttoken = this.utilService.loopObjtolowerkey(gettokenexec.rows) as [IExecGettoken]

                        if (checkcounttoken.length == 1) {

                            return res.status(200).send({
                                status: 200,
                                message: `Success`,
                                data: checkcounttoken
                            })
                        } else {

                            if (checkcounttoken.length > 1) {
                                return res.status(400).send({
                                    status: 400,
                                    message: `DUPLICATE USERID (DB)`
                                })
                            } else {
                                return res.status(400).send({
                                    status: 400,
                                    message: `ไม่พบ USERID (DB)`
                                })
                            }
                        }

                        /* ... END 1 ... */
                    } else {
                        if (dbconnect[1]) {
                            const errRes = dbconnect[1]
                            return res.status(200).send({
                                status: 500,
                                message: `${errRes.message ? errRes.message : 'FAIL : No return msg form basicexe'}`,
                                data: []
                            })
                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `FAIL : no error return from oracle`,
                                data: []
                            })
                        }
                    }
                    /* ... End ... */
                } else {
                    return res.status(400).send({
                        status: 400,
                        message: `ไม่พบเลข USERID (TOKEN)`,
                        data: []
                    })
                }
            } else {
                return res.status(200).send({
                    status: 500,
                    message: `FAIL : No return msg`,
                    data: []
                })
            }
        } catch (e) {
            return res.status(200).send({
                status: 500,
                data: `Error with message : ${e.message ? e.message : `No message`}`
            })
        } finally {
            if (dbconnect[0]) {
                try {
                    await dbconnect[0].close();
                } catch (e) {
                    return next(e);
                }
            }
        }
    }
}
