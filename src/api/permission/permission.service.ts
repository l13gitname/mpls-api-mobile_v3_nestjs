import { Injectable, Next, Req, Res } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { IReqCheckrolemenu } from 'src/interface/permission/checkrolemenu/i-req-checkrolemenu';
import { IResCheckrolemenu, IResCheckrolemenuData } from 'src/interface/permission/checkrolemenu/i-res-checkrolemenu';

@Injectable()
export class PermissionService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    /* ... check permission of user each page by menu_id in oracle ... */
    
    async checkrolemenu(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqCheckrolemenu
            if (dbconnect) {

                /* ... check parameter menu_id ... */
                if (reqData.menu_id) {

                    if (dbconnect[0]) {

                        const resultpermissioncheckexec = await dbconnect[0].execute(
                            `
                                SELECT XMC.AU_OPEN AS ROLE FROM
                                BTW.USERS URS
                                LEFT JOIN BTW.X_MENU_CONTROL_U XMC
                                ON URS.USERNAME = XMC.USER_NAME
                                WHERE URS.USERNAME = :userid
                                AND XMC.MENU_ID = :menu_id
                            `,
                            {
                                userid: userid,
                                menu_id: reqData.menu_id
                            },
                            {
                                outFormat: 4002,
                            })

                        if (resultpermissioncheckexec.rows.length !== 0) {

                            const resultpermissioncheck = this.utilService.loopObjtolowerkey(resultpermissioncheckexec.rows) as IResCheckrolemenuData[]

                            const rolemenu = resultpermissioncheck[0]

                            if (rolemenu.role) {

                                if (rolemenu.role == 'Y') {

                                    /* ... have permission on page (menu_id page) ... */

                                    let returnData = new Object as IResCheckrolemenu
                                    returnData.data = resultpermissioncheck
                                    returnData.status = 200
                                    returnData.message = `Success`

                                    return res.status(200).send(returnData)

                                    /* ... Finish ... */

                                } else {
                                    return res.status(200).send({
                                        status: 400,
                                        message: `No premission (no premission allow)`,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `No premission on page "${reqData.menu_id ?? '-'}" (no premission allow)`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `No premission on page "${reqData.menu_id ?? '-'}" (no premission allow)`,
                                data: []
                            })
                        }

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
                } else {
                    return res.status(200).send({
                        status: 500,
                        message: `ไม่พบ parameter menu_id หรือ userid ไม่มี (menu_id : ${reqData.menu_id ?? '-'}, userid: ${userid ?? '-'})`,
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
