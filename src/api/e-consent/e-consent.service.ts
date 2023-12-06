import { Injectable, Next, Req, Res, UploadedFiles } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { IReqMplsCheckMotoYear } from 'src/interface/e-consent/MPLS_check_moto_year/i-req-mpls_check_moto_year';
import { IExecMplsCheckMotoYear } from 'src/interface/e-consent/MPLS_check_moto_year/i-exec-mpls_check_moto_year.interface';
import { IReqMplsGetimagefilebyid } from 'src/interface/e-consent/MPLS_getimagefilebyid/i-req-mpls_getimagefilebyid';
import { IResMplsGetimagefilebyid, IResMplsGetimagefilebyidData } from 'src/interface/e-consent/MPLS_getimagefilebyid/i-res-mpls_getimagefilebyid';
import { IResMplsGetimageMultipleFilebyid, IResMplsGetimageMultipleFilebyidData } from 'src/interface/e-consent/MPLS_getimagefilebyid/i-res-mpls_getimage_multiple_filebyid';
import { IReqMplsCreateImageAttachFile } from 'src/interface/e-consent/MPLS_create_image_attach_file/i-req-mpls_create_image_attach_file';
import { IExecQuocheck } from 'src/interface/e-consent/MPLS_create_image_attach_file/i-exec-quocheck';
import * as fs from 'fs';
import { v4 } from 'uuid';
import OracleDB from 'oracledb';
import { IReqMplsUpdateImageAttachFileMultiple } from 'src/interface/e-consent/MPLS_update_image_attach_file_multiple/i-req-mpls_update_image_attach_file_multiple';
import { IReqMplsCreateImageAttachFileMultiple } from 'src/interface/e-consent/MPLS_create_image_attach_file_multiple/i-req-mpls_create_image_attach_file_multiple';
import { IExecQuocheckUpdateFlow } from 'src/interface/e-consent/MPLS_update_image_attach_file_multiple/i-exec-quocheckUpdateFlow';
import { IReqMplsUpdateFlagImageAttachFile } from 'src/interface/e-consent/MPLS_update_flag_image_attach_file/i-req-mpls_update_flag_image_attach_file';
import { IExecCheckvalidimagetypeexec } from 'src/interface/e-consent/MPLS_update_flag_image_attach_file/i-exec-checkvalidimagetypeexec.interface';
import { IReqMplsUpdateFlagImageAttachFileMultiple } from 'src/interface/e-consent/MPLS_update_flag_image_attach_file_multiple/i-req-mpls_update_flag_image_attach_file_multiple';
import { IExecCheckvalidimagetypemultipleexec } from 'src/interface/e-consent/MPLS_update_flag_image_attach_file_multiple/i-exec-checkvalidimagetypemultipleexec';

@Injectable()
export class EConsentService {

    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    /* ... E-consent Service api ... */

    async MPLS_check_moto_year(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqMplsCheckMotoYear

            if (dbconnect) {

                if (dbconnect[0]) {

                    const checkmotoyearexec = await dbconnect[0].execute(
                        `
                        SELECT CHECK_MOTO_YEAR 
                        (
                            :MOTO_YEAR, 
                            :BUSSINESS_CODE, 
                            :PRODUCT_CODE, 
                            :BRAND_CODE, 
                            :MODEL_CODE, 
                            :SL_CODE
                        ) 
                        AS RESULT FROM DUAL
                        `, {
                        MOTO_YEAR: reqData.moto_year,
                        BUSSINESS_CODE: reqData.bussiness_code,
                        PRODUCT_CODE: reqData.product_code,
                        BRAND_CODE: reqData.brand_code,
                        MODEL_CODE: reqData.model_code,
                        SL_CODE: reqData.sl_code
                    }, {
                        outFormat: 4002,
                    })

                    if (checkmotoyearexec.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'No record found',
                            data: []
                        })
                    } else {

                        let resQueryresult = checkmotoyearexec
                        let resData = resQueryresult.rows as any[]
                        const lowerResData = this.utilService.toLowerKeys(resData[0]) as IExecMplsCheckMotoYear


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

    /* ... Image-attach page ...*/

    async MPLS_getimagefilebyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqMplsGetimagefilebyid

            if (dbconnect) {

                if (dbconnect[0]) {

                    /*... Check parameter ... */

                    if (reqData.quotationid !== null && reqData.quotationid !== ``) {

                        const checkquotationexec = await dbconnect[0].execute(
                            `
                                SELECT QUO_KEY_APP_ID FROM MPLS_QUOTATION
                                WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                            `, {
                            quotationid: reqData.quotationid
                        }, {
                            outFormat: 4002,
                        })

                        if (checkquotationexec.rows.length == 1) {

                            /* .... get image list ...*/

                            const imagelistexec = await dbconnect[0].execute(
                                `
                                    SELECT FS.IMAGE_NAME, FS.IMAGE_TYPE, FS.IMAGE_CODE, FS.IMAGE_FILE , MS.IMAGE_HEADER
                                    FROM MPLS_IMAGE_FILE FS
                                    LEFT JOIN MPLS_MASTER_IMAGE_P MS
                                    ON FS.IMAGE_CODE = MS.IMAGE_CODE
                                    WHERE ACTIVE_STATUS = 'Y'
                                    AND FS.IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                                    AND FS.IMAGE_CODE IN ('01', '02', '03', '04', '05', '06', '07', '08', '09', '10' , '16')
                                `, {
                                IMGF_QUO_APP_KEY_ID: reqData.quotationid
                            }, {
                                outFormat: 4002
                            })


                            if (imagelistexec.rows.length !== 0) {


                                /* .... Success ... */
                                const imagelist = this.utilService.loopObjtolowerkey(imagelistexec.rows) as [IResMplsGetimagefilebyidData]
                                const resData = imagelist
                                let returnData = new Object as IResMplsGetimagefilebyid
                                returnData.data = imagelist
                                returnData.status = 200
                                returnData.message = `Success`

                                return res.status(200).json(returnData)

                                /* ... Finish ... */
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `ไม่พบรายการ Image list ในระบบ`,
                                    data: []
                                })
                            }

                        } else if (checkquotationexec.rows.length == 0) {

                            return res.status(200).send({
                                status: 500,
                                message: 'No record found',
                                data: []
                            })

                        } else {

                            return res.status(200).send({
                                status: 500,
                                message: `Can't identity quotation record (duplicate)`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            mesage: `missing parameter quotationid`,
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

    async MPLS_getimage_multiple_filebyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqMplsGetimagefilebyid

            if (dbconnect) {

                if (dbconnect[0]) {

                    /*... Check parameter ... */

                    if (reqData.quotationid !== null && reqData.quotationid !== ``) {

                        const checkquotationexec = await dbconnect[0].execute(
                            `
                                SELECT QUO_KEY_APP_ID FROM MPLS_QUOTATION
                                WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                            `, {
                            quotationid: reqData.quotationid
                        }, {
                            outFormat: 4002,
                        })

                        if (checkquotationexec.rows.length == 1) {

                            /* .... get image list ...*/

                            const imagelistexec = await dbconnect[0].execute(
                                `
                                    SELECT FS.IMAGE_NAME, FS.IMAGE_TYPE, FS.IMAGE_CODE, FS.IMAGE_FILE , FS.APP_KEY_ID AS IMAGE_ID , MS.IMAGE_HEADER
                                    FROM MPLS_IMAGE_FILE FS
                                    LEFT JOIN MPLS_MASTER_IMAGE_P MS
                                    ON FS.IMAGE_CODE = MS.IMAGE_CODE
                                    WHERE ACTIVE_STATUS = 'Y'
                                    AND FS.IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                                    AND FS.IMAGE_CODE IN ('12')
                                    ORDER BY ID DESC
                                `, {
                                IMGF_QUO_APP_KEY_ID: reqData.quotationid
                            }, {
                                outFormat: 4002
                            })


                            if (imagelistexec.rows.length !== 0) {


                                /* .... Success ... */
                                const imagelist = this.utilService.loopObjtolowerkey(imagelistexec.rows) as [IResMplsGetimageMultipleFilebyidData]
                                const resData = imagelist
                                let returnData = new Object as IResMplsGetimageMultipleFilebyid
                                returnData.data = imagelist
                                returnData.status = 200
                                returnData.message = `Success`

                                return res.status(200).json(returnData)

                                /* ... Finish ... */
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `ไม่พบรายการ Image list multiple ในระบบ`,
                                    data: []
                                })
                            }

                        } else if (checkquotationexec.rows.length == 0) {

                            return res.status(200).send({
                                status: 500,
                                message: 'No record found',
                                data: []
                            })

                        } else {

                            return res.status(200).send({
                                status: 500,
                                message: `Can't identity quotation record (duplicate)`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            mesage: `missing parameter quotationid`,
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

    async MPLS_create_image_attach_file(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body.item) as IReqMplsCreateImageAttachFile

            if (dbconnect) {

                if (dbconnect[0]) {

                    /*... check permission ... */
                    if (radmin !== 'Y') {

                        const create_image_attach = files.find((x) => x.fieldname === `image_file`)

                        /* .... check variable param ...*/

                        if (create_image_attach) {

                            const createimagebuffer = create_image_attach ? this.utilService.imagetobuffer(create_image_attach) : null

                            if (
                                createimagebuffer &&
                                (reqData.quotation_id !== '' && reqData.quotation_id !== null) &&
                                (reqData.image_code !== '' && reqData.image_code !== null) &&
                                (reqData.image_name !== '' && reqData.image_name !== null)
                            ) {

                                const filetype = create_image_attach[0].headers['content-type']
                                const readfileimage = fs.readFileSync(create_image_attach[0].path)

                                const quocheckexec = await dbconnect[0].execute(
                                    `
                                        ELECT QUO_KEY_APP_ID, USER_ID 
                                        FROM MPLS_QUOTATION 
                                        WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                    `,
                                    {
                                        QUO_KEY_APP_ID: reqData.quotation_id
                                    },
                                    {
                                        outFormat: 4002
                                    })

                                if (quocheckexec.rows.length == 1) {

                                    /*.... CHECK OWNER IDENTIFY ....*/
                                    const quocheck = this.utilService.loopObjtolowerkey(quocheckexec.rows) as [IExecQuocheck]

                                    const ownerrecord = quocheck[0].user_id

                                    if (ownerrecord == userid) {

                                        /* .... check image file is already exits (should not) .... */
                                        const imagefileexec = await dbconnect[0].execute(
                                            `
                                                SELECT * 
                                                FROM MPLS_IMAGE_FILE
                                                WHERE IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                                                AND IMAGE_CODE = :IMAGE_CODE
                                            `, {
                                            IMGF_QUO_APP_KEY_ID: reqData.quotation_id,
                                            IMAGE_CODE: reqData.image_code
                                        }, {
                                            outFormat: 4002
                                        })

                                        if (imagefileexec.rows.length == 0) {

                                            /* ... create image attach file ... */

                                            const imageuuid = v4()

                                            const createimageexec = await dbconnect[0].execute(
                                                `
                                                    INSERT INTO MPLS_IMAGE_FILE (
                                                        IMGF_QUO_APP_KEY_ID, 
                                                        APP_KEY_ID, 
                                                        IMAGE_FILE, 
                                                        IMAGE_NAME, 
                                                        IMAGE_TYPE,
                                                        IMAGE_CODE, 
                                                        STATUS, 
                                                        ACTIVE_STATUS
                                                    )
                                                    VALUES 
                                                    (
                                                        :IMGF_QUO_APP_KEY_ID,
                                                        :APP_KEY_ID, 
                                                        :IMAGE_FILE, 
                                                        :IMAGE_NAME, 
                                                        :IMAGE_TYPE, 
                                                        :IMAGE_CODE, 
                                                        0, 
                                                        'Y'
                                                    )
                                                `, {
                                                IMGF_QUO_APP_KEY_ID: { val: reqData.quotation_id, type: OracleDB.STRING, maxSize: 50 },
                                                APP_KEY_ID: { val: imageuuid, type: OracleDB.STRING, maxSize: 50 },
                                                IMAGE_FILE: { val: readfileimage, type: OracleDB.BLOB, maxSize: 5000000 },
                                                IMAGE_NAME: { val: reqData.image_name, type: OracleDB.STRING, maxSize: 200 },
                                                IMAGE_TYPE: { val: filetype, type: OracleDB.STRING, maxSize: 200 },
                                                IMAGE_CODE: { val: reqData.image_code, type: OracleDB.STRING, maxSize: 4 },
                                            })

                                            /* ... Check result Create ... */

                                            if (createimageexec.rowsAffected == 1) {

                                                /* ... Create record Success ... */

                                                const commitall = await dbconnect[0].commit()

                                                try {
                                                    commitall

                                                    return res.status(200).send({
                                                        status: 200,
                                                        message: `อัพเดทรายการไฟล์แนบสำเร็จ`
                                                    })

                                                } catch (e) {
                                                    return res.status(200).send({
                                                        status: 500,
                                                        mesage: `Fail to Commit create : ${e.message ? e.message : `No return msg`}`,
                                                        data: []
                                                    })
                                                }

                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `ไม่สามารถสร้างรายการไฟล์แนบได้ (rows : ${createimageexec.rowsAffected})`,
                                                    data: []
                                                })
                                            }

                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `ไม่สามารถสร้างรายการไฟล์แนบประเภทนี้ได้ เนื่องจากมีการ upload ไปแล้ว`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            mesage: `No Permission (didn't match with owner)`,
                                            data: []
                                        })
                                    }

                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถระบุรายการ quotation ได้ (rows : ${quocheckexec.rows.length})`
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `Missing parameter arguement \n 
                                    quotation_id: ${reqData.quotation_id ? reqData.quotation_id : '-'} \n 
                                    image_code: ${reqData.image_code} \n
                                    image_name: ${reqData.image_name} \n
                                    create_image_attach : ${create_image_attach.fieldname}`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบรายการ paremeter image_file`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(403).send({
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

    async MPLS_create_image_attach_file_multiple(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body.item) as IReqMplsCreateImageAttachFileMultiple

            if (dbconnect) {

                if (dbconnect[0]) {

                    /*... check permission ... */
                    if (radmin !== 'Y') {

                        const create_image_attach = files.find((x) => x.fieldname === `image_file`)

                        /* .... check variable param ...*/

                        if (create_image_attach) {

                            const createimagebuffer = create_image_attach ? this.utilService.imagetobuffer(create_image_attach) : null

                            if (
                                createimagebuffer &&
                                (reqData.quotation_id !== '' && reqData.quotation_id !== null) &&
                                (reqData.image_code !== '' && reqData.image_code !== null) &&
                                (reqData.image_name !== '' && reqData.image_name !== null)
                            ) {

                                const filetype = create_image_attach[0].headers['content-type']
                                const readfileimage = fs.readFileSync(create_image_attach[0].path)

                                const quocheckexec = await dbconnect[0].execute(
                                    `
                                        SELECT QUO_KEY_APP_ID, USER_ID 
                                        FROM MPLS_QUOTATION 
                                        WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                    `,
                                    {
                                        QUO_KEY_APP_ID: reqData.quotation_id
                                    },
                                    {
                                        outFormat: 4002
                                    })

                                if (quocheckexec.rows.length == 1) {

                                    /*.... CHECK OWNER IDENTIFY ....*/
                                    const quocheck = this.utilService.loopObjtolowerkey(quocheckexec.rows) as [IExecQuocheck]

                                    const ownerrecord = quocheck[0].user_id

                                    if (ownerrecord == userid) {

                                        /* .... check image file is already exits (should not) .... */
                                        const imagefileexec = await dbconnect[0].execute(
                                            `
                                                SELECT * 
                                                FROM MPLS_IMAGE_FILE
                                                WHERE IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                                                AND IMAGE_CODE = :IMAGE_CODE
                                            `, {
                                            IMGF_QUO_APP_KEY_ID: reqData.quotation_id,
                                            IMAGE_CODE: reqData.image_code
                                        }, {
                                            outFormat: 4002
                                        })

                                        if (imagefileexec.rows.length == 0) {

                                            /* ... create image attach file ... */

                                            const imageuuid = v4()

                                            const createimageexec = await dbconnect[0].execute(
                                                `
                                                    INSERT INTO MPLS_IMAGE_FILE (
                                                        IMGF_QUO_APP_KEY_ID, 
                                                        APP_KEY_ID, 
                                                        IMAGE_FILE, 
                                                        IMAGE_NAME, 
                                                        IMAGE_TYPE,
                                                        IMAGE_CODE, 
                                                        STATUS, 
                                                        ACTIVE_STATUS
                                                    )
                                                    VALUES 
                                                    (
                                                        :IMGF_QUO_APP_KEY_ID,
                                                        :APP_KEY_ID, 
                                                        :IMAGE_FILE, 
                                                        :IMAGE_NAME, 
                                                        :IMAGE_TYPE, 
                                                        :IMAGE_CODE, 
                                                        0, 
                                                        'Y'
                                                    )
                                                `, {
                                                IMGF_QUO_APP_KEY_ID: { val: reqData.quotation_id, type: OracleDB.STRING, maxSize: 50 },
                                                APP_KEY_ID: { val: imageuuid, type: OracleDB.STRING, maxSize: 50 },
                                                IMAGE_FILE: { val: readfileimage, type: OracleDB.BLOB, maxSize: 5000000 },
                                                IMAGE_NAME: { val: reqData.image_name, type: OracleDB.STRING, maxSize: 200 },
                                                IMAGE_TYPE: { val: filetype, type: OracleDB.STRING, maxSize: 200 },
                                                IMAGE_CODE: { val: reqData.image_code, type: OracleDB.STRING, maxSize: 4 },
                                            })

                                            /* ... Check result Create ... */

                                            if (createimageexec.rowsAffected == 1) {

                                                /* ... Create record Success ... */

                                                const commitall = await dbconnect[0].commit()

                                                try {
                                                    commitall

                                                    return res.status(200).send({
                                                        status: 200,
                                                        message: `อัพเดทรายการไฟล์แนบสำเร็จ`
                                                    })

                                                } catch (e) {
                                                    return res.status(200).send({
                                                        status: 500,
                                                        mesage: `Fail to Commit create : ${e.message ? e.message : `No return msg`}`,
                                                        data: []
                                                    })
                                                }

                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `ไม่สามารถสร้างรายการไฟล์แนบได้ (rows : ${createimageexec.rowsAffected})`,
                                                    data: []
                                                })
                                            }

                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `ไม่สามารถสร้างรายการไฟล์แนบประเภทนี้ได้ เนื่องจากมีการ upload ไปแล้ว`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            mesage: `No Permission (didn't match with owner)`,
                                            data: []
                                        })
                                    }

                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถระบุรายการ quotation ได้ (rows : ${quocheckexec.rows.length})`
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `Missing parameter arguement \n 
                                    quotation_id: ${reqData.quotation_id ? reqData.quotation_id : '-'} \n 
                                    image_code: ${reqData.image_code} \n
                                    image_name: ${reqData.image_name} \n
                                    create_image_attach : ${create_image_attach.fieldname}`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบรายการ paremeter image_file`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(403).send({
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

    async MPLS_update_image_attach_file_multiple(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body.item) as IReqMplsUpdateImageAttachFileMultiple

            if (dbconnect) {

                if (dbconnect[0]) {

                    /*... check permission ... */
                    if (radmin !== 'Y') {

                        const update_image_attach = files.find((x) => x.fieldname === `image_file`)

                        /* .... check variable param ...*/

                        if (update_image_attach) {

                            const updateimagebuffer = update_image_attach ? this.utilService.imagetobuffer(update_image_attach) : null

                            if (
                                updateimagebuffer &&
                                (reqData.quotationid !== '' && reqData.quotationid !== null) &&
                                (reqData.image_id !== '' && reqData.image_id !== null)
                            ) {

                                const filetype = update_image_attach[0].headers['content-type']
                                const readfileimage = fs.readFileSync(update_image_attach[0].path)

                                const quocheckexec = await dbconnect[0].execute(
                                    `
                                        SELECT QUO_KEY_APP_ID, QUO_STATUS, USER_ID 
                                        FROM MPLS_QUOTATION 
                                        WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                    `,
                                    {
                                        QUO_KEY_APP_ID: reqData.quotationid
                                    },
                                    {
                                        outFormat: 4002
                                    })

                                if (quocheckexec.rows.length == 1) {

                                    /*.... Check Owner Identity ....*/
                                    const quocheck = this.utilService.loopObjtolowerkey(quocheckexec.rows) as [IExecQuocheckUpdateFlow]

                                    const ownerrecord = quocheck[0].user_id

                                    if (ownerrecord == userid) {

                                        if (quocheck[0].quo_status !== 1) {

                                            /* ... Get file attach ... */

                                            const imagefileupdateexec = await dbconnect[0].execute(
                                                `
                                                    SELECT * 
                                                    FROM MPLS_IMAGE_FILE
                                                    WHERE IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID 
                                                    AND APP_KEY_ID = :APP_KEY_ID
                                                `,
                                                {
                                                    IMGF_QUO_APP_KEY_ID: reqData.quotationid,
                                                    APP_KEY_ID: reqData.image_id
                                                },
                                                {
                                                    outFormat: 4002
                                                })

                                            /* ... Check file is exist ... */
                                            if (imagefileupdateexec.rows.length == 1) {

                                                /* ... Update image attach file ... */

                                                const updateimageexec = await dbconnect[0].execute(
                                                    `
                                                        UPDATE MPLS_IMAGE_FILE
                                                        SET IMAGE_FILE = :IMAGE_FILE,
                                                            IMAGE_TYPE = :IMAGE_TYPE,
                                                            ACTIVE_STATUS = 'Y'
                                                        WHERE IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                                                        AND APP_KEY_ID = :APP_KEY_ID
                                                    `,
                                                    {
                                                        IAMGE_FILE: { val: readfileimage, type: OracleDB.BLOB, maxSize: 5000000 },
                                                        IMAGE_TYPE: { val: filetype, type: OracleDB.STRING, maxSize: 200 },
                                                        IMGF_QUO_APP_KEY_ID: { val: reqData.quotationid, type: OracleDB.STRING, maxSize: 50 },
                                                        APP_KEY_ID: { val: reqData.image_id, type: OracleDB.STRING, maxSize: 50 }
                                                    })

                                                /* .... Check Result Update ... */

                                                if (updateimageexec.rowsAffected == 1) {

                                                    /* ... Update Success ... */

                                                    const commitall = await dbconnect[0].commit()

                                                    try {

                                                        commitall

                                                        return res.status(200).send({
                                                            status: 200,
                                                            message: `อัพเดทรายการไฟล์แนบสำเร็จ`
                                                        })

                                                        /* .... Finish ... */

                                                    } catch (e) {
                                                        return res.status(200).send({
                                                            status: 500,
                                                            message: `Error when trying comit : ${e.message ? e.message : `No return msg`}`,
                                                            data: []
                                                        })
                                                    }
                                                } else {
                                                    return res.status(200).send({
                                                        status: 500,
                                                        message: `ไม่สามารถอัพเดทรายการไฟล์แนบได้ (rows : ${updateimageexec.rowsAffected})`,
                                                        data: []
                                                    })
                                                }
                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    mesage: `ไม่พบรายการไฟล์แนบตาม image_code , image_id , quotationid`,
                                                    data: []
                                                })
                                            }
                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                mesage: `สถานะใบคำขออยู่ในขั้นพิจารณา ไม่สามารถแก้ไขข้อมูลได้`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            mesage: `No Permission (didn't match with owner)`,
                                            data: []
                                        })
                                    }

                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถระบุรายการ quotation ได้ (rows : ${quocheckexec.rows.length})`
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `Missing parameter arguement \n 
                                    quotationid: ${reqData.quotationid ? reqData.quotationid : '-'} \n 
                                    imaeg_id: ${reqData.image_id} \n
                                    create_image_attach : ${update_image_attach.fieldname}`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบรายการ paremeter image_file`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(403).send({
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

    async MPLS_update_flag_image_attach_file(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqMplsUpdateFlagImageAttachFile

            if (dbconnect) {

                if (dbconnect[0]) {

                    try {

                        const quocheckupdateflagexec = await dbconnect[0].execute(
                            `
                                SELECT QUO_KEY_APP_ID, QUO_STATUS 
                                FROM MPLS_QUOTATION
                                WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                            `,
                            {
                                QUO_KEY_APP_ID: reqData.quotationid
                            },
                            {
                                outFormat: 4002,
                            })

                        if (quocheckupdateflagexec.rows.length == 1) {

                            /* ... check image type for verify ('01', '03', '09', '10') ... */

                            const checkvalidimagetypeexec = await dbconnect[0].execute(
                                `
                                    SELELCT IMAGE_CODE
                                    FROM MPLS_IMAGE_FILE
                                    WHERE IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                                `,
                                {
                                    IMGF_QUO_APP_KEY_ID: reqData.quotationid
                                },
                                {
                                    outFormat: 4002
                                }
                            )

                            /* ... Check image type contain all require ... */

                            const checkvalidimagetype = this.utilService.loopObjtolowerkey(checkvalidimagetypeexec.rows) as [IExecCheckvalidimagetypeexec]
                            const countvalidtype = checkvalidimagetype.filter((item: { image_code: string }) => { return (item.image_code == '01' || item.image_code == '03' || item.image_code == '09' || item.image_code == '10') })
                            const flagvalue = countvalidtype.length < 4 ? '' : 'Y'

                            /* ... Update flag to quotation (QUO_IMAGE_ATTACH_VERIFY) ... */

                            const updateflagverifyimageexec = await dbconnect[0].execute(
                                `
                                    UPDATE MPLS_QUOTATION
                                    SET 
                                        QUO_IMAGE_ATTACH_VERIFY = :QUO_IMAGE_ATTACH_VERIFY
                                    WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                `,
                                {
                                    QUO_IMAGE_ATTACH_VERIFY: flagvalue,
                                    QUO_KEY_APP_ID: reqData.quotationid
                                }
                            )

                            /*... check updateflag success ...*/
                            if (updateflagverifyimageexec.rowsAffected == 1) {

                                /* ... commit ... */

                                /* ... update success ... */

                                const commitall = await dbconnect[0].commit()
                                try {
                                    commitall

                                    return res.status(200).send({
                                        status: 200,
                                        message: `อัพเดทสถานะสำเร็จ (Status : ${flagvalue == 'Y' ? 'ไฟล์แนบครบ' : 'ไฟล์แนบยังไม่ครบ'})`,
                                        data: []
                                    })

                                    /* ... Finish ... */
                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถอัพเดท FLAG vertify ได้ (commit stage) \n 
                                        Error : ${e.message ? e.meesasge : 'No return message'}`,
                                        data: []
                                    })
                                }
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `ไม่สามารถอัพเดทสถานะการตรวจสอบการแนบไฟล์ได้, rowsAffected: ${updateflagverifyimageexec.rowsAffected}`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่สามารถระบุรายการ quotation ได้ (rows : ${quocheckupdateflagexec.rows.length})`
                            })
                        }

                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            mesage: `Error when try to check verify image : ${e.message ? e.message : `No return msg`}`,
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

    async MPLS_update_flag_image_attach_file_multiple(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqMplsUpdateFlagImageAttachFileMultiple

            if (dbconnect) {

                if (dbconnect[0]) {

                    try {
                        const quocheckupdateflagmultipleexec = await dbconnect[0].execute(
                            `
                                SELECT QUO_KEY_APP_ID, QUO_STATUS 
                                FROM MPLS_QUOTATION
                                WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                            `, {
                            quotationid: reqData.quotationid
                        }, {
                            outFormat: 4002,
                        })

                        /* ... check quotation identity record ... */
                        if (quocheckupdateflagmultipleexec.rows.length == 1) {

                            /* ... Check image type for verify ('12') ... */

                            const checkvalidimagetypemultipleexec = await dbconnect[0].execute(
                                `
                                    SELECT IMAGE_CODE 
                                    FROM MPLS_IMAGE_FILE
                                    WHERE IMGF_QUO_APP_KEY_ID = :IMGF_QUO_APP_KEY_ID
                                    AND IMAGE_CODE = '12'
                                `,
                                {
                                    IMGF_QUO_APP_KEY_ID: reqData.quotationid
                                },
                                {
                                    outFormat: 4002
                                }
                            )

                            /* ... check image_code = '12' verify ... */

                            if (checkvalidimagetypemultipleexec.rows.length !== 0) {

                                /* ... check image type contain all require ... */
                                const checkvalidimagetypemultiple = this.utilService.loopObjtolowerkey(checkvalidimagetypemultipleexec.rows) as [IExecCheckvalidimagetypemultipleexec]
                                const countvalidtype = checkvalidimagetypemultiple.filter((item: { image_code: string }) => { return (item.image_code == '12') })
                                const flagvalue = countvalidtype.length < 2 ? '' : 'Y'

                                /* ... update flag to quotation (QUO_IMAGE_ATTACH_VERIFY) ... */
                                const updateflagmultipleexec = await dbconnect[0].execute(
                                    `
                                        UPDATE MPLS_QUOTATION
                                        SET 
                                            QUO_SECONDHAND_CAR_VERIFY = :QUO_SECONDHAND_CAR_VERIFY 
                                        WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                    `,
                                    {
                                        QQUO_SECONDHAND_CAR_VERIFY: flagvalue,
                                        QUO_KEY_APP_ID: reqData.quotationid
                                    }
                                )

                                /* ... check update query result ... */

                                if (updateflagmultipleexec.rowsAffected == 1) {

                                    /* ... commit ... */
                                    /* ... Update Success ... */

                                    const commitall = await dbconnect[0].commit()

                                    try {

                                        commitall

                                        return res.status(200).send({
                                            status: 200,
                                            message: `อัพเดทสถานะสำเร็จ (Status : ${flagvalue == 'Y' ? 'ไฟล์แนบครบ' : 'ไฟล์แนบยังไม่ครบ'})`
                                        })

                                        /* ... Finish ... */

                                    } catch (e) {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ไม่สามารถอัพเดท FLAG vertify ได้ (commit stage) : ${e.message ? e.meesasge : 'No return message'}`,
                                            data: []
                                        })
                                    }
                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถระบุรายการไฟล์แนบได้ (update) , rowsAffected : ${updateflagmultipleexec.rowsAffected}`,
                                        data: []
                                    })
                                }
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `ไม่พบรายการไฟล์แนบ`,
                                    data: []
                                })
                            }
                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่สามารถระบุรายการ quotation ได้ (rows : ${quocheckupdateflagmultipleexec.rows.length})`
                            })
                        }
                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            message: `Error when try to check verify image multiple : ${e.message ? e.message : `No return msg`}`,
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
