import { Injectable, Next, Query, Req, Res } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { IReqCalculateageDb } from 'src/interface/calculate/calculateage_db/i-req-calculateage_db.interface';
import { IExecDateformat } from 'src/interface/calculate/calculateage_db/i-exec-dateformat.interface';
import { IExecResultage } from 'src/interface/calculate/calculateage_db/i-exec-resultage';

@Injectable()
export class CalculateService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }


    /* .... Calculate Part Service ... */

    async calculateage_db(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqCalculateageDb

            if (dbconnect) {

                if (dbconnect[0]) {

                    try {

                        const dateformatexec = await dbconnect[0].execute(
                            `
                                SELECT BTW.BUDDHIST_TO_CHRIS_F(TO_DATE(:birthdate, 'dd/mm/yyyy')) AS DATE_C 
                                FROM DUAL 
                            `, {
                            birthdate: reqData.birthdate
                        }, {
                            outFormat: 4002,
                        })

                        if (dateformatexec.rows.length !== 0) {

                            const dateformat = this.utilService.toLowerKeys(dateformatexec.rows[0]) as IExecDateformat

                            /* .... calculate age in database ...*/
                            const date_str = dateformat.date_c
                            const resultageexec = await dbconnect[0].execute(
                                `
                                    SELECT BTW.F_CALCULATE_AGE(:birthdate , sysdate) AS AGE_YEAR 
                                    FROM DUAL
                                `, {
                                birthdate: date_str
                            }, {
                                outFormat: 4002
                            })

                            if (resultageexec.rows.length !== 0) {

                                const resData = this.utilService.loopObjtolowerkey(resultageexec.rows) as [IExecResultage]
                                resData.forEach(u => u.age_year *= 1)
                                return res.status(200).send({
                                    status: 200,
                                    message: `success`,
                                    data: resData
                                })

                                /* ... Finish ... */
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: 'No age return',
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                mesage: `ไม่สามารถแปลงค่า format date ได้`,
                                data: []
                            })
                        }
                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            mesage: `Fail to execute : ${e.message ? e.message : `No return msg`}`,
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

    async getagefrombirthdate(@Query('birthdate') birthdateparam: string, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const birthdate = birthdateparam

            if (dbconnect) {

                if (dbconnect[0]) {

                    const resultsofsomeexc = await dbconnect[0].execute(
                        `
                            SELECT TO_NUMBER(TO_CHAR(SYSDATE ,'yyyy')) - TO_NUMBER(TO_CHAR(BTW.BUDDHIST_TO_CHRIS_F(TO_DATE(:birthdate, 'dd/mm/yyyy')),'yyyy')) AGE_YEAR 
                            FROM DUAL 
                        `, {
                        birthdate: birthdate
                    }, {
                        outFormat: 4002,
                    })

                    if (resultsofsomeexc.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'No record found',
                            data: []
                        })
                    } else {

                        let resQueryresult = resultsofsomeexc
                        let resData = resQueryresult.rows as any[]
                        const lowerResData = this.utilService.loopObjtolowerkey(resData) as any[]


                        try {
                            /*.... finish ...*/
                            return res.status(200).json({
                                status: 200,
                                message: `success`,
                                data: lowerResData
                            })
                            // === api process finish (success) === 
                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                message: `Error when try to retrun data : ${e.message ? e.message : `no msg return`}`,
                                data: []
                            })
                        }

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
