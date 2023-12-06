import { Injectable, Next, Req, Res, UploadedFiles } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { IReqGetattachimagedeliverbyid } from 'src/interface/getattachimagedeliverbyid/i-req-getattachimagedeliverbyid';
import { IExecGetattachimagedeliverbyid, IExecGetattachimagedeliverbyidData } from 'src/interface/getattachimagedeliverbyid/i-exec-getattachimagedeliverbyid.interface';
import { IReqMplsCreateSendCarDeliverAndLoyaltyConsent } from 'src/interface/approve-deliver/i-req-mpls_create_send_car_deliver_and_loyalty_consent.interface';
import OracleDB from 'oracledb';

@Injectable()
export class ApproveDeliverService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    async getattachimagedeliverbyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqGetattachimagedeliverbyid

            if (dbconnect) {

                if (dbconnect[0]) {

                    const getimageattachdeliverexec = await dbconnect[0].execute(
                        `
                            SELECT IMAGE_NAME, IMAGE_TYPE, IMAGE_CODE, IMAGE_FILE
                            FROM MPLS_IMAGE_FILE 
                            WHERE IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                            AND IMAGE_CODE IN ( '14','15')
                        `,
                        {
                            IMGF_QUO_APP_KEY_ID: reqData.quotationid
                        },
                        {
                            outFormat: 4002,
                        })

                    try {


                        const lowerResData = this.utilService.loopObjtolowerkey(getimageattachdeliverexec.rows) as [IExecGetattachimagedeliverbyidData]

                        let returnData = new Object as IExecGetattachimagedeliverbyid
                        returnData.data = lowerResData
                        returnData.status = 200
                        returnData.message = 'success'

                        return res.status(200).json(returnData)

                        /* ... FInish ... */

                    } catch (e) {
                        console.log(`Error during build object response data.`)
                        return res.status(201).send({
                            status: 201,
                            message: '`Error during build object response data.',
                            data: []
                        })
                    }

                    if (getimageattachdeliverexec.rows.length !== 0) {

                    } else {
                        return res.status(201).send({
                            status: 201,
                            message: `No image File Found`,
                            data: []
                        })
                    }

                    if (getimageattachdeliverexec.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'No record found',
                            data: []
                        })
                    } else {

                        let resQueryresult = getimageattachdeliverexec
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

    async MPLS_create_send_car_deliver_and_loyalty_consent(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const loyaltyformdata = JSON.parse(req.body.loyaltyitem) as IReqMplsCreateSendCarDeliverAndLoyaltyConsent
            const quotationid = req.body.quotationid ? req.body.quotationid : ``
            const dealername = req.body.dealername ? req.body.dealername : ``

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... Check premission ... */

                    if (radmin !== 'Y') {

                        const dealerSign = files.find((x) => x.fieldname == `dealerSign`)
                        const firstImage = files.find((x) => x.fieldname == `firstImage`)

                        var imageData = []
                        const dealerSignBuffer = dealerSign ? this.utilService.imagetobuffer(dealerSign) : null
                        const firstImageBuffer = firstImage ? this.utilService.imagetobuffer(firstImage) : null

                        if (dealerSign) { this.utilService.createImageInfo(dealerSign, `14`, imageData, quotationid) }
                        if (firstImage) { this.utilService.createImageInfo(firstImage, `15`, imageData, quotationid) }

                        /* ... check duplicate reference record ... */

                        const resultCheckDupexec = await dbconnect[0].execute(
                            `
                                SELECT (IMGF_QUO_APP_KEY_ID) AS ITEMS 
                                FROM MPLS_IMAGE_FILE
                                WHERE IMGF_QUO_APP_KEY_ID = :quotationid
                                AND IMAGE_CODE = '15'
                            `,
                            {
                                quotationid: quotationid
                            },
                            {
                                outFormat: 4002
                            }
                        )

                        /* ... check duplicate reference deliver image ... */
                        if (resultCheckDupexec.rows.length == 0) {

                            /* ... insert image  (dealersign : [image_code = '14'] , sendcarimage : [iamge_code = '15'] ) ... */
                            try {

                                const sql = `
                                                INSERT INTO MPLS_IMAGE_FILE (
                                                IMGF_QUO_APP_KEY_ID, APP_KEY_ID, IMAGE_NAME, IMAGE_TYPE,
                                                IMAGE_CODE, IMAGE_FILE, STATUS)
                                                VALUES (:quokeyid, :keyid, :filename, :filetype, 
                                                :code, :filedata, :status)
                                            `

                                const binds = imageData;

                                const options = {
                                    bindDefs: {
                                        quokeyid: { type: OracleDB.STRING, maxSize: 50 },
                                        keyid: { type: OracleDB.STRING, maxSize: 50 },
                                        filename: { type: OracleDB.STRING, maxSize: 200 },
                                        filetype: { type: OracleDB.STRING, maxSize: 200 },
                                        code: { type: OracleDB.STRING, maxSize: 4 },
                                        filedata: { type: OracleDB.BLOB, maxSize: 5000000 },
                                        status: { type: OracleDB.NUMBER }
                                    }
                                }

                                const resultCreateRefAttachDeliverexec = await dbconnect[0].executeMany(sql, binds, options)
                                console.log(`sussecc create deliver attach record : ${resultCreateRefAttachDeliverexec.rowsAffected}`)

                                /* ... save loyalty consent value (19/08/2022) ... */

                                try {

                                    /* ... update consent loyalty ... */
                                    let sqlloyalty;
                                    let bindparamloyalty;
                                    sqlloyalty = `
                                                    UPDATE MPLS_CONSENT
                                                    SET IS_CHECK_SALE_SHEET_EXPLAIN = :IS_CHECK_SALE_SHEET_EXPLAIN,
                                                        IS_CHECK_PRODUCT_DETAIL = :IS_CHECK_PRODUCT_DETAIL,
                                                        IS_CHECK_PAYMENT_RULE = :IS_CHECK_PAYMENT_RULE,
                                                        IS_CHECK_CONTRACT_EXPLAIN = :IS_CHECK_CONTRACT_EXPLAIN,
                                                        IS_CHECK_TOTAL_LOSS_EXPLAIN = :IS_CHECK_TOTAL_LOSS_EXPLAIN,
                                                        IS_CHECK_TOTAL_LOSS_COMPANY = :IS_CHECK_TOTAL_LOSS_COMPANY
                                                    WHERE CONS_QUO_KEY_APP_ID = :quotationid
                                                `

                                    bindparamloyalty = {
                                        IS_CHECK_SALE_SHEET_EXPLAIN: loyaltyformdata.is_check_sale_sheet_explain,
                                        IS_CHECK_PRODUCT_DETAIL: loyaltyformdata.is_check_product_detail,
                                        IS_CHECK_PAYMENT_RULE: loyaltyformdata.is_check_payment_rule,
                                        IS_CHECK_CONTRACT_EXPLAIN: loyaltyformdata.is_check_contract_explain,
                                        IS_CHECK_TOTAL_LOSS_EXPLAIN: loyaltyformdata.is_check_total_loss_explain,
                                        IS_CHECK_TOTAL_LOSS_COMPANY: loyaltyformdata.is_check_total_loss_company,
                                        quotationid: quotationid
                                    }
                                    const update_loyalty_consent = await dbconnect[0].execute(sqlloyalty, bindparamloyalty, { outFormat: 4002 })

                                    console.log(`sussecc update loyalty consent : ${update_loyalty_consent.rowsAffected}`)

                                } catch (e) {

                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถอัพเดทข้อมูล loyalty consent ได้`
                                    })
                                }

                                // ====================================================

                                /* ... save la lon place value (19/08/2022) ... */

                                try {

                                    /* ... update la lon living place  ... */
                                    let sqllalon;
                                    let bindparamlalon;
                                    sqllalon = `
                                                    UPDATE MPLS_LIVING_PLACE
                                                        SET LALON = :lalon,
                                                        LATITUDE = :latitude,
                                                        LONDTIUDE = :londtiude

                                                        WHERE LIV_QUO_KEY_APP_ID = :quotationid
                                                `

                                    bindparamlalon = {
                                        lalon: loyaltyformdata.lalon,
                                        latitude: loyaltyformdata.latitude,
                                        londtiude: loyaltyformdata.londtiude,
                                        quotationid: quotationid
                                    }
                                    const update_lalon_consent = await dbconnect[0].execute(sqllalon, bindparamlalon, { outFormat: 4002 })

                                    console.log(`sussecc update lalon consent : ${update_lalon_consent.rowsAffected}`)

                                } catch (e) {

                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถอัพเดทข้อมูล lalon living place ได้`
                                    })
                                }
                                // ====================================================

                                /* ... check count of image insert (now 4 infuture should be 5 cause add one more signature image) ... */
                                /* ... chage to 2 image atlease (sig image and 1 photo) (02/06/2022) ... */
                                if (resultCreateRefAttachDeliverexec.rowsAffected >= 2) {
                                    console.log(`row affect trigger`)
                                    try {
                                        /* ... stamp dealer signature owner to quotation ... */
                                        const resultUpdateQuotatioexec = await dbconnect[0].execute(
                                            `
                                                UPDATE MPLS_QUOTATION SET DEALER_SIGNATURE_OWNER = :dealername
                                                WHERE QUO_KEY_APP_ID = :quotationid
                                        `, {
                                            dealername: dealername,
                                            quotationid: quotationid
                                        }, {})

                                        /* ... check update quotation dealer signatrue owner success ... */
                                        if (resultUpdateQuotatioexec.rowsAffected == 1) {
                                            /* ... commit all record if all created record success ... */
                                            const commitall = await dbconnect[0].commit();
                                            try {
                                                commitall
                                                console.log(`commit success`);
                                                /* ... success create deliver approve ... */
                                                return res.status(200).send({
                                                    status: 200,
                                                    messgae: 'success created deliver approve',
                                                    data: []
                                                })

                                                /* ... Finish ... */
                                            } catch (e) {

                                                res.send(200).send({
                                                    status: 500,
                                                    message: `Error during commit data : ${e.message ? e.message : 'No return message'}`,
                                                    data: []
                                                })
                                            }
                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `ไม่พบสามารถอัพเดทสถานะไปยังรายการ quotation ได้ (Can't identify record with rowsAffected : ${resultUpdateQuotatioexec.rowsAffected ? resultUpdateQuotatioexec.rowsAffected : '-'})`,
                                                data: []
                                            })

                                        }

                                    } catch (e) {
                                        console.log(`catch last execute`)
                                        return res.status(200).send({
                                            status: 500,
                                            message: `Fail to add dealer owner to quotation`,
                                            data: []
                                        })
                                    }


                                } else {
                                    /* ... missing some image ... */
                                    return res.status(200).send({
                                        status: 500,
                                        message: 'missing image deliver approve',
                                        data: []
                                    })
                                }
                            } catch (e) {
                                console.log(`Fail to INSERT deliver approve to Database`)
                                return res.status(201).send({
                                    status: 201,
                                    message: `Fail to INSERT deliver approve to Database : ${e}`,
                                    data: []
                                })
                            }
                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: 'มีการแนบไฟล์ไปเรียบร้อยแล้ว',
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 403,
                            message: `No Permission`,
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
