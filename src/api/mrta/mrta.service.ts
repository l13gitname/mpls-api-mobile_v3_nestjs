import { Injectable, Next, Req, Res } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import * as oracledb from 'oracledb';
import { createCanvas, CanvasRenderingContext2D, Image, Canvas } from 'canvas';
import * as qrcode from 'qrcode'
// import JsBarcode from 'jsbarcode';
import * as JsBarcode from 'JsBarcode'
import { IReqSaveqrpayment } from 'src/interface/mrta/saveqrpayment/i-req-saveqrpayment';
import { IExecResultRefpay } from 'src/interface/mrta/saveqrpayment/i-exec-result-refpay.interface';
import { IExecResutlcheckquotation } from 'src/interface/mrta/saveqrpayment/i-exec-resutlcheckquotation';
import { IReqGentotallossqrpayment } from 'src/interface/image-handle/gentotallossqrpayment/i-req-gentotallossqrpayment.interface';
import { IReqGetdealersignimage } from 'src/interface/image-handle/getdealersignimage/i-req-getdealersignimage';
import { IResGetdealersignimage, IResGetdealersignimageData } from 'src/interface/image-handle/getdealersignimage/i-res-getdealersignimage.interface';
import { IReqGenadvanceqrpayment } from 'src/interface/image-handle/genadvanceqrpayment/i-req-genadvanceqrpayment.interface';
import { IExecResultrefpayexec } from 'src/interface/image-handle/genadvanceqrpayment/i-exec-resultrefpayexec';
import { IReqCheckmrtarecent } from 'src/interface/mrta/checkmrtarecent/i-req-checkmrtarecent.interface';
import { IResChekmrtarecent, IResChekmrtarecentData } from 'src/interface/mrta/checkmrtarecent/i-res--chekmrtarecent.interface';
import { IReqGetmastermrtainsurance } from 'src/interface/mrta/getmastermrtainsurance/i-req-getmastermrtainsurance.interface';
import { IResGetmastermrtainsuranceData } from 'src/interface/mrta/getmastermrtainsurance/i-res-getmastermrtainsurance.interface';
import { IReqGenmrtaqr } from 'src/interface/mrta/genmrtaqr/i-req-genmrtaqr.interface';
import { IExecCheckrefpaynum } from 'src/interface/mrta/genmrtaqr/i-exec-checkrefpaynum.interface';
import { IReqConfirmqrpayment } from 'src/interface/mrta/confirmqrpayment/i-req-confirmqrpayment';
import { IExecPaymentrecord } from 'src/interface/mrta/confirmqrpayment/i-exec-paymentrecord.interface';
import { IExecXcustmappingterm } from 'src/interface/mrta/confirmqrpayment/i-exec-xcustmappingterm.interface';
import { IExecUpdatepaymentstatus } from 'src/interface/mrta/confirmqrpayment/i-exec-updatepaymentstatus.interface';
import { IResConfirmqrpayment, IResConfirmqrpaymentData } from 'src/interface/mrta/confirmqrpayment/i-res-confirmqrpayment.interface';
import { IReqSearchmrta } from 'src/interface/mrta/searchmrta/i-req-searchmrta';
import { IExecMrtacount } from 'src/interface/mrta/searchmrta/i-exec-mrtacount';
import { IResSearchmrta, IResSearchmrtaData } from 'src/interface/mrta/searchmrta/i-res-searchmrta';
import { IResGentotallossqrpayment, IResGentotallossqrpaymentData } from 'src/interface/mrta/gentotallossqrpayment/i-res-gentotallossqrpayment';
import { IReqMrtainfobyid } from 'src/interface/mrta/mrtainfobyid/i-req-mrtainfobyid';
import { IResMrtainfobyid, IResMrtainfobyidData } from 'src/interface/mrta/mrtainfobyid/i-res-mrtainfobyid.interface';
import { IReqMastermrta } from 'src/interface/mrta/mastermrta/i-req-mastermrta.interface';
import { IResMastermrta, IResMastermrtaData } from 'src/interface/mrta/mastermrta/i-res-mastermrta.interface';
import { IReqCalculatemrtaage } from 'src/interface/mrta/calculatemrtaage/i-req-calculatemrtaage';
import { IResCalculatemrtaageData } from 'src/interface/mrta/calculatemrtaage/i-res-calculatemrtaage';

@Injectable()
export class MrtaService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    /* ... image-attach ... */
    async MPLS_check_busi_code(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body

            if (dbconnect) {

                if (dbconnect[0]) {

                    const resultsofsomeexc = await dbconnect[0].execute(
                        `
                            SELECT BUSSINESS_CODE 
                            FROM MPLS_CREDIT
                            WHERE CRE_QUO_KEY_APP_ID = :QUOTATION_ID    
                        `, {
                        QUOTATION_ID: reqData.quotation_id
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
                            return res.status(200).send({
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

    /* ... send-car ... */
    async saveqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqSaveqrpayment

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* .... check parameter all ... */

                    if (reqData.quotationid && reqData.application_num && reqData.insurance_code &&
                        reqData.insurance_year && reqData.insurer_code && reqData.insurance_seller &&
                        reqData.premium_mrta && reqData.out_stand && reqData.gender && reqData.age &&
                        userid) {

                        /* ... check ref pay num contain ... */

                        const resultREFpayexec = await dbconnect[0].execute(
                            `
                                SELECT REF_PAY_NUM 
                                FROM BTW.X_CUST_MAPPING_EXT
                                WHERE APPLICATION_NUM = :APPLICATION_NUM
                            `,
                            {
                                APPLICATION_NUM: reqData.application_num
                            },
                            {
                                outFormat: 4002,
                            })

                        if (resultREFpayexec.rows.length == 1) {

                            /* ... Use REFPAYVALUE to GEN QR Image ... */

                            const refpaynumvalue = this.utilService.toLowerKeys(resultREFpayexec.rows) as IExecResultRefpay

                            try {
                                const resData = refpaynumvalue
                                const refpay = resData.ref_pay_num
                                const billerid = process.env.BILLER_ID
                                let char13 = String.fromCharCode(13)
                                const billpaymentformat = `${billerid}${char13}20${refpay}${char13}${char13}${reqData.premium_mrta}00`;

                                const width = 800;
                                const height = 600;
                                const canvas: Canvas = createCanvas(width, height)
                                JsBarcode(canvas, billpaymentformat, {
                                    width: 1,
                                    height: 50,
                                    fontSize: 10,
                                    displayValue: false,
                                    margin: 0
                                });

                                const resultimgqr = await qrcode.toBuffer(billpaymentformat, {
                                    margin: 0,
                                    type: 'png',
                                    scale: 5
                                });

                                // ... (omitting the unchanged code)

                                try {
                                    // === check mrta (INSERT/UPDATE) ====
                                    const resultcheckquotationexec = await dbconnect[0].execute(
                                        `
                                            SELECT QUO.QUO_KEY_APP_ID , ACTIVE_STATUS, QUOTATION_ID, PAY_STATUS
                                            FROM MPLS_QUOTATION QUO
                                            LEFT JOIN CONTRACT_INSURANCE CI
                                            ON QUO.QUO_KEY_APP_ID = CI.QUOTATION_ID
                                            WHERE QUO.QUO_KEY_APP_ID  = :quotationid
                                        `,
                                        {
                                            quotationid: reqData.quotationid
                                        },
                                        {
                                            outFormat: 4002
                                        }
                                    );

                                    if (resultcheckquotationexec.rows.length == 1) {

                                        const resultcheckquotation = this.utilService.toLowerKeys(resultcheckquotationexec.rows[0]) as IExecResutlcheckquotation

                                        const mrtapaystatus = resultcheckquotation.pay_status;

                                        if (mrtapaystatus !== 1) {
                                            // === check mrta (INSERT/UPDATE) ====
                                            const mrtarecent = resultcheckquotation.quotation_id;

                                            if (!mrtarecent) {
                                                // === insert ===
                                                await this.insertMRTARecord(dbconnect[0], userid, reqData, res, billpaymentformat, resData, canvas, resultimgqr);
                                            } else {
                                                // === update ===
                                                await this.updateMRTARecord(dbconnect[0], userid, reqData, res, billpaymentformat, resData, canvas, resultimgqr);
                                            }
                                        } else {
                                            return this.handleError(res, 500, 'QR Code payment is already pay');
                                        }

                                    } else if (resultcheckquotationexec.rows.length == 0) {
                                        return this.handleError(res, 500, 'ไม่พบเลข quot ation');
                                    } else {
                                        return this.handleError(res, 500, `ไม่สามรถระบุรายการ mplq_quotation ได้ (${resultcheckquotationexec.rowsAffected ? resultcheckquotationexec.rowsAffected : '-'})`);
                                    }
                                } catch (e) {
                                    return this.handleError(res, 500, `fail to check/update MRTA record: ${e}`);
                                }
                            } catch (e) {
                                return this.handleError(res, 400, `Error in processing: ${e}`);
                            }

                        } else if (resultREFpayexec.rows.length == 0) {
                            return res.status(200).send({
                                status: 500,
                                mesage: `ไม่พบเลข Reference Payment`,
                                data: []
                            })
                        } else {
                            return res.status(200).send({
                                status: 500,
                                mesage: `Can't Identity REF Payment (rowsAffected  : ${resultREFpayexec.rowsAffected})`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `missing parameters argument`,
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

    /* ... send-car ... */
    async getdealersignimage(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqGetdealersignimage

            if (dbconnect) {

                if (dbconnect[0]) {

                    try {
                        /* ... check quotationid image ... */
                        if (reqData.quotationid) {

                            /* ... get image from database (mpls_image_file) ... */
                            const imagedealerexec = await dbconnect[0].execute(
                                `
                                        SELECT *
                                        FROM MPLS_IMAGE_FILE
                                        WHERE IMGF_QUO_APP_KEY_ID = :quotationid
                                        AND IMAGE_CODE = '14'
                                    `,
                                {
                                    quotationid: reqData.quotationid
                                }
                            )

                            if (imagedealerexec.rows.length !== 0) {

                                try {

                                    /* ... success and return data ... */
                                    const imagedealer = this.utilService.loopObjtolowerkey(imagedealerexec.rows) as [IResGetdealersignimageData]

                                    let returnData = new Object as IResGetdealersignimage;
                                    returnData.data = imagedealer
                                    returnData.status = 200
                                    returnData.message = `Success`

                                    return res.status(200).send(returnData)

                                    /* ... Finish ... */

                                } catch (e) {
                                    return res.status(201).send({
                                        status: 201,
                                        message: '`Error during build object response data.',
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(201).send({
                                    status: 201,
                                    message: `No image File Found`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: 'Not found quotationid parameter',
                                data: []
                            })
                        }
                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            message: `Error during execute sql get image dealer : ${e.message ? e.message : `No return msg`}`,
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

    /* ... send-car, mrta-info ... */
    async checkmrtarecent(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqCheckmrtarecent

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check paramter quotationid ... */

                    if (reqData.quotationid) {

                        try {

                            const checkactivestatusmrtarecentexec = await dbconnect[0].execute(
                                `
                                    SELECT QUO.QUO_KEY_APP_ID , ACTIVE_STATUS
                                    FROM MPLS_QUOTATION QUO
                                    LEFT JOIN CONTRACT_INSURANCE CI
                                    ON QUO.QUO_KEY_APP_ID = CI.QUOTATION_ID
                                    WHERE QUO.QUO_KEY_APP_ID  = :quotationid
                                `, {
                                quotationid: reqData.quotationid
                            }, {
                                outFormat: 4002
                            })

                            /* ... should not found no quotation record (normally check on client) ... */
                            if (checkactivestatusmrtarecentexec.rows.length == 1) {

                                try {

                                    const getcontractinsurancemrtarecentexec = await dbconnect[0].execute(
                                        `
                                            SELECT * FROM CONTRACT_INSURANCE
                                            WHERE QUOTATION_ID = :quotationid
                                        `, {
                                        quotationid: reqData.quotationid
                                    }, {
                                        outFormat: 4002
                                    })

                                    if (getcontractinsurancemrtarecentexec.rows.length == 1) {

                                        /* .... Success ... */
                                        const getcontractinsurancemrtarecent = this.utilService.toLowerKeys(getcontractinsurancemrtarecentexec.rows[0]) as IResChekmrtarecentData
                                        const returnData = new Object as IResChekmrtarecent
                                        returnData.data = [getcontractinsurancemrtarecent]
                                        returnData.status = 200
                                        returnData.message = `Success`

                                        return res.status(200).send(returnData)

                                        /* ... Finish ... */

                                    } else if (getcontractinsurancemrtarecentexec.rows.length == 0) {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ไม่พบรายการ MRTA record`,
                                            data: []
                                        })
                                    } else {
                                        /* ... add-on check from nodejs version (check duplicate)... */
                                        return res.status(200).send({
                                            sattus: 500,
                                            messag: `Can't Identify CONTRACT_INSURANCE recorde (found ${getcontractinsurancemrtarecentexec.rows.length ? getcontractinsurancemrtarecentexec.rows.length : `0`} result)`,
                                        })
                                    }

                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `Error during execute get data from CONTRACT_INSURANCE : (${e.message ? e.message : `no return msg`})`,
                                    })
                                }

                            } else if (checkactivestatusmrtarecentexec.rows.length == 0) {
                                return res.status(200).send({
                                    status: 500,
                                    message: `no recent mrta record`,
                                    data: []
                                })
                            } else {
                                /* .... add-on check from nodejs version (check duplicate)... */
                                return res.status(200).send({
                                    status: 500,
                                    message: `Can't Identify Quotation (MPLS_QUOTATION) recorde (found ${checkactivestatusmrtarecentexec.rows.length ? checkactivestatusmrtarecentexec.rows.length : `0`} result)`,
                                    data: []
                                })
                            }


                        } catch (e) {
                            return res.status(200).send({
                                statsu: 500,
                                message: `Error during execute check active_status from quotation : (${e.message ? e.message : `no return msg`})`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `mission parameter quotationid`,
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

    /* ... send-car ==> app-mrta-product-new, product-detail ==> app-mrta-product-new ... */
    async getmastermrtainsurance(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqGetmastermrtainsurance

            if (dbconnect) {

                if (dbconnect[0]) {

                    const mastermrtainsuranceexec = await dbconnect[0].execute(
                        `
                            SELECT A.INSURER_CODE , A.INSURER_NAME , B.INSURANCE_CODE , C.AGE_MIN ,C.AGE_MAX, C.YEARS_INSUR , C.RATE_INSUR,CEIL((:OUT_STAND* C.RATE_INSUR)/B.RATIO) PREMIUM_INSUR, C.PLAN 
                            FROM X_INSURER_INFO A , X_INSURANCE B, BTW.X_INSURANCE_MRTA_DETAIL C
                            WHERE A.INSURER_CODE = B.INSURER_CODE
                            AND B.INSURANCE_CODE =C.INSURANCE_CODE
                            AND A.CANCEL_STATUS = 'N'
                            AND B.STATUS = 'Y'
                            AND B.BUSINESS_CODE = :BUSI_CODE
                            AND BTW.PKG_BUY_MRTA.GET_AGE_CUST(B.INSURANCE_CODE ,B.BUSINESS_CODE, TRUNC(BTW.BUDDHIST_TO_CHRIS_F(to_date(:BIRTH_DATE, 'dd/mm/yyyy'))),TRUNC(SYSDATE)) BETWEEN C.AGE_MIN AND C.AGE_MAX
                            AND C.GENDER = :GENDER
                        `, {
                        OUT_STAND: reqData.out_stand,
                        BUSI_CODE: reqData.busi_code,
                        BIRTH_DATE: reqData.birth_date,
                        GENDER: reqData.gender
                    }, {
                        outFormat: 4002,
                    })

                    if (mastermrtainsuranceexec.rows.length !== 0) {
                        let resQueryresult = mastermrtainsuranceexec
                        let resData = resQueryresult.rows as IResGetmastermrtainsuranceData[]
                        const lowerResData = this.utilService.loopObjtolowerkey(resData) as IResGetmastermrtainsuranceData[]

                        try {

                            return res.status(200).send({
                                status: 200,
                                message: `Success`,
                                data: lowerResData
                            })

                            /*.... Finish ...*/
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
                            message: 'No mrata insurance data',
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

    /* ... app-mrta-product (product-detail , send-car , mrta-info) ... */

    async mastermrta(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqMastermrta

            if (dbconnect) {

                if (dbconnect[0]) {

                    const resultmastermrtaexec = await dbconnect[0].execute(
                        `
                            SELECT A.INSURER_CODE  , B.INSURANCE_CODE  , C.PLAN 
                            FROM X_INSURER_INFO A , X_INSURANCE B, BTW.X_INSURANCE_MRTA_DETAIL C
                            WHERE A.INSURER_CODE = B.INSURER_CODE
                            AND B.INSURANCE_CODE =C.INSURANCE_CODE
                            AND A.CANCEL_STATUS = 'N'
                            AND B.STATUS = 'Y'
                            AND B.BUSINESS_CODE = :BUSI_CODE
                            group by A.INSURER_CODE  , B.INSURANCE_CODE  , C.PLAN
                            order by INSURER_CODE,INSURANCE_CODE
                        `,
                        {
                            BUSI_CODE: reqData.busi_code
                        },
                        {
                            outFormat: 4002,
                        })

                    if (resultmastermrtaexec.rows.length !== 0) {

                        try {

                            const resultmastermrta = this.utilService.loopObjtolowerkey(resultmastermrtaexec.rows) as [IResMastermrtaData]
                            let resObj = new Object as IResMastermrta
                            resObj.status = 200
                            resObj.message = `Success`
                            resObj.data = resultmastermrta

                            return res.status(200).send(resObj)

                            /* ... Finish ... */

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
                            message: 'No record found',
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

    /* ... app-mrta-product (product-detail , send-car , mrta-info) ... */
    async calculatemrtaage(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqCalculatemrtaage

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check parameters ... */

                    if (
                        reqData.insur_code &&
                        reqData.busi_code &&
                        reqData.birth_date &&
                        reqData.request_date
                    ) {

                        const resultcalcualtemrtaageexec = await dbconnect[0].execute(
                            `
                                SELECT BTW.PKG_BUY_MRTA.GET_AGE_CUST(:INSUR_CODE ,:BUSI_CODE ,TRUNC(BTW.BUDDHIST_TO_CHRIS_F(to_date(:BIRTH_DATE, 'dd/mm/yyyy'))), TRUNC(BTW.BUDDHIST_TO_CHRIS_F(to_date(:REQUEST_DATE, 'dd/mm/yyyy')))) AS MRTA_AGE FROM DUAL
                            `,
                            {
                                INSUR_CODE: reqData.insur_code,
                                BUSI_CODE: reqData.busi_code,
                                BIRTH_DATE: reqData.birth_date,
                                REQUEST_DATE: reqData.request_date
                            },
                            {
                                outFormat: 4002
                            }
                        )

                        if (resultcalcualtemrtaageexec.rows.length !== 0) {

                            try {

                                const resultcalcualtemrtaage = this.utilService.toLowerKeys(resultcalcualtemrtaageexec.rows[0]) as IResCalculatemrtaageData
                                return res.status(200).send({
                                    status: 200,
                                    message: `Success`,
                                    data: resultcalcualtemrtaage
                                })

                                /* ... Finish ... */
                            } catch (e) {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `Fail to return data calcualte age : ${e.message ? e.message : `No return msg`}`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `Can't calculate age from parameter data`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `missing parameter (` +
                                `insur_code : ${reqData.insur_code ? `true` : `false`}, ` +
                                `busi_code : ${reqData.busi_code ? `true` : `false`}, ` +
                                `birth_date : ${reqData.birth_date ? `true` : `false`}, ` +
                                `request_date : ${reqData.request_date ? `true` : `false`}, ` +
                                `)`
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

    /* ... send-car ==> app-qr-barcode-mrta, mrta-info ==> app-qr-barcode-mrta ... */
    async genmrtaqr(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqGenmrtaqr

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check all parametere ... */
                    if (reqData.application_num && reqData.premium_mrta) {

                        /* ... check REF PAY FROM ORACLE ... */
                        const checkrefpaynumexec = await dbconnect[0].execute(
                            `
                                SELECT REF_PAY_NUM 
                                FROM BTW.X_CUST_MAPPING_EXT
                                WHERE APPLICATION_NUM = :APPLICATION_NUM
                            `, {
                            APPLICATION_NUM: reqData.application_num
                        }, {
                            outFormat: 4002
                        })

                        if (checkrefpaynumexec.rows.length == 1) {

                            const checkrefpaynum = this.utilService.toLowerKeys(checkrefpaynumexec.rows[0]) as IExecCheckrefpaynum

                            const refpaynumvalue = checkrefpaynum.ref_pay_num

                            if (refpaynumvalue) {

                                /* ... user refpaynumvalue to Generate QR Image ... */

                                try {

                                    const resData = checkrefpaynum
                                    const refpay = checkrefpaynum.ref_pay_num
                                    const billerid = process.env.BILLER_ID
                                    const char13 = String.fromCharCode(13)
                                    const billpaymentformat = `${billerid}${char13}20${refpay}${char13}${char13}${reqData.premium_mrta}00`

                                    const width = 800;
                                    const height = 600;
                                    const canvas: Canvas = createCanvas(width, height)
                                    JsBarcode(canvas, billpaymentformat, {
                                        width: 1,
                                        height: 50,
                                        fontSize: 10,
                                        displayValue: false,
                                        margin: 0
                                    })

                                    const resultimageqr = await qrcode.toBuffer(billpaymentformat, {
                                        margin: 0,
                                        type: 'png',
                                        scale: 5
                                    })

                                    let returnData = this.utilService.loopObjtolowerkey([resData])
                                    returnData[0].image_file = [canvas.toBuffer("image/jpeg"), resultimageqr]
                                    returnData[0].bill_payment = billpaymentformat

                                    return res.status(200).send({
                                        status: 200,
                                        message: `Success`,
                                        data: returnData // === return array of image barcode and qr (pos 1 : barcode , pos 2 : QR code)
                                    })

                                    /* ... Finish ... */

                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `can't bind image : ${e.message ? e.message : 'no return msg'}`,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    sttus: 500,
                                    message: `ไม่พบเลข Reference Payment (No Value)`,
                                    data: []
                                })
                            }

                        } else if (checkrefpaynumexec.rows.length == 0) {
                            return res.status(400).send({
                                status: 400,
                                message: `ไม่พบเลข Reference Payment`,
                                data: []
                            })
                        } else {
                            return res.status(400).send({
                                status: 400,
                                message: `Can't Identity REF Payment (too many record found ${checkrefpaynumexec.rows.length ?? '-'} record)`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `missing parameters : (application_num : ${reqData.application_num ?? '-'}, premium_mrta : ${reqData.premium_mrta ?? '-'})`,
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

    /* ... send-car ==> app-qr-barcode-mrta ... */
    async confirmqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const username = user.username
            const reqData = req.body as IReqConfirmqrpayment

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... Check paramters contain ... */


                    if (radmin === 'FI' && userid && username && reqData.application_num) {

                        /* ... get record  payment ... */
                        const paymentrecordexec = await dbconnect[0].execute(
                            `
                                SELECT * 
                                FROM CONTRACT_INSURANCE
                                WHERE APPLICATION_NUM = :APPLICATION_NUM
                            `, {
                            APPLICATION_NUM: reqData.application_num
                        }, {
                            outFormat: 4002
                        }
                        )

                        if (paymentrecordexec.rows.length == 1) {

                            /* ... check payment status ... */
                            const paymentrecord = this.utilService.toLowerKeys(paymentrecordexec.rows[0]) as IExecPaymentrecord
                            const payment_status = paymentrecord.pay_status

                            if (payment_status !== 1) {

                                /* ... get data from oracle (X_CUST_MAPPING_EXT.TERM) (check is match) (04/10/2022) ... */

                                let term: number | null = null
                                try {

                                    const xcustmappingtermexec = await dbconnect[0].execute(
                                        `
                                            SELECT * 
                                            FROM 
                                            (  
                                                SELECT term 
                                                FROM BTW.X_CUST_MAPPING_EXT
                                                WHERE APPLICATION_NUM = :APPLICATION_NUM
                                                AND ROWNUM <= 1
                                            )
                                        `, {
                                        APPLICATION_NUM: reqData.application_num
                                    }, {
                                        outFormat: 4002
                                    })

                                    if (xcustmappingtermexec.rows.length == 1) {

                                        const xcustmappingterm = this.utilService.toLowerKeys(xcustmappingtermexec.rows[0]) as IExecXcustmappingterm
                                        term = xcustmappingterm.term

                                        /* ... stamp confirm user and status ... */
                                        const updatepaymentstatusexec = await dbconnect[0].execute(
                                            `
                                                DECLARE
                                                err_code  VARCHAR2(200);
                                                err_msg  VARCHAR2(200);
                                                status  NUMBER;
                                                
                                                P_PAY_STATUS NUMBER;
                                                P_APPLICATION_NUM VARCHAR2(25);
                                                P_CONTRACT_NO  VARCHAR2(25);
                                                P_TERM NUMBER;
                                                P_CONFIRM_BY  VARCHAR2(150);
                                                BEGIN
                                        
                                                        P_APPLICATION_NUM := :p_application_num;
                                                        P_CONTRACT_NO := :p_contract_no;
                                                        P_PAY_STATUS := :p_pay_status;
                                                        P_TERM := :p_term;
                                                        P_CONFIRM_BY := :p_confirm_by;
                                        
                                                        proc_confirm_PAY_INSURANCE(P_APPLICATION_NUM,P_CONTRACT_NO,P_PAY_STATUS,P_TERM,P_CONFIRM_BY,:err_code, :err_msg, :status);
                                        
                                                END;
                                            `,
                                            {
                                                p_application_num: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: reqData.application_num },
                                                p_contract_no: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: reqData.contract_no },
                                                p_pay_status: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: 1 },
                                                p_term: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: term },
                                                p_confirm_by: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: username },
                                                err_code: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                                                err_msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                                                status: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
                                            }
                                        )

                                        const updatepaymentstatus: oracledb.Result<IExecUpdatepaymentstatus> = updatepaymentstatusexec.outBinds

                                        if (updatepaymentstatus.outBinds.status == 1) {

                                            /* ... call PKG_BUY_MRTA ... */

                                            try {

                                                const updatemrtabuystatusexec = await dbconnect[0].execute(
                                                    `
                                                        BEGIN 
                                                        BTW.PKG_BUY_MRTA.PROCESS_KEEP_MRTA(:P_APP_NUM);
                                                        END;
                                                    `, {
                                                    P_APP_NUM: { dir: oracledb.BIND_IN, val: reqData.application_num }
                                                }, {
                                                    outFormat: 4002
                                                })

                                                /* .... BTW.PKG_BUY_MRTA.PROCESS_KEEP_MRTA (updatemrtabuystatusexec) didn't return anythind in api, but need to run for trigger oracle ... */

                                                /* ... check PKG success stamp product item (05/10/2022) ... */

                                                try {

                                                    const checkupdateproductexec = await dbconnect[0].execute(
                                                        `
                                                            SELECT * 
                                                            FROM BTW.X_PRODUCT_ITEM_LIST
                                                            WHERE ITEM_CODE = '014'
                                                            AND APPLICATION_NUM = :application_num
                                                        `, {
                                                        application_num: reqData.application_num
                                                    }, {
                                                        outFormat: 4002
                                                    })

                                                    if (checkupdateproductexec.rows.length !== 0) {

                                                        /* ... check result of CONTRACT_INSURANCE ... */
                                                        const checkpaymentconfirmcontractinsuranceexec = await dbconnect[0].execute(
                                                            `
                                                                SELECT * 
                                                                FROM MOBILEMPLS.CONTRACT_INSURANCE
                                                                WHERE APPLICATION_NUM = :APPLICATION_NUM
                                                            `, {
                                                            APPLICATION_NUM: reqData.application_num
                                                        }, {
                                                            outFormat: 4002
                                                        })

                                                        if (checkpaymentconfirmcontractinsuranceexec.rows.length !== 0) {
                                                            /* ... return data to client ... */

                                                            const checkpaymentconfirmcontractinsurance = this.utilService.loopObjtolowerkey(checkpaymentconfirmcontractinsuranceexec.rows) as [IResConfirmqrpaymentData]
                                                            const returnData: IResConfirmqrpayment = {
                                                                status: 200,
                                                                message: `Success`,
                                                                data: checkpaymentconfirmcontractinsurance
                                                            }

                                                            return res.status(200).send(returnData)

                                                            /* ... Finish ... */

                                                        } else {
                                                            return res.status(200).send({
                                                                status: 500,
                                                                message: `ไม่พบรายการอัพเดทสถานะ (not found contract_insurance)`,
                                                                data: []
                                                            })
                                                        }

                                                    } else {
                                                        return res.status(200).send({
                                                            status: 500,
                                                            message: `อัพเดท X_PRODUCT_ITEM_LIST ไม่สำเร็จ (PKG_BUY_MRTA)`,
                                                            data: []
                                                        })
                                                    }

                                                } catch (e) {
                                                    return res.status(200).send({
                                                        status: 400,
                                                        message: `Fail to execute check product item list (btw.x_product_item_list) : ${e.message ? e.message : 'no return msg'}`,
                                                        data: []
                                                    })
                                                }
                                            } catch (e) {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `Fail to execute PKG_BUY_MRTA : ${e.message ? e.message : 'no return msg'}`,
                                                    data: []
                                                })
                                            }

                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `สถานะ payment ไม่ได้รับการยืนยัน (proc_confirm_PAY_INSURANCE invalid)`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        return res.status(400).send({
                                            status: 400,
                                            message: `application_num doesn't math in oracle (get X_CUST_MAPPING_EXT.TERM)`,
                                            data: []
                                        })
                                    }



                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `Error during get Term from oracle : ${e.message ? e.message : `no return msg`}`,
                                        data: []
                                    })
                                }
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `รายการ QR payment มีการชำระเงินแล้ว`,
                                    data: []
                                })
                            }

                        } else if (paymentrecordexec.rows.length == 0) {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบรายการชำระเงินตามเลข Quotation : ${reqData.application_num}`,
                                data: []
                            })
                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่สามารถระบุรายการ contract_insurance ภายใต้ quotation ได้ \n
                                found : ${paymentrecordexec.rows.length ? paymentrecordexec.rows.length : `-`}`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `Mission parameters (` +
                                `Ramin : ${radmin ? 'true' : 'false'}` +
                                `, UserID : ${userid ? 'true' : 'false'}` +
                                `, Username : ${username ? 'true' : 'false'}` +
                                `, Application Number : ${reqData.application_num ? 'true' : 'false'}` +
                                `)`
                        })
                    }


                    /* ... Finish ... */
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

    /* ... send-car ==> app-advance-payment-qr-code ... */
    async genadvanceqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqGenadvanceqrpayment

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check parameter (application_num) ... */

                    if (reqData.application_num) {

                        const resultrefpayexec = await dbconnect[0].execute(
                            `
                                    SELECT 
                                        CME.REF_PAY_NUM, PIL.ITEM_PRICE, 
                                        CI.NAME, CI.SNAME, CME.TERM, CME.MONTHLY, XSC.FIRST_DUE, 
                                        TO_CHAR(XSC.FIRST_DUE, 'DD') AS DUE
                                    FROM 
                                        BTW.X_CUST_MAPPING_EXT CME
                                    INNER JOIN 
                                        BTW.X_PRODUCT_ITEM_LIST PIL
                                    ON CME.APPLICATION_NUM = PIL.APPLICATION_NUM
                                    AND CME.APPLICATION_NUM = :APPLICATION_NUM
                                    AND PIL.ITEM_CODE = '012'
                                    INNER JOIN 
                                        BTW.X_CUST_MAPPING CM
                                    ON CME.APPLICATION_NUM = CM.APPLICATION_NUM
                                    INNER JOIN 
                                        BTW.CUST_INFO CI
                                    ON CM.CUST_NO = CI.CUST_NO
                                    INNER JOIN 
                                        BTW.X_SAMM_CONTRACT XSC
                                    ON CME.APPLICATION_NUM = XSC.APPLICATION_NUM
                                `, {
                            APPLICATION_NUM: reqData.application_num
                        }, {
                            outFormat: 4002
                        })

                        if (resultrefpayexec.rows.length == 1) {

                            const resultrefpay = this.utilService.toLowerKeys(resultrefpayexec.rows[0]) as IExecResultrefpayexec
                            const refpayvalue = resultrefpay.ref_pay_num
                            const name = resultrefpay.name
                            const sname = resultrefpay.sname

                            if (refpayvalue) {

                                /* ... user refpayvalue to gen QR Image ... */

                                try {

                                    const resData = resultrefpay
                                    let returnData = this.utilService.loopObjtolowerkey([resData])
                                    const refpay = resData.ref_pay_num
                                    const billerid = process.env.BILLER_ID
                                    let char13 = String.fromCharCode(13)
                                    const billpaymentformat = `${billerid}${char13}02${refpay}${char13}${char13}0`

                                    const width = 800;
                                    const height = 600;
                                    const canvas: Canvas = createCanvas(width, height)
                                    JsBarcode(canvas, billpaymentformat, {
                                        width: 1,
                                        height: 50,
                                        fontSize: 10,
                                        displayValue: false,
                                        margin: 0
                                    })

                                    const resultimgqr = await qrcode.toBuffer(billpaymentformat, {
                                        margin: 0,
                                        type: `png`,
                                        // scale: 5
                                    })

                                    returnData[0].image_file = [canvas.toBuffer("image/jpeg"), resultimgqr]
                                    returnData[0].bill_payment = billpaymentformat
                                    returnData[0].name = name
                                    returnData[0].sname = sname

                                    /* .... for debug value of each image (barcode,qr)
                                    var barcodebase64 = canvas.toDataURL("image/jpeg");
                                    var qrcodebase64 = Buffer.from(resultimgqr).toString('base64')
                                    */

                                    return res.status(200).send({
                                        status: 200,
                                        message: 'Success',
                                        data: returnData
                                    })

                                    /* ... Finish ... */

                                } catch (e) {
                                    return res.status(400).send({
                                        status: 400,
                                        message: `can't bind image : ${e}`,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `ไม่พบเลข Reference Payment (No value)`,
                                    data: []
                                })
                            }

                        } else if (resultrefpayexec.rows.length == 0) {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบเลข Reference Payment`,
                                data: []
                            })
                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `Can't Identify REF Payment (too many result : ${resultrefpayexec.rows.length ? resultrefpayexec.rows.length : '-'})`,
                                data: []
                            })
                        }


                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `missing parameter application_num`,
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

    /* ... send-car ==> totalloss-QR ... */
    async gentotallossqrpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqGentotallossqrpayment

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check application_num paramter ... */

                    if (reqData.application_num) {

                        const resultrefpaywithamountexec = await dbconnect[0].execute(
                            `
                                SELECT CME.REF_PAY_NUM, PIL.ITEM_PRICE, CI.NAME, CI.SNAME
                                FROM BTW.X_CUST_MAPPING_EXT CME
                                INNER JOIN BTW.X_PRODUCT_ITEM_LIST PIL
                                ON CME.APPLICATION_NUM = PIL.APPLICATION_NUM
                                AND CME.APPLICATION_NUM = :APPLICATION_NUM
                                AND PIL.ITEM_CODE = '012'
                                INNER JOIN BTW.X_CUST_MAPPING CM
                                ON CME.APPLICATION_NUM = CM.APPLICATION_NUM
                                INNER JOIN BTW.CUST_INFO CI
                                ON CM.CUST_NO = CI.CUST_NO
                            `,
                            {
                                APPLICATION_NUM: reqData.application_num
                            },
                            {
                                outFormat: 4002
                            })

                        if (resultrefpaywithamountexec.rows.length == 1) {

                            const resultrefpay = this.utilService.toLowerKeys(resultrefpaywithamountexec.rows[0]) as IResGentotallossqrpaymentData
                            const refpayvalue = resultrefpay.ref_pay_num
                            const itemprice = resultrefpay.item_price
                            const name = resultrefpay.name
                            const sname = resultrefpay.sname
                            const billerid = process.env.BILLER_ID
                            let char13 = String.fromCharCode(13)
                            const billpaymentformat = `${billerid}${char13}08${refpayvalue}${char13}${char13}${itemprice}00`

                            try {

                                const width = 800;
                                const height = 600;
                                const canvas: Canvas = createCanvas(width, height);
                                JsBarcode(canvas, billpaymentformat, {
                                    width: 1,
                                    height: 50,
                                    fontSize: 10,
                                    displayValue: false,
                                    margin: 0
                                })

                                const resultimageqr = await qrcode.toBuffer(billpaymentformat, {
                                    margin: 0,
                                    type: 'png',
                                    scale: 5
                                })

                                let resObj = new Object as IResGentotallossqrpayment
                                let returnData = this.utilService.loopObjtolowerkey([resultrefpay]) as [IResGentotallossqrpaymentData]
                                returnData[0].image_file = [canvas.toBuffer("image/jpeg"), resultimageqr]
                                returnData[0].bill_payment = billpaymentformat
                                returnData[0].item_price = itemprice
                                returnData[0].name = name
                                returnData[0].sname = sname
                                resObj.message = `Success`
                                resObj.status = 200
                                resObj.data = returnData



                                return res.status(200).send({
                                    status: 200,
                                    message: `Success`,
                                    data: resObj
                                })

                                /* ... Finish ... */

                            } catch (e) {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `Can't bind canvas payment : ${e.message ? e.message : `No return msg`}`,
                                    data: []
                                })
                            }

                        } else if (resultrefpaywithamountexec.rows.length == 0) {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบเลข Reference Payment`,
                                data: []
                            })
                        } else {
                            /* ... multiple rows ... */
                            return res.status(200).send({
                                status: 500,
                                message: `Can't Identity REF Payment (too many) , rowsAffected : ${resultrefpaywithamountexec.rows.length}`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `mission application_num parameter`,
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

    /* ... header ==> mrta-list (dialog) ... */
    async searchmrta(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqSearchmrta
            const
                {
                    customername,
                    customersname,
                    idcardnum,
                    application_no,
                    contractno,
                    pageno,
                } = req.body as IReqSearchmrta

            if (dbconnect) {

                if (dbconnect[0]) {

                    let { pageno } = req.body
                    pageno = pageno ? pageno : 1

                    const indexstart = (pageno - 1) * 5 + 1
                    const indexend = (pageno * 5)
                    let rowCount: number

                    /* ... build condition and binding query ...*/
                    let baseQuery: string = ''
                    let bindData: { [key: string]: any } = {};

                    let sqlcustomername: string = ''
                    let sqlcustomersname: string = ''
                    let sqlidcardnum: string = ''
                    let sqlapplication_no: string = ''
                    let sqlcontractno: string = ''

                    let sqlchannal: string = ''
                    let channalstamp: string = ''

                    /*... customer name ...*/
                    if (customername) {
                        sqlcustomername = ` AND CUST_INFO.NAME LIKE :customername `
                        bindData.customername = customername
                    }

                    /*... customer surname ...*/
                    if (customersname) {
                        sqlcustomersname = ` AND CUST_INFO.SNAME LIKE :customersname `
                        bindData.customersname = `${customersname}%`
                    }

                    /*... id card ...*/
                    if (idcardnum) {
                        sqlidcardnum = ` AND CUST_INFO.IDCARD_NUM = :idcardnum `
                        bindData.idcardnum = idcardnum
                    }

                    /*... Application Number ...*/
                    if (application_no) {
                        sqlapplication_no = ` AND APP_EXT.APPLICATION_NUM = :application_no `
                        bindData.application_no = application_no
                    }

                    /* ...  Contract Number ...*/
                    if (contractno) {
                        sqlcontractno = ` AND APP_EXT.CONTRACT_NO = :contractno `
                        bindData.contractno = contractno
                    }

                    /* .... set query ...*/
                    baseQuery =
                        ` 
                        SELECT 
                            ROWNUM AS SEQ_ITEM
                            ,APP_EXT.APPLICATION_NUM
                            ,BTW.GET_DL_BRANCH (APP_EXT.SL_CODE) AS DL_BRANCH
                            ,(SELECT BRANCH_NAME
                                FROM BRANCH_P
                                WHERE BRANCH_CODE = BTW.GET_DL_BRANCH (APP_EXT.SL_CODE)) AS BRANCH_NAME
                            ,APP_EXT.CONTRACT_NO
                            ,TO_CHAR(APP_EXT.APPLICATION_DATE, 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS APPLICATION_DATE  --EX.05/06/2565
                            ,TO_CHAR(APP_EXT.CREATE_CONTRACT_DATE, 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS CREATE_CONTRACT_DATE  --EX.05/06/2565
                            ,CUST_INFO.CUST_NO
                            ,TO_CHAR(BTW.BUDDHIST_TO_CHRIS_F(CUST_INFO.BIRTH_DATE),'DD/MM/YYYY','nls_calendar=''thai buddha'' nls_date_language=thai') AS BIRTH_DATE_TH
                            ,BTW.BUDDHIST_TO_CHRIS_F(CUST_INFO.BIRTH_DATE) AS BIRTH_DATE
                            ,CE.FAVORITE1 as sex --เพศ
                            ,CUST_INFO.NAME AS FIRST_NAME
                            ,CUST_INFO.SNAME AS LAST_NAME
                            ,TITLE_P.TITLE_NAME||''||CUST_INFO.NAME||'  '||CUST_INFO.SNAME AS CUSTOMER_FULLNAME
                            ,CUST_INFO.IDCARD_NUM
                            ,BTW.func_GetCustAddr(APP_EXT.APPLICATION_NUM,CUST_INFO.CUST_NO,BTW.GET_ADDR_TYPE_ACTIVE_CUST(CUST_INFO.CUST_NO,'02')) AS ADDRESS1 --default ที่อยู่ตามบัตรประชาชน
                            ,BTW.func_GetCustAddr(APP_EXT.APPLICATION_NUM,CUST_INFO.CUST_NO,'06') AS ADDRESS_LETTER --default ที่อยู่ส่งจดหมาย 06
                            ,APP_EXT.SL_CODE
                            ,DL.DL_FNAME||' '||DL.DL_NAME||' '||DL.DL_LNAME  AS DL_NAME  -- ชื่อดีลเลอร์
                            ,UPPER(BTW.PKG_PRODUCT_DETAIL.GET_BRAND_NAME (APP_EXT.CONTRACT_NO)) AS MOTORCYCLE_BRANDS
                            ,BTW.PKG_PRODUCT_DETAIL.GET_MODEL_NAME (APP_EXT.CONTRACT_NO) AS MOTORCYCLE_MODELS
                            ,BTW.GET_MODEL_YEAR(APP_EXT.CONTRACT_NO) AS MODEL_YEAR
                            ,BTW.PKG_PRODUCT_DETAIL.GET_CC (APP_EXT.CONTRACT_NO) AS MODEL_CC
                            ,BTW.PKG_PRODUCT_DETAIL.GET_COLOR (APP_EXT.CONTRACT_NO) AS COLORS
                            ,TO_CHAR(APP_CONTRACT.FIRST_DUE , 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS FIRST_INSTALLMENT_PAID_DATE
                            ,TO_CHAR(ADD_MONTHS(APP_CONTRACT.FIRST_DUE,APP_EXT.TERM-1), 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')   AS LAST_INSTALLMENT_PAID_DATE
                            ,TO_CHAR(APP_EXT.MONTHLY, 'fm999g999g990d00') AS  MONTHLY_TXT  --ค่างวด
                            ,APP_EXT.MONTHLY
                            ,APP_EXT.TERM AS  PERIOD --จำนวนงวด
                            ,TO_CHAR(BTW.PKG_MONTH_END.GET_OUT_STAND('N',APP_EXT.CONTRACT_NO,NULL,'BTW.'),'fm999g999g990d00')  as OUT_STAND_TXT --(9) out_stand ตั้งต้น  (ยอดกู้)
                            ,BTW.PKG_MONTH_END.GET_OUT_STAND('N',APP_EXT.CONTRACT_NO,NULL,'BTW.') AS OUT_STAND
                            ,TO_CHAR(APP_CONTRACT.DOWN, 'fm999g999g990d00')  as DOWN_PAYMENT_AMOUNT  --3
                            ,BTW.PKG_PRODUCT_DETAIL.GET_CHASIS (APP_EXT.CONTRACT_NO) AS CHASSIS_NUMBER
                            ,BTW.PKG_PRODUCT_DETAIL.GET_ENGI (APP_EXT.CONTRACT_NO) AS MACHINE_NUMBER
                            ,TO_CHAR(APP_CONTRACT.FIRST_DUE , 'dd', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS DUE
                            ,BTW.GET_VALUE_CUST_INFO_EXT(CUST_INFO.CUST_NO,'E_MAIL','BTW.') AS EMAIL 
                            ,TRIM(BTW.PHONE_NO (CUST_INFO.CUST_NO,'SMS' )) AS SMS_NUMBER
                            ,TRIM(BTW.PHONE_NO (CUST_INFO.CUST_NO,'MP' )) AS PHONE_NUMBER
                            ,APP_EXT.CHECKER_CODE
                            -- ,DECODE(BTW.GET_E_PAPER(APP_EXT.CONTRACT_NO),'Y','edoc','paper') AS CHANNEL_TYPE
                            ,APP_EXT.REPORT_DATE
                            ,APP_EXT.INSURANCE_YEARS
                            ,APP_EXT.COVERAGE_TOTAL_LOSS  AS INSURANCE_T1_CASH                                           
                            from BTW.X_CUST_MAPPING_EXT APP_EXT,BTW.X_CUST_MAPPING CUST_MAPP,BTW.X_SAMM_CONTRACT APP_CONTRACT,BTW.CUST_INFO,BTW.TITLE_P
                            ,BTW.X_PRODUCT_DETAIL PD,X_DEALER_P DL,CUST_INFO_EXT  CE
                            where APP_EXT.APPLICATION_NUM = CUST_MAPP.APPLICATION_NUM
                            AND APP_EXT.APPLICATION_NUM = APP_CONTRACT.APPLICATION_NUM
                            AND APP_EXT.APPLICATION_NUM = PD.APPLICATION_NUM
                            AND CUST_MAPP.CUST_NO = CUST_INFO.CUST_NO
                            AND CUST_INFO.FNAME = TITLE_P.TITLE_ID(+)
                            AND APP_EXT.SL_CODE = DL.DL_CODE
                            AND CUST_MAPP.CUST_NO = CE.CUST_NO(+)
                            AND APP_EXT.loan_result='Y'
                            AND CUST_MAPP.CUST_STATUS='0'
                            AND PD.PRODUCT_CODE = '01'
                            ${sqlcustomername}
                            ${sqlcustomersname}
                            ${sqlidcardnum}
                            ${sqlapplication_no}
                            ${sqlcontractno}
                    `

                    const mrtacount = `SELECT COUNT(APPLICATION_NUM) AS COUNT FROM (${baseQuery})`

                    const mrtacountexec = await dbconnect[0].execute(
                        mrtacount,
                        bindData.length !== 0 ? bindData : {},
                        { outFormat: 4002 }
                    )

                    if (mrtacountexec.rows.length == 0) {
                        return res.status(200).send({
                            status: 200,
                            message: 'No record found',
                            data: []
                        })
                    } else {

                        let resQueryresult = this.utilService.loopObjtolowerkey(mrtacountexec.rows) as IExecMrtacount[]

                        if (resQueryresult[0].count !== 0) {
                            /* ... assign value to rowcount ...*/
                            rowCount = resQueryresult[0].count

                            try {

                                /*... assign value about pagination ...*/
                                bindData.indexstart = indexstart
                                bindData.indexend = indexend

                                /* ... execute value record list ...*/
                                const resultlist = await dbconnect[0].execute(
                                    ` SELECT * FROM (${baseQuery}) WHERE SEQ_ITEM BETWEEN :indexstart AND :indexend `,
                                    bindData,
                                    { outFormat: 4002 }
                                )

                                /* .... build data for return to client ...*/
                                const recordlist = resultlist.rows as IResSearchmrtaData[]
                                const lowerResData = this.utilService.loopObjtolowerkey(recordlist) as IResSearchmrtaData[]
                                let returnData = new Object as IResSearchmrta
                                returnData.data = lowerResData
                                returnData.status = 200
                                returnData.message = 'success'
                                returnData.currentpage = Number(pageno)
                                returnData.pagesize = 5
                                returnData.rowcount = rowCount
                                returnData.pagecount = Math.ceil(rowCount / 5);

                                try {
                                    /*.... Finish ... */
                                    res.status(200).send(returnData);
                                    /*... api process finish (success) ...*/
                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `Error when try to retrun data : ${e.message ? e.message : `no msg return`}`,
                                        data: []
                                    })
                                }

                            } catch (e) {
                                return res.status(200).send({
                                    status: 500,
                                    message: `Error in stage sql get datalist : ${e.message ? e.message : `no msg return`}`,
                                    data: []
                                })
                            }
                        } else {

                            return res.status(200).send({
                                status: 200,
                                message: 'No mrta list',
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

    /* ... mrta-info ... */
    async mrtainfobyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqMrtainfobyid

            if (dbconnect) {

                if (dbconnect[0]) {

                    const resultmrtainfoexec = await dbconnect[0].execute(
                        `
                            SELECT 
                            ROWNUM AS SEQ_ITEM
                            ,NVL(QUO_KEY_APP_ID,APP_EXT.APPLICATION_NUM) AS QUO_KEY_APP_ID
                            ,APP_EXT.APPLICATION_NUM
                            ,BTW.GET_DL_BRANCH (APP_EXT.SL_CODE) AS DL_BRANCH
                            ,(SELECT BRANCH_NAME
                                FROM BRANCH_P
                                WHERE BRANCH_CODE = BTW.GET_DL_BRANCH (APP_EXT.SL_CODE)) AS BRANCH_NAME
                            ,APP_EXT.CONTRACT_NO
                            ,TO_CHAR(APP_EXT.APPLICATION_DATE, 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS APPLICATION_DATE  --EX.05/06/2565
                            ,TO_CHAR(APP_EXT.CREATE_CONTRACT_DATE, 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS CREATE_CONTRACT_DATE  --EX.05/06/2565
                            ,CUST_INFO.CUST_NO
                            ,TO_CHAR(BTW.BUDDHIST_TO_CHRIS_F(CUST_INFO.BIRTH_DATE),'DD/MM/YYYY','nls_calendar=''thai buddha'' nls_date_language=thai') AS BIRTH_DATE_TH
                            ,BTW.BUDDHIST_TO_CHRIS_F(CUST_INFO.BIRTH_DATE) AS BIRTH_DATE
                            ,CE.FAVORITE1 as sex --เพศ
                            ,CUST_INFO.NAME AS FIRST_NAME
                            ,CUST_INFO.SNAME AS LAST_NAME
                            ,TITLE_P.TITLE_NAME||''||CUST_INFO.NAME||'  '||CUST_INFO.SNAME AS CUSTOMER_FULLNAME
                            ,CUST_INFO.IDCARD_NUM
                            ,BTW.func_GetCustAddr(APP_EXT.APPLICATION_NUM,CUST_INFO.CUST_NO,BTW.GET_ADDR_TYPE_ACTIVE_CUST(CUST_INFO.CUST_NO,'02')) AS ADDRESS1 --default ที่อยู่ตามบัตรประชาชน
                            ,BTW.func_GetCustAddr(APP_EXT.APPLICATION_NUM,CUST_INFO.CUST_NO,'06') AS ADDRESS_LETTER --default ที่อยู่ส่งจดหมาย 06
                            ,APP_EXT.SL_CODE
                            ,DL.DL_FNAME||' '||DL.DL_NAME||' '||DL.DL_LNAME  AS DL_NAME  -- ชื่อดีลเลอร์
                            --,UPPER(BTW.PKG_PRODUCT_DETAIL.GET_BRAND_NAME (APP_EXT.CONTRACT_NO)) AS MOTORCYCLE_BRANDs
                            --,BTW.PKG_PRODUCT_DETAIL.GET_MODEL_NAME (APP_EXT.CONTRACT_NO) AS MOTORCYCLE_MODELS
                            ,BD.BRAND_NAME AS MOTORCYCLE_BRANDS
                            ,MD.MODEL  AS MOTORCYCLE_MODELS
                            --,BTW.GET_MODEL_YEAR(APP_EXT.CONTRACT_NO) AS MODEL_YEAR
                            ,MD.MODEL_YEAR
                            ,MD.CC AS MODEL_CC
                            --,BTW.PKG_PRODUCT_DETAIL.GET_CC (APP_EXT.CONTRACT_NO) AS MODEL_CC
                            --,BTW.PKG_PRODUCT_DETAIL.GET_COLOR (APP_EXT.CONTRACT_NO) AS COLORS
                            ,PD.COLOR AS COLORS
                            ,TO_CHAR(APP_CONTRACT.FIRST_DUE , 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS FIRST_INSTALLMENT_PAID_DATE
                            ,TO_CHAR(ADD_MONTHS(APP_CONTRACT.FIRST_DUE,APP_EXT.TERM-1), 'dd/mm/yyyy', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')   AS LAST_INSTALLMENT_PAID_DATE
                            ,TO_CHAR(APP_EXT.MONTHLY, 'fm999g999g990d00') AS  MONTHLY_TXT  --ค่างวด
                            ,APP_EXT.MONTHLY
                            ,APP_EXT.TERM AS  PERIOD --จำนวนงวด
                            --,TO_CHAR(BTW.PKG_MONTH_END.GET_OUT_STAND('N',APP_EXT.CONTRACT_NO,NULL,'BTW.'),'fm999g999g990d00')  as OUT_STAND_TXT --(9) out_stand ตั้งต้น  (ยอดกู้)
                            ,DECODE(BTW.PKG_MONTH_END.GET_OUT_STAND('N',APP_EXT.CONTRACT_NO,NULL,'BTW.'), 0, APP_EXT.MONTHLY* APP_EXT.TERM, BTW.PKG_MONTH_END.GET_OUT_STAND('N',APP_EXT.CONTRACT_NO,NULL,'BTW.')) AS OUT_STAND
                            ,TO_CHAR(APP_CONTRACT.DOWN, 'fm999g999g990d00')  as DOWN_PAYMENT_AMOUNT  --3
                            ,BTW.PKG_PRODUCT_DETAIL.GET_CHASIS (APP_EXT.CONTRACT_NO) AS CHASSIS_NUMBER
                            ,BTW.PKG_PRODUCT_DETAIL.GET_ENGI (APP_EXT.CONTRACT_NO) AS MACHINE_NUMBER
                            ,TO_CHAR(APP_CONTRACT.FIRST_DUE , 'dd', 'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI')  AS DUE
                            ,BTW.GET_VALUE_CUST_INFO_EXT(CUST_INFO.CUST_NO,'E_MAIL','BTW.') AS EMAIL 
                            ,TRIM(BTW.PHONE_NO (CUST_INFO.CUST_NO,'SMS' )) AS SMS_NUMBER
                            ,TRIM(BTW.PHONE_NO (CUST_INFO.CUST_NO,'MP' )) AS PHONE_NUMBER
                            ,APP_EXT.CHECKER_CODE
                            -- ,DECODE(BTW.GET_E_PAPER(APP_EXT.CONTRACT_NO),'Y','edoc','paper') AS CHANNEL_TYPE
                            ,APP_EXT.REPORT_DATE
                            ,APP_EXT.INSURANCE_YEARS
                            ,APP_EXT.COVERAGE_TOTAL_LOSS  AS INSURANCE_T1_CASH 
                            ,APP_EXT.BUSSINESS_CODE 
                            from BTW.X_CUST_MAPPING_EXT APP_EXT,BTW.X_CUST_MAPPING CUST_MAPP,BTW.X_SAMM_CONTRACT APP_CONTRACT,BTW.CUST_INFO,BTW.TITLE_P
                            ,BTW.X_PRODUCT_DETAIL PD,X_DEALER_P DL,CUST_INFO_EXT  CE
                            ,BTW.X_BRAND_P BD
                            ,BTW.X_MODEL_P MD
                            where APP_EXT.APPLICATION_NUM = CUST_MAPP.APPLICATION_NUM
                            AND APP_EXT.APPLICATION_NUM = APP_CONTRACT.APPLICATION_NUM
                            AND APP_EXT.APPLICATION_NUM = PD.APPLICATION_NUM
                            AND CUST_MAPP.CUST_NO = CUST_INFO.CUST_NO
                            AND CUST_INFO.FNAME = TITLE_P.TITLE_ID(+)
                            AND APP_EXT.SL_CODE = DL.DL_CODE
                            AND CUST_MAPP.CUST_NO = CE.CUST_NO(+)
                            AND PD.BRAND_CODE = BD.BRAND_CODE
                            AND PD.MODELCODE = MD.MODEL_CODE
                            AND PD.BRAND_CODE  = MD.BRAND_CODE
                            AND MD.PRO_CODE = '01'
                            AND BD.PRO_CODE = '01'
                            AND APP_EXT.loan_result='Y'
                            AND CUST_MAPP.CUST_STATUS='0'
                            AND PD.PRODUCT_CODE = '01'
                            AND APP_EXT.APPLICATION_NUM = :application_num
                        `,
                        {
                            application_num: reqData.application_num
                        },
                        {
                            outFormat: 4002,
                        })

                    if (resultmrtainfoexec.rows.length !== 0) {


                        try {

                            const resultmrtainfo = this.utilService.loopObjtolowerkey(resultmrtainfoexec.rows) as [IResMrtainfobyidData]
                            let resObj = new Object as IResMrtainfobyid
                            resObj.status = 200
                            resObj.message = `Success`
                            resObj.data = resultmrtainfo

                            return res.status(200).send(resObj)

                            /* ... Finish ... */
                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                message: `Error when try to retrun data : ${e.message ? e.message : `no msg return`}`,
                                data: []
                            })
                        }

                    } else {

                        return res.status(200).send({
                            status: 200,
                            message: 'Not found record Mrta Info',
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

    /* ... 

    /* ..... self utility ..... */

    async insertMRTARecord(dbconnect: oracledb.Connection, userid: string, req: IReqSaveqrpayment, res: Response, billpayment: string, execData: IExecResultRefpay, canvas: Canvas, resultimgqr: any) {
        /* ... this function is insert mrta record; call beneath saveqrpayment() ... */
        /* ... insert ... */
        try {
            const insertmrtaselectexec = await dbconnect.execute(
                `
                INSERT INTO MOBILEMPLS.CONTRACT_INSURANCE
                                (APPLICATION_NUM,
                                 QUOTATION_ID,
                                 INSURANCE_T_CASH,
                                 INSURANCE_B_CASH,
                                 INSURER_CODE,
                                 INSURANCE_YEAR,
                                 ITEM_CODE,
                                 SELLER_ID,
                                 UPD_USER,
                                 UPD_DATETIME,
                                 OUT_STAND,
                                 AGE,
                                 GENDER,
                                 PAY_STATUS,
                                 ACTIVE_STATUS,
                                 INSURANCE_CODE,
                                 BARCODE_IMG,
                                 BILL_PAYMENT
                                )
                              Values
                                (
                                :APPLICATION_NUM,
                                :QUOTATION_ID,
                                :INSURANCE_T_CASH,
                                :INSURANCE_B_CASH,
                                :INSURER_CODE,
                                :INSURANCE_YEAR,
                                :ITEM_CODE,
                                :SELLER_ID,
                                :UPD_USER,
                                SYSDATE,
                                :OUT_STAND,
                                :AGE,
                                :GENDER,
                                :PAY_STATUS,
                                :ACTIVE_STATUS,
                                :INSURANCE_CODE,
                                :BARCODE_IMG,
                                :BILL_PAYMENT
                                )
                `,
                {
                    APPLICATION_NUM: req.application_num,
                    QUOTATION_ID: req.quotationid,
                    INSURANCE_T_CASH: req.out_stand,
                    INSURANCE_B_CASH: req.premium_mrta,
                    INSURER_CODE: req.insurer_code,
                    INSURANCE_YEAR: req.insurance_year,
                    ITEM_CODE: '014',
                    SELLER_ID: req.insurance_seller,
                    UPD_USER: userid,
                    OUT_STAND: req.out_stand,
                    AGE: req.age,
                    GENDER: req.gender,
                    PAY_STATUS: 0,
                    ACTIVE_STATUS: 1,
                    INSURANCE_CODE: req.insurance_code,
                    BARCODE_IMG: { val: resultimgqr, type: oracledb.BLOB, maxSize: 5000000 },
                    BILL_PAYMENT: billpayment
                },
                {
                    outFormat: 4002,
                }
            );

            if (insertmrtaselectexec.rowsAffected == 1) {
                /* ... commit all execute ... */
                const commitall = await dbconnect.commit();
                try {
                    commitall;
                    /* ... return QR Image ... */
                    execData[0].image_file = [canvas.toBuffer("image/png"), resultimgqr];
                    execData[0].bill_payment = billpayment;
                    return res.status(200).send({
                        status: 200,
                        message: `success`,
                        data: execData // === return array of image barcode and qr (pos 1 : barcode , pos 2 : QR code)
                    })

                    /* .... Finish ... */
                } catch (err) {
                    console.error(err.message);
                    return res.status(400).send(err.message)
                }
            } else {
                return this.handleError(res, 500, `Fail to insert MRTA record (rowsAffected: ${insertmrtaselectexec.rowsAffected ? insertmrtaselectexec.rowsAffected : `-`})`)
            }
        } catch (e) {
            return this.handleError(res, 500, `Fail to insert MRTA record: ${e}`)
        }
    }

    async updateMRTARecord(dbconnect: oracledb.Connection, userid: string, req: IReqSaveqrpayment, res: Response, billpayment: string, execData: IExecResultRefpay, canvas, resultimgqr) {
        /* ... this function is update mrta record; call beneath saveqrpayment() ... */
        /* ... update ... */
        try {
            const updatemrtarecentrecordexec = await dbconnect.execute(
                `
                    UPDATE MOBILEMPLS.CONTRACT_INSURANCE
                    SET INSURANCE_T_CASH = :INSURANCE_T_CASH,
                        INSURANCE_B_CASH = :INSURANCE_B_CASH,
                        INSURER_CODE = :INSURER_CODE,
                        INSURANCE_YEAR = :INSURANCE_YEAR,
                        ITEM_CODE = :ITEM_CODE,
                        SELLER_ID = :SELLER_ID,
                        UPD_USER = :UPD_USER,
                        OUT_STAND = :OUT_STAND,
                        AGE = :AGE,
                        GENDER = :GENDER,
                        PAY_STATUS = :PAY_STATUS,
                        INSURANCE_CODE = :INSURANCE_CODE,
                        BILL_PAYMENT = :BILL_PAYMENT,
                        BARCODE_IMG = :BARCODE_IMG
                    WHERE QUOTATION_ID = :QUOTATION_ID
                    AND APPLICATION_NUM = :APPLICATION_NUM
                `,
                {
                    INSURANCE_T_CASH: req.out_stand,
                    INSURANCE_B_CASH: req.premium_mrta,
                    INSURER_CODE: req.insurer_code,
                    INSURANCE_YEAR: req.insurance_year,
                    ITEM_CODE: '014',
                    SELLER_ID: req.insurance_seller,
                    UPD_USER: userid,
                    OUT_STAND: req.out_stand,
                    AGE: req.age,
                    GENDER: req.gender,
                    PAY_STATUS: 0,
                    INSURANCE_CODE: req.insurance_code,
                    BILL_PAYMENT: billpayment,
                    BARCODE_IMG: { val: resultimgqr, type: oracledb.BLOB, maxSize: 5000000 },
                    QUOTATION_ID: req.quotationid,
                    APPLICATION_NUM: req.application_num
                },
                {
                    outFormat: 4002,
                }
            );

            if (updatemrtarecentrecordexec.rowsAffected === 1) {

                const commitall = await dbconnect.commit()

                try {
                    commitall;
                    /* ... return QR Image ... */
                    execData[0].image_file = [canvas.toBuffer("image/png"), resultimgqr]
                    execData[0].bill_payment = billpayment
                    return res.status(200).send({
                        status: 200,
                        message: `success`,
                        data: execData // === return array of image barcode and qr (pos 1 : barcode , pos 2 : QR code)
                    });

                    /* .... Finish ... */
                } catch (err) {
                    return res.status(500).send(err.message)
                }

            } else if (updatemrtarecentrecordexec.rowsAffected === 0) {
                return this.handleError(res, 500, `ไม่พบรายการอัพเดทตามเงื่อน ไข`)
            } else {
                return this.handleError(res, 500, `Duplicate contract insurance record (rowsAffect : ${updatemrtarecentrecordexec.rowsAffected ? updatemrtarecentrecordexec.rowsAffected : '-'})`)
            }

        } catch (e) {
            return this.handleError(res, 500, `Fail to update MRTA recent record: ${e}`)
        }
    }

    handleError(res: Response, status: number, message: string) {
        return res.status(200).send({
            status: status,
            message: message,
            data: []
        });
    }
}
