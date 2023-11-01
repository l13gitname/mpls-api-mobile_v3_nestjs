import { UtilityService } from 'src/utility/utility.service';
import { DbService } from './../../db/db.service';
import { Injectable, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';

@Injectable()
export class QuotationService {
    constructor(
        private dbconnect: DbService,
        private UtilService: UtilityService
    ) {

    }

    async getquotationbyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            let quotationid = req.params.id

            if (dbconnect) {

                if (dbconnect[0]) {

                    const resultbranch = await dbconnect[0].execute(`
                        sql
                    `, {}, { outFormat: 4002 })

                    if (resultbranch.rows.length == 0) {
                        return {
                            status: 500,
                            message: 'No contain data',
                            data: []
                        }
                    } else {
                        const resData = resultbranch.rows
                        const lowerResData = this.UtilService.loopObjtolowerkey(resData)
                        return res.status(200).send({
                            status: 200,
                            message: `success`,
                            data: lowerResData
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