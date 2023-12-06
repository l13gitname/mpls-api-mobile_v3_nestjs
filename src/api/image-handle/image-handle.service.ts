import { Injectable, Next, Req, Res } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { IReqGetdealersignimage } from 'src/interface/image-handle/getdealersignimage/i-req-getdealersignimage';
import { IExecGetdealersignimage } from 'src/interface/image-handle/getdealersignimage/i-exec-getdealersignimage.interface';
import { IResGetdealersignimage, IResGetdealersignimageData } from 'src/interface/image-handle/getdealersignimage/i-res-getdealersignimage.interface';
import { IReqGetsignimagebyid } from 'src/interface/image-handle/getsignimagebyid/i-req-getsignimagebyid';
import { IResGetsignimagebyid, IResGetsignimagebyidData } from 'src/interface/image-handle/getsignimagebyid/i-res-getsignimagebyid';
import { IReqGentotallossqrpayment } from 'src/interface/image-handle/gentotallossqrpayment/i-req-gentotallossqrpayment.interface';
import { IReqGenadvanceqrpayment } from 'src/interface/image-handle/genadvanceqrpayment/i-req-genadvanceqrpayment.interface';
import { IExecResultrefpayexec } from 'src/interface/image-handle/genadvanceqrpayment/i-exec-resultrefpayexec';
import { createCanvas, CanvasRenderingContext2D, Image, Canvas } from 'canvas';
import qrcode from 'qrcode'
import JsBarcode from 'jsbarcode';

@Injectable()
export class ImageHandleService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) { }


    /* ... bypass-signature ... */
    async getsignimagebyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqGetsignimagebyid

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* .... check parameter quotationid ... */

                    if (reqData.quotationid) {

                        try {

                            const getconsentrecordbyidexec = await dbconnect[0].execute(
                                `
                                    SELECT *
                                    FROM MPLS_CONSENT
                                    WHERE CONS_QUO_KEY_APP_ID = :quotationid
                                `, {
                                quotationid: reqData.quotationid
                            })

                            if (getconsentrecordbyidexec.rows.length == 1) {

                                const getconsentrecordbyid = this.utilService.loopObjtolowerkey(getconsentrecordbyidexec.rows) as [IResGetsignimagebyidData]

                                let resData = new Object as IResGetsignimagebyid
                                resData.data = getconsentrecordbyid
                                resData.status = 200
                                resData.message = `Success`

                                return res.status(200).send(resData)

                                /* ... Finish ... */

                            } else if (getconsentrecordbyidexec.rows.length == 0) {
                                return res.status(200).send({
                                    status: 500,
                                    message: `Not found consent record with this quotation`,
                                    data: []
                                })
                            } else {
                                return res.status(2000).send({
                                    status: 500,
                                    messge: `ไม่สามรถระบุรายการ MPLS_CONSENT ที่ผูกกับ quotation ได้ (Duplicate) : (rowsAffected : ${getconsentrecordbyidexec.rowsAffected ? getconsentrecordbyidexec.rowsAffected : '-'})`,
                                    data: []
                                })
                            }

                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                message: `Error during get execute mpls_consent : ${e.message ? e.message : 'no return msg'}`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `Not found parameter quotationid`,
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
