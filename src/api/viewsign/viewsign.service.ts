import { Injectable, Next, Req, Res } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { IReqViewsignimagebyid } from 'src/interface/viewsign/viewsignimagebyid/i-req-viewsignimagebyid';
import { IResViewsignimagebyid, IResViewsignimagebyidData } from 'src/interface/viewsign/viewsignimagebyid/i-res-viewsignimagebyid';
import { IReqVerifyviewsignimage } from 'src/interface/viewsign/verifyviewsignimage/i-req-verifyviewsignimage';

@Injectable()
export class ViewsignService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    async viewsignimagebyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqViewsignimagebyid

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check parameter quotationid contain ... */

                    if (reqData.quotationid) {


                        try {

                            const resultmplsconsentbyidexec = await dbconnect[0].execute(
                                `
                                    SELECT * FROM MPLS_CONSENT
                                    WHERE CONS_QUO_KEY_APP_ID = :quotationid
                                `,
                                {
                                    quotationid: reqData.quotationid
                                },
                                {
                                    outFormat: 4002,
                                })

                            if (resultmplsconsentbyidexec.rows.length == 1) {

                                const resultmplsconsentbyid = resultmplsconsentbyidexec.rows
                                const lowerResData = this.utilService.loopObjtolowerkey(resultmplsconsentbyid) as IResViewsignimagebyidData[]
                                let returnData = new Object as IResViewsignimagebyid
                                returnData.data = lowerResData
                                returnData.status = 200
                                returnData.message = `success`
                                return res.status(200).send(returnData)
                                /*.... Finish ...*/
                            } else {

                                return res.status(200).send({
                                    status: 500,
                                    message: `ไม่สามารถระบุรายการ MPLS_consent ได้ (rows : ${resultmplsconsentbyidexec.rows.length}`,
                                    data: []
                                })

                            }
                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                message: `Error when try to retrun data : ${e.message ? e.message : `no msg return`}`,
                                data: []
                            })
                        }



                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `ไม่พบ parameter quotationid`,
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

    async verifyviewsignimage(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqVerifyviewsignimage

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check parameter quotationid contain ... */

                    if (reqData.quotationid && userid) {


                        try {

                            /* ... Update consent verify status and userid ... */

                            const updateverifystatusexec = await dbconnect[0].execute(
                                `
                                    UPDATE MPLS_CONSENT
                                    SET VERIFY_STATUS = 1,
                                        VERIFY_DATETIME = SYSDATE,
                                        VERIFY_BY = :userid
                                    WHERE CONS_QUO_KEY_APP_ID = :quotationid
                                `,
                                {
                                    userid: userid,
                                    quotationid: reqData.quotationid
                                },
                                {
                                    outFormat: 4002,
                                })

                            if (updateverifystatusexec.rowsAffected == 1) {

                                return res.status(200).send({
                                    status: 200,
                                    message: `Update verify status success`,
                                    data: []
                                })

                                /*.... Finish ...*/
                            } else {

                                return res.status(200).send({
                                    status: 500,
                                    message: `ไม่สามารถอัพเดทสถานะการยืนยันลายเซ็นต์ได้ (rowsAffected : ${updateverifystatusexec.rowsAffected})`
                                })

                            }
                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                message: `Error when try to retrun data : ${e.message ? e.message : `no msg return`}`,
                                data: []
                            })
                        }



                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `ไม่พบ parameter quotationid หรือ userid (quotationid: ${reqData.quotationid}, userid : ${userid})`,
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

}
