import { UtilityService } from 'src/utility/utility.service';
import { DbService } from './../../db/db.service';
import { Body, Injectable, Next, Req, Res, UploadedFiles } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { IResGetquotationbyid, IResGetquotationbyidData } from '../../interface/quotation/getquotationbyid/i-res-getquotationbyid';
import { IReqGetquotationlist } from 'src/interface/quotation/getquotationlist/i-req-getquotationlist.interface';
import { IResRowcount } from 'src/interface/main/i-res-rowcount.interface';
import { IResGetquotationlist, IResGetquotationlistData } from 'src/interface/quotation/getquotationlist/i-res-getquotationlist';
import { IExecMplsCanclequotationCheck } from 'src/interface/quotation/MPLS_canclequotation/i-exec-mpls_canclequotation-check.interface';
import { IUpdateMplsCanclequotation } from 'src/interface/quotation/MPLS_canclequotation/i-update-mpls_canclequotation.interface';
import { IExecCheckdopavalidstatus } from 'src/interface/quotation/MPLS_get_dopa_valid_status/i-exec-checkdopavalidstatus';
import { IReqGetquotationbyid } from 'src/interface/quotation/getquotationbyid/i-req-getquotationbyid';
import { ItemDipchip, PReqMplsDipchip } from './dto/p-req-mpls_dipchip.dto';
import { IResDipchApiData } from 'src/interface/i-res-dipch-api.interface';
import { IResMplsDipchip } from 'src/interface/quotation/MPLS_dipchip/i-res-mpls_dipchip';
import { IReqMplsDipchip } from 'src/interface/quotation/MPLS_dipchip/i-req-mpls_dipchip';
import { IExecDopastatuschk } from 'src/interface/quotation/MPLS_dipchip/i-exec-dopastatuschk';
import { v4 } from 'uuid';
import { IResBasicReturnRecord } from 'src/interface/main/i-res-basic-return-record';
import { IReqMplsDipchipnoneconsent } from 'src/interface/quotation/MPLS_dipchip/i-req-mpls_dipchipnoneconsent';
import * as oracledb from 'oracledb';
import { IReqMplsCreateOrUpdateCitizendata } from 'src/interface/quotation/MPLS_create_or_update_citizendata/i-req-mpls_create_or_update_citizendata';
import { IExecQuodata } from 'src/interface/quotation/MPLS_create_or_update_citizendata/i-exec-quodata';
import { PReqMplsUpdatePhoneNumber } from './dto/p-req-mpls_update_phone_number.dto';
import { IReqMplsCheckSecondhandCarImageAttach } from 'src/interface/quotation/MPLS_check_secondhand_car_image_attach/i-req-mpls_check_secondhand_car_image_attach';
import { IExecChkquotation } from 'src/interface/quotation/MPLS_check_secondhand_car_image_attach/i-exec-chkquotation';
import { IExecCheckvalidsecondhandcar } from 'src/interface/quotation/MPLS_check_secondhand_car_image_attach/i-exec-checkvalidsecondhandcar';
import { IResMplsCheckSecondhandCarImageAttach, IResMplsCheckSecondhandCarImageAttachData } from 'src/interface/quotation/MPLS_check_secondhand_car_image_attach/i-res-mpls_check_secondhand_car_image_attach';
import { IReqMplsCreateOrUpdateCredit } from 'src/interface/quotation/MPLS_create_or_update_credit/i-req-mpls_create_or_update_credit';
import { IExecCheckquotationexec } from 'src/interface/quotation/MPLS_create_or_update_credit/i-exec-checkquotationexec';
import { IExecChkcredit } from 'src/interface/quotation/MPLS_create_or_update_credit/i-exec-chkcredit';
import { IExecChecksecondhandcaractiveexec } from 'src/interface/quotation/MPLS_create_or_update_credit/i-exec-checksecondhandcaractiveexec.interface';
import { IReqMplsCheckApplicationNo } from 'src/interface/quotation/MPLS_check_application_no/i-req-mpls_check_application_no';
import { IExecCheckappnoexec } from 'src/interface/quotation/MPLS_check_application_no/i-exec-checkappnoexec.interface';
import { IReqMplsValidationOtpEconsentNon } from 'src/interface/quotation/MPLS_validation_otp_econsent_non/i-req-mpls_validation_otp_econsent_non';
import { IReqMplsCreateOrUpdateCareerandpurpose } from 'src/interface/quotation/MPLS_create_or_update_careerandpurpose/i-req-mpls_create_or_update_careerandpurpose';
import { IExecChkdupcareer } from 'src/interface/quotation/MPLS_create_or_update_careerandpurpose/i-exec-chkdupcareer';
import { IExecChkduppurpose } from 'src/interface/quotation/MPLS_create_or_update_careerandpurpose/i-exec-chkduppurpose';
import { IExecChkquotationcareer } from 'src/interface/quotation/MPLS_create_or_update_careerandpurpose/i-exec-chkquotationcareer';
import { IReqMplsCreateConsent } from 'src/interface/quotation/MPLS_create_consent/i-req-mpls_create_consent';
import * as moment from 'moment';
import { IResGetinsurancedetailbyid, IResGetinsurancedetailbyidData } from 'src/interface/quotation/getinsurancedetailbyid/i-res-getinsurancedetailbyid';
import { IReqBypasssignature } from 'src/interface/quotation/bypasssignature/i-req-bypasssignature';
import { IExecChkloanresultstatus } from 'src/interface/quotation/bypasssignature/i-exec-chkloanresultstatus.interface';
@Injectable()
export class QuotationService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    /* ... quotation-view-page ...*/

    async getquotationlist(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const channal = user.channal
            const
                {
                    status,
                    searchname,
                    searchidcardnum,
                    searchrefpaynum,
                    searchpaystatus
                } = req.body as IReqGetquotationlist

            /*... declare pageno with can assignable ...*/
            let {
                pageno
            } = req.body as IReqGetquotationlist

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... assign pageno = 1 when pageno is null or no value ...*/

                    let { pageno } = req.body
                    pageno = pageno ? pageno : 1

                    const indexstart = (pageno - 1) * 10 + 1
                    const indexend = (pageno * 10)
                    let rowCount: number

                    /* ... build condition and binding query ...*/
                    let baseQuery: string = ''
                    let bindData: { [key: string]: any } = {};

                    let sqlstatus: string = ''
                    let sqlname: string = ''
                    let sqlidcardnum: string = ''
                    let sqlrefpaynum: string = ''
                    let sqlpaystatus: string = ''
                    let sqlrole: string = ''

                    let sqlchannal: string = ''
                    let channalstamp: string = ''

                    /*... status ...*/
                    if (status) {
                        sqlstatus = ` AND QUO.LOAN_RESULT = :status  `
                        bindData.status = status
                    }

                    /*... name ...*/
                    if (searchname) {
                        sqlname = ` AND QUO.FIRST_NAME LIKE :name `
                        bindData.name = `${searchname}%`
                    }

                    /*... id card ...*/
                    if (searchidcardnum) {
                        sqlidcardnum = ` AND QUO.IDCARD_NUM = :idcardnum `
                        bindData.idcardnum = searchidcardnum
                    }

                    /*... REF PAY NUM ...*/
                    if (searchrefpaynum) {
                        sqlrefpaynum = ` AND CME.REF_PAY_NUM = :ref_pay_num `
                        bindData.ref_pay_num = searchrefpaynum
                    }

                    /* ...  admin or finance role ...*/
                    if (radmin !== 'Y' || radmin !== 'FI') {
                        sqlrole = ` AND QUO.USER_ID = :userid `
                        bindData.userid = userid
                    }

                    /* ... pay status ...*/
                    switch (searchpaystatus) {
                        case 'N':
                            sqlpaystatus = ' AND CN.PAY_STATUS = :pay_status '
                            bindData.pay_status = '0'
                            break;
                        case 'Y':
                            sqlpaystatus = ' AND CN.PAY_STATUS = :pay_status '
                            bindData.pay_status = '1'
                            break;

                        default:
                            break;
                    }

                    /* ... channal ...*/
                    if (channal) {
                        switch (user.channal) {
                            case 'checker': {
                                channalstamp = 'C'
                            }
                                break;
                            case 'dealer': {
                                channalstamp = 'S'
                            }
                        }
                        sqlchannal = ' AND QUO.CHANNAL_TYPE = :channalstamp '
                        bindData.channalstamp = channalstamp

                    }

                    /* .... set query ...*/
                    baseQuery =
                        ` 
                        SELECT 
                        QUO_ID, QUO.IDCARD_NUM, QUO.PHONE_NUMBER, QUO.TITLE_CODE, QUO.TITLE_NAME, QUO.
                        FIRST_NAME, QUO.LAST_NAME, QUO.BIRTH_DATE, QUO.CIZ_ISSUED_DATE, QUO.CIZ_EXPIRED_DATE, QUO.
                        CIZ_ADDRESS, QUO.CIZ_SUB_DISTRICT, QUO.CIZ_DISTRICT, QUO.CIZ_PROVINCE_NAME, QUO.CIZ_PROVINCE_CODE, QUO.
                        QUO_STATUS, QUO.QUO_LIVING_PLACE_ID, QUO.QUO_CONTRACT_PLACE_ID, QUO.QUO_WORKING_PLACE_ID, QUO.QUO_CREDIT_ID, QUO.
                        USER_ID, QUO.CREATED_TIME, QUO.LAST_UPDATED_TIME, QUO.QUO_KEY_APP_ID, QUO.CIZ_POSTAL_CODE, QUO.
                        APPLICATION_NUM, QUO.CIZ_ISSUED_PLACE, QUO.SL_CODE, QUO.CHECKER_CODE, QUO.CHANNAL_TYPE, QUO.
                        EMAIL, QUO.CIZ_AGE, QUO.CIZ_GENDER, QUO.DIPCHIP_UUID, QUO.CIZ_NICKNAME, QUO.
                        CIZ_HOUSE_TYPE, QUO.CIZ_HOUSE_OWNER_TYPE, QUO.CIZ_STAYED_YEAR, QUO.CIZ_STAYED_MONTH, QUO.CIZ_MARIED_STATUS, QUO.
                        QUO_APP_REF_NO, QUO.QUO_ECONSENT_FLAG, QUO.CIZ_PHONE_VALID_STATUS, QUO.OTP_PHONE_VERIFY, QUO.QUO_DOPA_STATUS, QUO.
                        QUO_FACE_COMPARE_VERIFY, QUO.IS_DIPCHIP_CHANNAL, QUO.QUO_HOUSE_REGIS_PLACE_ID, QUO.OTP_CONSENT_VERIFY, 
                        GET_SL_NAME(QUO.SL_CODE) AS DL_NAME, LR.LR_STATUSTEXT, CN.PAY_STATUS, PV.PROV_NAME AS BRANCH_NAME,
                        ROW_NUMBER() OVER (ORDER BY QUO.CREATED_TIME DESC) LINE_NUMBER
                        FROM MPLS_QUOTATION QUO
                        LEFT JOIN (SELECT LOAN_RESULT_CODE AS LR_STATUS , 
                        LOAN_RESULT_NAME AS LR_STATUSTEXT 
                        FROM BTW.X_LOAN_RESULT_P) LR
                        ON QUO.LOAN_RESULT = LR.LR_STATUS
                        LEFT JOIN CONTRACT_INSURANCE CN
                        ON QUO.QUO_KEY_APP_ID = CN.QUOTATION_ID
                        LEFT JOIN BTW.X_DEALER_P DL
                        ON QUO.SL_CODE = DL.DL_CODE
                        LEFT JOIN BTW.PROVINCE_P PV
                        ON DL.DL_BRANCH = PV.PROV_CODE
                        WHERE (QUO.QUO_STATUS<>3 OR QUO.QUO_STATUS IS NULL)
                        ${sqlstatus}
                        ${sqlname}
                        ${sqlidcardnum}
                        ${sqlrefpaynum}
                        ${sqlpaystatus}
                        ${sqlrole}
                        ${sqlchannal}
                        ORDER BY QUO.CREATED_TIME DESC
                    `

                    const sqlcount = `SELECT COUNT(LINE_NUMBER) AS ROWCOUNT FROM (${baseQuery})`

                    const resultCount = await dbconnect[0].execute(
                        sqlcount,
                        bindData.length !== 0 ? bindData : {},
                        { outFormat: 4002 }
                    )

                    if (resultCount.rows.length == 0) {
                        return res.status(200).send({
                            status: 200,
                            message: 'No record found',
                            data: []
                        })
                    } else {

                        let resQueryresult = this.utilService.loopObjtolowerkey(resultCount.rows) as IResRowcount[]

                        if (resQueryresult[0].rowcount == 0) {
                            return res.status(200).send({
                                status: 200,
                                message: 'ไม่พบรายการใบคำขอ',
                                data: []
                            })
                        } else {

                            /* ... assign value to rowcount ...*/
                            rowCount = resQueryresult[0].rowcount

                            try {

                                /*... assign value about pagination ...*/
                                bindData.indexstart = indexstart
                                bindData.indexend = indexend

                                /* ... execute value record list ...*/
                                const resultlist = await dbconnect[0].execute(
                                    ` SELECT * FROM(${baseQuery}) WHERE LINE_NUMBER BETWEEN :indexstart AND :indexend `,
                                    bindData,
                                    { outFormat: 4002 }
                                )

                                /* .... build data for return to client ...*/
                                const recordlist = resultlist.rows as IResGetquotationlistData[]
                                const lowerResData = this.utilService.loopObjtolowerkey(recordlist) as IResGetquotationlistData[]
                                let returnData = new Object as IResGetquotationlist
                                returnData.data = lowerResData
                                returnData.status = 200
                                returnData.message = 'success'
                                returnData.currentpage = Number(pageno)
                                returnData.pagesize = 10
                                returnData.rowcount = rowCount
                                returnData.pagecount = Math.ceil(rowCount / 10);

                                try {
                                    /*.... Finish ... */
                                    res.status(200).json(returnData);
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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_canclequotation(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const quotationid: string = req.body.quotationid

            if (!quotationid) {
                return res.status(200).send({
                    status: 500,
                    message: `กรุณาระบุไอดีของใบคำขอ`,
                    data: []
                })
            }

            if (dbconnect) {

                if (dbconnect[0]) {

                    /*... query for check quotation status ...*/

                    const checkrecordstatus = await dbconnect[0].execute(`
                            SELECT QUO_STATUS, APPLICATION_NUM 
                            FROM MPLS_QUOTATION
                            WHERE QUO_KEY_APP_ID = :quotationid 
                        `, {
                        quotationid: quotationid
                    }, {
                        outFormat: 4002,
                    })

                    if (checkrecordstatus.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'ไม่พบรายการใบคำขอนี้ ยกเลิกไม่ได้',
                            data: []
                        })
                    } else {

                        const lowerResData = this.utilService.loopObjtolowerkey(checkrecordstatus.rows) as IExecMplsCanclequotationCheck[]
                        const quoitem = lowerResData[0]

                        if (quoitem.application_num && quoitem.quo_status == 1) {

                            return res.status(200).send({
                                status: 500,
                                message: `ใบคำขอได้ถูกสร้างในระบบ ORACLE แล้ว ไม่สามารถยกเลิกได้`,
                                data: []
                            })

                        } else {

                            try {
                                /*... valid pass ...*/

                                /*... update status to quotation for cancle quotation ...*/
                                /*... ORACLE cancle (only case contain application_id (e-consent)) add-on (13/02/2023) ...*/

                                if (quoitem.application_num) {

                                    /*... contain application_num ...*/
                                    /*... call function from oracle here ...*/
                                    const updateOracleStatus = await dbconnect[0].execute(
                                        `
                                        DECLARE
                                            status VARCHAR(1);
                        
                                            BEGIN
                                            :status := BTW.FUNC_CANCELAPP_BY_TABLET (:quotaitonid , 'ยกเลิกจากฝั่งTablet' , :userid );
                        
                                            END;
                                    `, {

                                        /* ... BIND_IN  = 3001, BIND_OUT = 3003, STRING = 2001 ...*/
                                        quotaitonid: { dir: 3001, type: oracledb.STRING, val: quotationid },
                                        userid: { dir: 3001, type: oracledb.STRING, val: userid },
                                        status: { dir: 3003, type: oracledb.STRING }

                                    })

                                    const resUpdateOracleStatus = updateOracleStatus.outBinds as IUpdateMplsCanclequotation

                                    if (resUpdateOracleStatus.status == 'Y') {

                                        /*... update flag (mpls_quotation) when update function on oracle success ...*/
                                        try {


                                            const resultUpdatequotation = await dbconnect[0].execute(
                                                `
                                                UPDATE MPLS_QUOTATION
                                                SET QUO_STATUS = 3
                                                WHERE QUO_KEY_APP_ID = :quotationid
                                            `, {
                                                quotationid: quotationid
                                            }, {
                                                autoCommit: true
                                            })


                                            if (resultUpdatequotation) {
                                                return res.status(200).send({
                                                    status: 200,
                                                    message: `ยกเลิกเคสสำเร็จ`,
                                                    data: []
                                                })
                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `อัพเดทสถานะใบคำขอไม่สำเร็จ (MPLS_QUOTATION)`
                                                })
                                            }

                                        } catch (e) {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `Error when try to update quotation status : ${e.message ? e.message : `no msg return`}`,
                                                data: []
                                            })
                                        }

                                    } else if (resUpdateOracleStatus.status == 'N') {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ยกเลิกใบคำขอไม่สำเร็จ (update FUNC_CANCLEAPP_BY_TABLET return 'N')`,
                                            data: []
                                        })
                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ยกเลิกใบคำขอไม่สำเร็จ (status return : ${resUpdateOracleStatus.status ? resUpdateOracleStatus.status : 'No status return'}`,
                                            data: []
                                        })
                                    }
                                } else {
                                    /*... not contain application_num ...*/
                                    try {
                                        const resultUpdatequotation = await dbconnect[0].execute(
                                            `
                                            UPDATE MPLS_QUOTATION
                                            SET QUO_STATUS = 3
                                            WHERE QUO_KEY_APP_ID = :quotationid
                                        `, {
                                            quotationid: quotationid
                                        }, {
                                            autoCommit: true
                                        })


                                        if (resultUpdatequotation) {
                                            /*... finish ...*/
                                            return res.status(200).send({
                                                status: 200,
                                                message: `ยกเลิกเคสสำเร็จ`,
                                                data: []
                                            })
                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `อัพเดทสถานะใบคำขอไม่สำเร็จ (MPLS_QUOTATION)`
                                            })
                                        }
                                    } catch (e) {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `Error when try to update quotation status : ${e.message ? e.message : `no msg return`}`,
                                            data: []
                                        })
                                    }
                                }

                            } catch (e) {
                                return res.status(200).send({
                                    status: 500,
                                    message: `Error when try to check quotation status : ${e.message ? e.message : `no msg return`}`,
                                    data: []
                                })
                            }

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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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


    /* .... quotation-tab ... */

    /* ... quotation-detail-page ...*/

    /* ... recheck with image field (cizcard_image, econsent_image) ... */
    async getquotationbyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            let quotationid: string = (req.body as IReqGetquotationbyid).quotationid

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check userid from jwt token ...*/
                    if (userid) {

                        /* ... check paramter quotationid ...*/
                        if (quotationid) {

                            /* ... execute query to get quotationdata from ID ... */

                            const results = await dbconnect[0].execute(
                                `
                                SELECT 
                                    QU.QUO_ID,
                                    QU.IDCARD_NUM,
                                    QU.PHONE_NUMBER,
                                    QU.TITLE_CODE,
                                    QU.TITLE_NAME,
                                    QU.FIRST_NAME,
                                    QU.LAST_NAME,
                                    QU.BIRTH_DATE,
                                    QU.CIZ_ISSUED_DATE,
                                    QU.CIZ_EXPIRED_DATE,
                                    QU.CIZ_ADDRESS,
                                    QU.CIZ_SUB_DISTRICT,
                                    QU.CIZ_DISTRICT,
                                    QU.CIZ_PROVINCE_NAME,
                                    QU.CIZ_PROVINCE_CODE,
                                    QU.CIZ_POSTAL_CODE,
                                    QU.QUO_STATUS,
                                    QU.QUO_LIVING_PLACE_ID,
                                    QU.QUO_CONTRACT_PLACE_ID,
                                    QU.QUO_WORKING_PLACE_ID,
                                    QU.QUO_CAREER_ID,
                                    QU.QUO_CREDIT_ID,
                                    QU.QUO_IMAGE_ID,
                                    QU.USER_ID,
                                    QU.CREATED_TIME,
                                    QU.LAST_UPDATED_TIME,
                                    QU.APPROVED_TIME,
                                    QU.FACE_RECOG_API_ID,
                                    QU.QUO_KEY_APP_ID,
                                    QU.QUO_PURPOSE_ID,
                                    QU.QUO_CONSENT_ID,
                                    QU.CIZ_GENDER,
                                    QU.CIZ_STAYED_YEAR,
                                    QU.CIZ_STAYED_MONTH,
                                    QU.CIZ_MARIED_STATUS,
                                    QU.CIZ_NICKNAME,
                                    QU.CIZ_HOUSE_TYPE,
                                    QU.CIZ_HOUSE_OWNER_TYPE,
                                    QU.CIZ_AGE,
                                    QU.CIZ_PHONE_VALID_STATUS,
                                    QU.CIZCARD_STATUS,
                                    QU.QUO_DOPA_STATUS,
                                    QU.QUO_FACE_COMPARE_VERIFY,
                                    QU.QUO_IMAGE_ATTACH_VERIFY,
                                    QU.QUO_SECONDHAND_CAR_VERIFY,
                                    QU.APPLICATION_NUM,
                                    QU.CONTRACT_NO,
                                    QU.LOAN_RESULT,
                                    QU.SMS_SEND_STATUS,
                                    QU.E_DOC_STATUS,
                                    QU.E_PAPER,
                                    QU.EMAIL,
                                    QU.DEALER_SIGNATURE_OWNER,
                                    QU.OTP_PHONE_VERIFY,
                                    QU.OTP_CONSENT_VERIFY,
                                    QU.QUO_APP_REF_NO,
                                    QU.CIZCARD_IMAGE,
                                    QU.ECONSENT_IMAGE,
                                    CTP.APP_KEY_ID AS CTP_APP_KEY_ID,
                                    CTP.ADDRESS AS CTP_ADDRESS,
                                    CTP.SUB_DISTRICT AS CTP_SUB_DISTRICT,
                                    CTP.DISTRICT AS CTP_DISTRICT,
                                    CTP.PROVINCE_NAME AS CTP_PROVINCE_NAME,
                                    CTP.PROVINCE_CODE AS CTP_PROVINCE_CODE,
                                    CTP.POSTAL_CODE AS CTP_POSTAL_CODE,
                                    HRP.APP_KEY_ID AS HRP_APP_KEY_ID,
                                    HRP.ADDRESS AS HRP_ADDRESS,
                                    HRP.SUB_DISTRICT AS HRP_SUB_DISTRICT,
                                    HRP.DISTRICT AS HRP_DISTRICT,
                                    HRP.PROVINCE_NAME AS HRP_PROVINCE_NAME,
                                    HRP.PROVINCE_CODE AS HRP_PROVINCE_CODE,
                                    HRP.POSTAL_CODE AS HRP_POSTAL_CODE,
                                    LVP.APP_KEY_ID AS LVP_APP_KEY_ID,
                                    LVP.ADDRESS AS LVP_ADDRESS,
                                    LVP.SUB_DISTRICT AS LVP_SUB_DISTRICT,
                                    LVP.DISTRICT AS LVP_DISTRICT,
                                    LVP.PROVINCE_NAME AS LVP_PROVINCE_NAME,
                                    LVP.PROVINCE_CODE AS LVP_PROVINCE_CODE,
                                    LVP.POSTAL_CODE AS LVP_POSTAL_CODE,
                                    LVP.LATITUDE AS LVP_LATITUDE,   
                                    LVP.LONDTIUDE AS LVP_LONDTIUDE,
                                    LVP.LALON AS LVP_LALON,
                                    WP.APP_KEY_ID AS WP_APP_KEY_ID,
                                    WP.ADDRESS AS WP_ADDRESS,
                                    WP.SUB_DISTRICT AS WP_SUB_DISTRICT,
                                    WP.DISTRICT AS WP_DISTRICT,
                                    WP.PROVINCE_NAME AS WP_PROVINCE_NAME,
                                    WP.PROVINCE_CODE AS WP_PROVINCE_CODE,
                                    WP.POSTAL_CODE AS WP_POSTAL_CODE, 
                                    WP.DESCRIPTION AS WP_DESCRIPTION, 
                                    CD.APP_KEY_ID AS CD_APP_KEY_ID, 
                                    CD.BRAND_CODE AS CD_BRAND_CODE, 
                                    CD.BRAND_NAME AS CD_BRAND_NAME, 
                                    CD.STATUS AS CD_STATUS, 
                                    CD.MODEL_CODE AS CD_MODEL_CODE, 
                                    CD.MODEL_NAME AS CD_MODEL_NAME, 
                                    CD.MOTO_YEAR AS CD_MOTO_YEAR, 
                                    CD.COLOR_CODE AS CD_COLOR_CODE, 
                                    CD.COLOR_NAME AS CD_COLOR_NAME, 
                                    CD.LOAN_AMOUNT AS CD_LOAN_AMOUNT, 
                                    CD.PRODUCT_VALUE AS CD_PRODUCTVALUE, 
                                    CD.INTEREST_RATE AS CD_INTEREST_RATE, 
                                    CD.PAYMENT_VALUE AS CD_PAYMENT_VALUE, 
                                    CD.PAYMENT_ROUND_COUNT AS CD_PAYMENT_ROUND_COUNT, 
                                    CD.DOWN_PAYMENT AS CD_DOWN_PAYMENT,
                                    CD.INSURER_CODE AS CD_INSURER_CODE,
                                    CD.INSURER_NAME AS CD_INSURER_NAME,
                                    CD.INSURANCE_CODE AS CD_INSURANCE_CODE,
                                    CD.INSURANCE_NAME AS CD_INSURANCE_NAME,
                                    CD.INSURANCE_YEAR AS CD_INSURANCE_YEAR,
                                    CD.INSURANCE_PLAN_PRICE AS CD_INSURANCE_PLAN_PRICE,
                                    CD.IS_INCLUDE_LOANAMOUNT AS CD_IS_INCLUDE_LOANAMOUNT,
                                    CD.FACTORY_PRICE AS CD_FACTORY_PRICE,
                                    CD.SIZE_MODEL AS CD_SIZE_MODEL,
                                    CD.COVERAGE_TOTAL_LOSS AS CD_COVERAGE_TOTAL_LOSS,
                                    CD.MAX_LTV AS CD_MAX_LTV,
                                    CD.PRICE_INCLUDE_VAT AS CD_PRICE_INCLUDE_VAT,
                                    CD.ENGINE_NUMBER AS CD_ENGINE_NUMBER,
                                    CD.CHASSIS_NUMBER AS CD_CHASSIS_NUMBER,
                                    CD.ENGINE_NO_RUNNING AS CD_ENGINE_NO_RUNNING,
                                    CD.CHASSIS_NO_RUNNING AS CD_CHASSIS_NO_RUNNING,
                                    (CD.LOAN_AMOUNT + CD.INSURANCE_PLAN_PRICE) AS CD_NET_FINANCE,
                                    CD.BUSSINESS_CODE AS CD_BUSSINESS_CODE,
                                    CD.BUSSINESS_NAME AS CD_BUSSINESS_NAME,
                                    CD.MODEL_YEAR AS CD_MODEL_YEAR,
                                    CD.CC AS CD_CC, 
                                    CD.GRADE AS CD_GRADE, 
                                    CD.IS_OVER_MAX_LTV AS CD_IS_OVER_MAX_LTV, 
                                    CD.OVER_MAX_LTV_REASON AS CD_OVER_MAX_LTV_REASON, 
                                    CD.REG_NO AS CD_REG_NO,
                                    CD.GRADE AS CD_GRADE, 
                                    CD.REG_DATE AS CD_REG_DATE,
                                    CD.CONTRACT_REF AS CD_CONTRACT_REF,
                                    CD.REG_MILE AS CD_REG_MILE,
                                    CD.PROV_CODE AS CD_PROV_CODE,
                                    CD.PROV_NAME AS CD_PROV_NAME,
                                    CR.APP_KEY_ID AS CR_APP_KEY_ID,
                                    CR.MAIN_CAREER_NAME AS CR_MAIN_CAREER_NAME,
                                    CR.MAIN_CAREER_CODE AS CR_MAIN_CAREER_CODE,
                                    CR.MAIN_WORKPLACE_NAME AS CR_MAIN_WORKPLACE_NAME,
                                    CR.MAIN_POSITION AS CR_MAIN_POSITION,
                                    CR.MAIN_DEPARTMENT AS CR_MAIN_DEPARTMENT,
                                    CR.MAIN_EXPERIENCE_YEAR AS CR_MAIN_EXPERIENCE_YEAR,
                                    CR.MAIN_EXPERIENCE_MONTH AS CR_MAIN_EXPERIENCE_MONTH,
                                    CR.MAIN_SALARY_PER_MONTH AS CR_MAIN_SALARY_PER_MONTH,
                                    CR.MAIN_SALARY_PER_DAY AS CR_MAIN_SALARY_PER_DAY,
                                    CR.MAIN_LEADER_NAME AS CR_MAIN_LEADER_NAME,
                                    CR.MAIN_WORK_PER_WEEK AS CR_MAIN_WORK_PER_WEEK, 
                                    CR.MAIN_WORKPLACE_PHONE_NO_1 AS CR_MAIN_WORKPLACE_PHONE_NO_1, 
                                    CR.MAIN_WORKPLACE_PHONE_NO_2 AS CR_MAIN_WORKPLACE_PHONE_NO_2, 
                                    CR.IS_SUB_CAREER AS CR_IS_SUB_CAREER,
                                    CR.SUB_CAREER_NAME AS CR_SUB_CAREER_NAME,
                                    CR.SUB_CAREER_CODE AS CR_SUB_CAREER_CODE,
                                    CR.SUB_WORKPLACE_NAME AS CR_SUB_WORKPLACE_NAME,
                                    CR.SUB_POSITION AS CR_SUB_POSITION,
                                    CR.SUB_DEPARTMENT AS CR_SUB_DEPARTMENT,
                                    CR.SUB_EXPERIENCE_YEAR AS CR_SUB_EXPERIENCE_YEAR,
                                    CR.SUB_EXPERIENCE_MONTH AS CR_SUB_EXPERIENCE_MONTH,
                                    CR.SUB_SALARY_PER_MONTH AS CR_SUB_SALARY_PER_MONTH,
                                    CR.SUB_SALARY_PER_DAY AS CR_SUB_SALARY_PER_DAY,
                                    CR.SUB_LEADER_NAME AS CR_SUB_LEADER_NAME,
                                    CR.SUB_WORK_PER_WEEK AS CR_SUB_WORK_PER_WEEK,
                                    CS.APP_KEY_ID AS CS_APP_KEY_ID,
                                    CS.CUSTOMER_NAME AS CS_CUSTOMER_NAME,
                                    CS.FIRST_NAME AS CS_FIRST_NAME,
                                    CS.LAST_NAME AS CS_LAST_NAME,
                                    CS.IS_CREDIT_CONSENT AS CS_IS_CREDIT_CONSENT,
                                    CS.IS_FINAL_CONSENT AS CS_IS_FINAL_CONSENT,
                                    CS.IS_DISCLOSURE_CONSENT AS CS_IS_DISCLOSURE_CONSENT,
                                    CS.IS_PERSONAL_DISCLOSURE_CONSENT AS CS_IS_PERSONAL_DISCLOSURE,
                                    CS.SIGNATURE_IMAGE AS CS_SIGNATURE_IMAGE,
                                    CS.WITNESS_IMAGE AS CS_WITNESS_IMAGE,
                                    CS.IDENTITY_APPROVE_CONSENT_VALUE AS IDENTITY_APPROVE_CONSENT_VALUE,
                                    CS.MOTOR_INSURANCE_CONSENT_VALUE AS MOTOR_INSURANCE_CONSENT_VALUE,
                                    CS.NMOTOR_INSURANCE_CONSENT_VALUE AS NMOTOR_INSURANCE_CONSENT_VALUE,
                                    CS.ANALYZE_CONSENT_VALUE AS ANALYZE_CONSENT_VALUE,
                                    CS.INFO_CONSENT_VALUE AS INFO_CONSENT_VALUE,
                                    CS.INFO_PARTY_CONSENT_VALUE AS INFO_PARTY_CONSENT_VALUE,
                                    CS.ANALYZE_PARTY_CONSENT_VALUE AS ANALYZE_PARTY_CONSENT_VALUE,
                                    CS.PRDT_INFO_PARTY_CONSENT_VALUE AS PRDT_INFO_PARTY_CONSENT_VALUE,
                                    CS.FOLLOWUP_CONSENT_VALUE AS FOLLOWUP_CONSENT_VALUE,
                                    CS.INFO_DEVELOP_CONSENT_VALUE AS INFO_DEVELOP_CONSENT_VALUE,
                                    CS.E_PAPER_CONSENT_VALUE AS E_PAPER_CONSENT_VALUE,
                                    CS.IS_CHECK_SALE_SHEET_EXPLAIN AS IS_CHECK_SALE_SHEET_EXPLAIN,
                                    CS.IS_CHECK_PRODUCT_DETAIL AS IS_CHECK_PRODUCT_DETAIL,
                                    CS.IS_CHECK_PAYMENT_RULE AS IS_CHECK_PAYMENT_RULE,
                                    CS.IS_CHECK_CONTRACT_EXPLAIN AS IS_CHECK_CONTRACT_EXPLAIN,
                                    CS.IS_CHECK_TOTAL_LOSS_EXPLAIN AS IS_CHECK_TOTAL_LOSS_EXPLAIN,
                                    CS.IS_CHECK_TOTAL_LOSS_COMPANY AS IS_CHECK_TOTAL_LOSS_COMPANY,
                                    CS.IS_CHECK_LIFE_INSURANCE AS IS_CHECK_LIFE_INSURANCE,
                                    CS.IS_CHECK_L_INSUR_DETAIL AS IS_CHECK_L_INSUR_DETAIL,
                                    CS.IS_CHECK_L_INSUR_PLAN AS IS_CHECK_L_INSUR_PLAN,
                                    CS.IS_CHECK_L_INSUR_COMPANY AS IS_CHECK_L_INSUR_COMPANY,
                                    CS.IS_CHECK_L_INSUR_REFUND AS IS_CHECK_L_INSUR_REFUND,
                                    CS.IS_CHECK_L_INSUR_CANCLE_D AS IS_CHECK_L_INSUR_CANCLE_D,
                                    PP.APP_KEY_ID AS PP_APP_KEY_ID,
                                    PP.PURPOSE_OF_BUY AS PP_PURPOSE_OF_BUY,
                                    PP.PURPOSE_OF_BUY_NAME AS PP_PURPOSE_OF_BUY_NAME,
                                    PP.REASON_OF_BUY AS PP_REASON_OF_BUY,
                                    PP.REASON_OF_BUY_NAME AS PP_REASON_OF_BUY_NAME,
                                    PP.CAR_USER AS PP_CAR_USER,
                                    PP.CAR_USER_NAME AS PP_CAR_USER_NAME,
                                    PP.CAR_USER_RELATION AS PP_CAR_USER_RELATION,
                                    PP.CAR_USER_FULLNAME AS PP_CAR_USER_FULLNAME,
                                    PP.CAR_USER_CITIZENCARD_ID AS PP_CAR_USER_CITIZENCARD_ID,
                                    PP.CAR_USER_HOME_NO AS PP_CAR_USER_HOME_NO,
                                    PP.CAR_USER_HOME_NAME AS PP_CAR_USER_HOME_NAME,
                                    PP.CAR_USER_SOI AS PP_CAR_USER_SOI,
                                    PP.CAR_USER_TROK AS PP_CAR_USER_TROK,
                                    PP.CAR_USER_MOO AS PP_CAR_USER_MOO,
                                    PP.CAR_USER_ROAD AS PP_CAR_USER_ROAD,
                                    PP.CAR_USER_SUB_DISTRICT AS PP_CAR_USER_SUB_DISTRICT,
                                    PP.CAR_USER_DISTRICT AS PP_CAR_USER_DISTRICT,
                                    PP.CAR_USER_PROVINCE_CODE AS PP_CAR_USER_PROVINCE_CODE,
                                    PP.CAR_USER_PROVINCE_NAME AS PP_CAR_USER_PROVINCE_NAME,
                                    PP.CAR_USER_POSTAL_CODE AS PP_CAR_USER_POSTAL_CODE,
                                    PP.CAR_USER_ROOM_NO AS PP_CAR_USER_ROOM_NO,
                                    PP.CAR_USER_FLOOR AS PP_CAR_USER_FLOOR,
                                    PP.CAR_USER_PHONENO AS PP_CAR_USER_PHONENO,
                                    PP.FIRST_REFERRAL_FULLNAME AS PP_FIRST_REFERRAL_FULLNAME,
                                    PP.FIRST_REFERRAL_HOUSE_NO AS PP_FIRST_REFERRAL_HOUSENO,
                                    PP.FIRST_REFERRAL_MOO AS PP_FIRST_REFERRAL_MOO,
                                    PP.FIRST_REFERRAL_HOUSE_NAME AS PP_FIRST_REFERRAL_HOUSE_NAME,
                                    PP.FIRST_REFERRAL_ROOM_NO AS PP_FIRST_REFERRAL_ROOM_NO,
                                    PP.FIRST_REFERRAL_FLOOR AS PP_FIRST_REFERRAL_FLOOR,
                                    PP.FIRST_REFERRAL_SOI AS PP_FIRST_REFERRAL_SOI,
                                    PP.FIRST_REFERRAL_ROAD AS PP_FIRST_REFERRAL_ROAD,
                                    PP.FIRST_REFERRAL_SUB_DISTRICT AS PP_FIRST_REFERRAL_SUB_DISTRICT,
                                    PP.FIRST_REFERRAL_DISTRICT AS PP_FIRST_REFERRAL_DISTRICT,
                                    PP.FIRST_REFERRAL_PROVINCE_NAME AS PP_FIRST_REFERRAL_PROVINCE_N,
                                    PP.FIRST_REFERRAL_PROVINCE_CODE AS PP_FIRST_REFERRAL_PROVINCE_C,
                                    PP.FIRST_REFERRAL_POSTAL_CODE AS PP_FIRST_REFERRAL_POSTAL_CODE,
                                    PP.FIRST_REFERRAL_PHONENO AS PP_FIRST_REFERRAL_PHONENO,
                                    PP.FIRST_REFERRAL_RELATION AS PP_FIRST_REFERRAL_RELATION,
                                    PP.SECOND_REFERRAL_FULLNAME AS PP_SECOND_REFERRAL_FULLNAME,
                                    PP.SECOND_REFERRAL_HOUSE_NO AS PP_SECOND_REFERRAL_HOUSENO,
                                    PP.SECOND_REFERRAL_MOO AS PP_SECOND_REFERRAL_MOO,
                                    PP.SECOND_REFERRAL_HOUSE_NAME AS PP_SECOND_REFERRAL_HOUSE_NAME,
                                    PP.SECOND_REFERRAL_ROOM_NO AS PP_SECOND_REFERRAL_ROOM_NO,
                                    PP.SECOND_REFERRAL_FLOOR AS PP_SECOND_REFERRAL_FLOOR,
                                    PP.SECOND_REFERRAL_SOI AS PP_SECOND_REFERRAL_SOI,
                                    PP.SECOND_REFERRAL_ROAD AS PP_SECOND_REFERRAL_ROAD,
                                    PP.SECOND_REFERRAL_SUB_DISTRICT AS PP_SECOND_REFERRAL_SUB_D,
                                    PP.SECOND_REFERRAL_DISTRICT AS PP_SECOND_REFERRAL_DISTRICT,
                                    PP.SECOND_REFERRAL_PROVINCE_NAME AS PP_SECOND_REFERRAL_PROVINCE_N,
                                    PP.SECOND_REFERRAL_PROVINCE_CODE AS PP_SECOND_REFERRAL_PROVINCE_C,
                                    PP.SECOND_REFERRAL_POSTAL_CODE AS PP_SECOND_REFERRAL_POSTAL_CODE,
                                    PP.SECOND_REFERRAL_PHONENO AS PP_SECOND_REFERRAL_PHONENO,
                                    PP.SECOND_REFERRAL_RELATION AS PP_SECOND_REFERRAL_RELATION
                                FROM MPLS_QUOTATION QU
                                LEFT JOIN MPLS_CONTACT_PLACE CTP
                                ON QUO_KEY_APP_ID = CONT_QUO_KEY_APP_ID
                                LEFT JOIN MPLS_LIVING_PLACE LVP
                                ON QUO_KEY_APP_ID = LIV_QUO_KEY_APP_ID
                                LEFT JOIN MPLS_WORK_PLACE WP
                                ON QUO_KEY_APP_ID = WORK_QUO_KEY_APP_ID
                                LEFT JOIN MPLS_CREDIT CD
                                ON QUO_KEY_APP_ID = CRE_QUO_KEY_APP_ID
                                LEFT JOIN MPLS_CAREER CR
                                ON QUO_KEY_APP_ID = CARE_QUO_APP_KEY_ID
                                LEFT JOIN MPLS_CONSENT CS
                                ON QUO_KEY_APP_ID = CONS_QUO_KEY_APP_ID
                                LEFT JOIN MPLS_PURPOSE PP
                                ON QUO_KEY_APP_ID = PURP_QUO_APP_KEY_ID
                                LEFT JOIN MPLS_HOUSE_REGIS_PLACE HRP
                                ON QUO_KEY_APP_ID = HRP_QUO_KEY_APP_ID
                                WHERE QUO_KEY_APP_ID = :quotationid 
                            `, {
                                quotationid: { dir: oracledb.BIND_IN, val: quotationid, type: oracledb.STRING }
                            }, {
                                outFormat: 4002,
                            })

                            if (results.rows.length !== 0) {

                                if (results.rows.length == 1) {

                                    let resQueryresult = results
                                    let resData = resQueryresult.rows as IResGetquotationbyidData[]
                                    const lowerResData = this.utilService.loopObjtolowerkey(resData) as IResGetquotationbyidData[]

                                    /* .... check permission of record owner ...*/

                                    const t1 = (lowerResData[0].user_id).toString()
                                    const t2 = userid
                                    if (
                                        radmin === 'Y' ||
                                        radmin === 'FI' ||
                                        ((lowerResData[0].user_id).toString() == userid)
                                    ) {
                                        try {
                                            /*.... Finish ...*/

                                            let returnData = new Object as IResGetquotationbyid
                                            returnData.data = lowerResData
                                            returnData.status = 200
                                            returnData.message = `Success`


                                            return res.status(200).json(returnData)

                                            /* ... api process finish (success) ... */
                                        } catch (e) {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `Error when try to retrun data : ${e.message ? e.message : `no msg return`}`,
                                                data: []
                                            })
                                        }
                                    } else {

                                        return res.status(200).send({
                                            status: 202,
                                            message: 'ไม่มีสิทธิ์ในการดูใบคำขอนี้',
                                            data: []
                                        })

                                    }
                                } else {
                                    return res.status(200).send({
                                        status: 200,
                                        message: `Can't Identity quotation record (duplicate)`,
                                        data: []
                                    })
                                }
                            } else {

                                return res.status(200).send({
                                    status: 500,
                                    message: `No record found`,
                                    data: []
                                })
                            }
                        } else {
                            return res.status(500).send({
                                status: 500,
                                message: `ไม่มีค่า quotationid`,
                                data: []
                            })
                        }
                    } else {
                        return res.status(500).send({
                            status: 500,
                            message: `ไม่มีค่า user id สำหรับยืนยันตน`
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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_get_dopa_valid_status(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {

            let quotationid: string = req.body.quotationid

            if (dbconnect) {

                if (dbconnect[0]) {

                    const checkdopavalidstatusexec = await dbconnect[0].execute(
                        `
                            SELECT DISTINCT CHECKCARDSTATUS_ID AS STATUS_CODE 
                            FROM  DOPA_CHECKCARDSTATUS_P
                            WHERE ECONSENT_STATUS = 'Y'
                            ORDER BY CHECKCARDSTATUS_ID ASC
                        `, {
                        quotationid: quotationid
                    }, {
                        outFormat: 4002,
                    })

                    if (checkdopavalidstatusexec.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'No record found',
                            data: []
                        })
                    } else {

                        try {
                            /*.... finish ...*/

                            const statusCodes = (this.utilService.loopObjtolowerkey(checkdopavalidstatusexec.rows) as IExecCheckdopavalidstatus[]).map((object) => object.status_code);
                            const statusCodesstrings = statusCodes.map((number) => number.toString());

                            return res.status(200).send({
                                status: 200,
                                message: `success`,
                                data: {
                                    status_code: statusCodesstrings
                                }
                            })

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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_dipchip(@UploadedFiles() files: { image_file?: Array<Express.Multer.File> }, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const channalstamp = user.channal === 'checker' ? 'C' : user.channal === 'dealer' ? 'S' : '';
            const quotationKeyid = v4()
            const reqData = JSON.parse(req.body.item) as IReqMplsDipchip

            /*... didn't use now ...*/
            const reqfile = files
            /*......................*/

            if (dbconnect) {

                if (dbconnect[0]) {

                    const dopastatuschk = await dbconnect[0].execute(
                        `
                        SELECT * 
                        FROM DIPCHIP_CARD_READER_DOPA_LOG
                        WHERE UUID = :UUID 
                    `, {
                        UUID: reqData.dipchipuuid
                    }, {
                        outFormat: 4002,
                    })

                    /*.... check contain record ....*/
                    if (dopastatuschk.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'ไม่พบรายการสืบค้น DOPA',
                            data: []
                        })
                        /* ....  check duplicate or can't identify record ...*/
                    } else if (dopastatuschk.rows.length !== 1) {
                        return res.status(200).send({
                            status: 500,
                            message: `Duplicate or can't identify record`,
                            data: []
                        })
                    } else {
                        const dopareturndata = this.utilService.toLowerKeys(dopastatuschk.rows[0]) as IExecDopastatuschk
                        const dopastatus = dopareturndata.status_code
                        if (dopastatus == '500' || dopastatus == null || dopastatus == '') {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่สามารถทำรายการได้เนื่องจาก Server ตรวจสอบสถานะบัตรมีปัญหา ${dopastatus == `500` ? `(can't connect Server)` : `Timeout`}`,
                                data: []
                            })
                        }

                        /*... incert more condition of dopad status check) check list of allow dopa status ...*/
                        try {

                            const dopastatuslist = await dbconnect[0].execute(
                                `
                                SELECT DISTINCT CHECKCARDSTATUS_ID AS STATUS_CODE FROM  DOPA_CHECKCARDSTATUS_P
                                WHERE ECONSENT_STATUS = 'Y'
                                ORDER BY CHECKCARDSTATUS_ID ASC
                            `,
                                {}, { outFormat: 4002 })

                            const statusCodelist = (dopastatuslist.rows as { status_code: string }[]).map((object) => object.status_code);
                            const statusCodelistString = statusCodelist.map((number) => number.toString());

                            if ((statusCodelistString.includes(dopastatus))) {
                                /* ... insert data here ...*/

                                try {
                                    const quotationKeyid = v4()
                                    const living_place_key_id = v4()
                                    const contact_place_key_id = v4()
                                    const house_regis_place_key_id = v4()
                                    const work_place_key_id = v4()

                                    /* ... gen ref_app_num ...*/

                                    const resultgenrefappnum = dbconnect[0].execute(
                                        `
                                        DECLARE
    
                                        refid  VARCHAR2(11);
                                        BEGIN
                                
                                        BTW.PROC_GEN_QUO_APP_REF_NO(:refid);
                                
                                        END;
                                    `, {
                                        /* ... oracle.BIND_OUT = 3003 ...*/
                                        /* ... oracle.STRING = 2001 ...*/
                                        /* ... oracle.OBJECT = 4002 ...*/
                                        refid: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                                    }, {
                                        outFormat: 4002
                                    })

                                    const otprefid = ((await resultgenrefappnum).outBinds as { refid: string }).refid

                                    /* .... check ref id gen ...*/
                                    if (otprefid) {
                                        /*... gen ref id success ...*/

                                        try {

                                            /* ... update quotation record and create relate data record ...*/

                                            let cizcard_null = [];
                                            let cizcard_array: any
                                            let cizcard_image_blob: any;
                                            if (reqData.cizcardImage) {
                                                cizcard_image_blob = reqData.cizcardImage ? cizcard_array = Buffer.from(reqData.cizcardImage, "base64") : cizcard_null
                                            }

                                            const quotation_econsent = await dbconnect[0].execute(
                                                `
                                                INSERT INTO MPLS_QUOTATION 
                                                (
                                                    QUO_KEY_APP_ID,
                                                    USER_ID,
                                                    CIZCARD_IMAGE,
                                                    TITLE_CODE,
                                                    TITLE_NAME,
                                                    FIRST_NAME,
                                                    LAST_NAME,
                                                    CIZ_GENDER,
                                                    IDCARD_NUM,
                                                    BIRTH_DATE,
                                                    CIZ_ISSUED_DATE,
                                                    CIZ_EXPIRED_DATE,
                                                    CIZ_ISSUED_PLACE,
                                                    CIZ_ADDRESS,
                                                    CIZ_DISTRICT,
                                                    CIZ_SUB_DISTRICT,
                                                    CIZ_PROVINCE_NAME,
                                                    CIZ_PROVINCE_CODE,
                                                    CIZ_POSTAL_CODE,
                                                    QUO_APP_REF_NO,
                                                    CHANNAL_TYPE,
                                                    CIZ_AGE,
                                                    POLICY_AGE,
                                                    IS_DIPCHIP_CHANNAL,
                                                    QUO_DOPA_STATUS,
                                                    DIPCHIP_UUID,
                                                    QUO_LIVING_PLACE_ID,
                                                    QUO_CONTRACT_PLACE_ID,
                                                    QUO_WORKING_PLACE_ID,
                                                    QUO_HOUSE_REGIS_PLACE_ID,
                                                    QUO_STATUS
                                                )
                                                VALUES 
                                                (
                                                    :QUO_KEY_APP_ID,
                                                    :USER_ID,
                                                    :CIZCARD_IMAGE,
                                                    :TITLE_CODE,
                                                    :TITLE_NAME,
                                                    :FIRST_NAME,
                                                    :LAST_NAME,
                                                    :CIZ_GENDER,
                                                    :IDCARD_NUM,
                                                    :BIRTH_DATE,
                                                    :CIZ_ISSUED_DATE,
                                                    :CIZ_EXPIRED_DATE,
                                                    :CIZ_ISSUED_PLACE,
                                                    :CIZ_ADDRESS,
                                                    :CIZ_DISTRICT,
                                                    :CIZ_SUB_DISTRICT,
                                                    :CIZ_PROVINCE_NAME,
                                                    :CIZ_PROVINCE_CODE,
                                                    :CIZ_POSTAL_CODE,
                                                    :QUO_APP_REF_NO,
                                                    :CHANNAL_TYPE,
                                                    :CIZ_AGE,
                                                    :POLICY_AGE,
                                                    :IS_DIPCHIP_CHANNAL,
                                                    :QUO_DOPA_STATUS,
                                                    :DIPCHIP_UUID,
                                                    :QUO_LIVING_PLACE_ID,
                                                    :QUO_CONTRACT_PLACE_ID,
                                                    :QUO_WORKING_PLACE_ID,
                                                    :QUO_HOUSE_REGIS_PLACE_ID,
                                                    :QUO_STATUS
                                                )
                                            `
                                                , {

                                                    QUO_KEY_APP_ID: quotationKeyid,
                                                    USER_ID: userid,
                                                    CIZCARD_IMAGE: cizcard_image_blob,
                                                    TITLE_CODE: reqData.titleCode,
                                                    TITLE_NAME: reqData.titleName,
                                                    FIRST_NAME: reqData.firstName,
                                                    LAST_NAME: reqData.lastName,
                                                    CIZ_GENDER: reqData.gender,
                                                    IDCARD_NUM: reqData.citizenId,
                                                    BIRTH_DATE: (new Date(reqData.birthDate)) ?? null,
                                                    CIZ_ISSUED_DATE: (new Date(reqData.issueDate)) ?? null,
                                                    CIZ_EXPIRED_DATE: (new Date(reqData.expireDate)) ?? null,
                                                    CIZ_ISSUED_PLACE: reqData.issuePlace,
                                                    CIZ_ADDRESS: reqData.address,
                                                    CIZ_DISTRICT: reqData.district,
                                                    CIZ_SUB_DISTRICT: reqData.subDistrict,
                                                    CIZ_PROVINCE_NAME: reqData.provinceName,
                                                    CIZ_PROVINCE_CODE: reqData.provinceCode,
                                                    CIZ_POSTAL_CODE: reqData.postalCode,
                                                    QUO_APP_REF_NO: otprefid,
                                                    CHANNAL_TYPE: channalstamp,
                                                    CIZ_AGE: reqData.age ?? null,
                                                    POLICY_AGE: (reqData.age && reqData.age < 20) ? 'N' : 'Y',
                                                    IS_DIPCHIP_CHANNAL: 'Y',
                                                    QUO_DOPA_STATUS: 'N',
                                                    DIPCHIP_UUID: reqData.dipchipuuid,
                                                    QUO_LIVING_PLACE_ID: living_place_key_id,
                                                    QUO_CONTRACT_PLACE_ID: contact_place_key_id,
                                                    QUO_WORKING_PLACE_ID: work_place_key_id,
                                                    QUO_HOUSE_REGIS_PLACE_ID: house_regis_place_key_id,
                                                    QUO_STATUS: 4

                                                }, {
                                                outFormat: 4002
                                            })

                                            console.log("Quotation e-consent was create " + quotation_econsent.rowsAffected);

                                            const recLivingplace = await dbconnect[0].execute(
                                                `
                                                INSERT INTO MPLS_LIVING_PLACE (
                                                    LIV_QUO_KEY_APP_ID, APP_KEY_ID
                                                )
                                                VALUES (
                                                    :LIV_QUO_KEY_APP_ID, :APP_KEY_ID
                                                )
                                            `, {
                                                LIV_QUO_KEY_APP_ID: quotationKeyid,
                                                APP_KEY_ID: living_place_key_id
                                            })
                                            console.log(`living place create : ${recLivingplace.rowsAffected}`)

                                            const recContactplace = await dbconnect[0].execute(
                                                `
                                                INSERT INTO MPLS_CONTACT_PLACE (
                                                    CONT_QUO_KEY_APP_ID, APP_KEY_ID
                                                )
                                                VALUES (
                                                    :CONT_QUO_KEY_APP_ID, :APP_KEY_ID
                                                )
                                            `, {
                                                CONT_QUO_KEY_APP_ID: quotationKeyid,
                                                APP_KEY_ID: contact_place_key_id
                                            })
                                            console.log(`contact place create : ${recContactplace.rowsAffected}`)

                                            const recHouseregisplace = await dbconnect[0].execute(
                                                `
                                                INSERT INTO MPLS_HOUSE_REGIS_PLACE (
                                                    HRP_QUO_KEY_APP_ID, APP_KEY_ID
                                                )
                                                VALUES (
                                                    :HRP_QUO_KEY_APP_ID, :APP_KEY_ID
                                                )
                                            `, {
                                                HRP_QUO_KEY_APP_ID: quotationKeyid,
                                                APP_KEY_ID: house_regis_place_key_id
                                            })
                                            console.log(`house regis place create : ${recHouseregisplace.rowsAffected}`)

                                            const recWorkplace = await dbconnect[0].execute(
                                                `
                                                INSERT INTO MPLS_WORK_PLACE (
                                                    WORK_QUO_KEY_APP_ID, APP_KEY_ID
                                                )
                                                VALUES (
                                                    :WORK_QUO_KEY_APP_ID, :APP_KEY_ID
                                                )
                                            `, {
                                                WORK_QUO_KEY_APP_ID: quotationKeyid,
                                                APP_KEY_ID: work_place_key_id
                                            })
                                            console.log(`work place create : ${recWorkplace.rowsAffected}`)

                                            if (!(
                                                quotation_econsent.rowsAffected !== 1 &&
                                                recLivingplace.rowsAffected !== 1 &&
                                                recContactplace.rowsAffected !== 1 &&
                                                recHouseregisplace.rowsAffected !== 1 &&
                                                recWorkplace.rowsAffected !== 1
                                            )) {
                                                /* ... try to commit stage ...*/
                                                const commitall = await dbconnect[0].commit();

                                                try {
                                                    commitall

                                                    /*... replace quo_key_app_id instead of * (11/11/2023) ...*/
                                                    const sqlstring_getquotationkeyid = `SELECT QUO_KEY_APP_ID FROM MPLS_QUOTATION WHERE QUO_KEY_APP_ID = '${quotationKeyid}'`
                                                    const resultQuotation = await dbconnect[0].execute(sqlstring_getquotationkeyid, [],
                                                        {
                                                            outFormat: 4002
                                                        })

                                                    if (resultQuotation) {

                                                        if (resultQuotation.rows.length == 0) {

                                                            let resData = resultQuotation.rows
                                                            const lowerResData = this.utilService.toLowerKeys(resData) as ({ quo_key_app_id: string })
                                                            let returnData = new Object as IResBasicReturnRecord
                                                            returnData.data = [lowerResData]
                                                            returnData.status = 200
                                                            returnData.message = 'success'
                                                            return res.status(200).json(returnData);

                                                        } else {
                                                            /* ... finish and return data ...*/
                                                            const noresultFormatJson = {
                                                                status: 500,
                                                                message: 'No quotation Record'
                                                            }
                                                            return res.status(200).send(noresultFormatJson)
                                                        }
                                                    } else {
                                                        return res.status(200).send({
                                                            status: 500,
                                                            message: `Can't find record quotation id after select`,
                                                            data: []
                                                        })
                                                    }
                                                } catch (e) {
                                                    return res.status(200).send({
                                                        status: 500,
                                                        message: `Eror during try to commit : ${e.message}`,
                                                        data: []
                                                    })
                                                }



                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `สร้าง quotation econsent ไม่สำเร็จ`,
                                                    data: []
                                                })
                                            }

                                        } catch (e) {
                                            return res.status(200).send({
                                                status: 500,
                                                message: ` Error during update quotaiton or create relate table record : ${e.message ? e.message : ` No return msg.`}`,
                                                data: []
                                            })
                                        }




                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ไม่สามารถสร้างเลข ref_otp_id ได้`,
                                            data: []
                                        })
                                    }

                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        message: ` Error during gen ref id num: ${e.message ? e.message : `No return msg.`} `,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `สถานะ DOPA ไม่ได้อยู่ในเงื่อนไขที่กำหนด`,
                                    data: []
                                })
                            }

                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่สามารถตรวจสอบเงื่อนไข DOPA ที่อนุญาตได้ : ${e.message ? e.message : 'No return message'}`
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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_dipchipnoneconsent(@UploadedFiles() files: { image_file?: Array<Express.Multer.File> }, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {


        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDBbuffer() /* ... Have image ... */
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const channalstamp = user.channal === 'checker' ? 'C' : user.channal === 'dealer' ? 'S' : '';
            const quotationKeyid = v4()
            const reqData = JSON.parse(req.body.item) as IReqMplsDipchipnoneconsent

            /*... didn't use now ...*/
            const reqfile = files
            /*......................*/

            if (dbconnect) {

                if (dbconnect[0]) {

                    try {
                        const quotationKeyid = v4()
                        const living_place_key_id = v4()
                        const contact_place_key_id = v4()
                        const house_regis_place_key_id = v4()
                        const work_place_key_id = v4()

                        /* ... get referrene id ...*/
                        const result = dbconnect[0].execute(
                            `
                            DECLARE

                            refid  VARCHAR2(11);
                            BEGIN
                    
                            BTW.PROC_GEN_QUO_APP_REF_NO(:refid);
                    
                            END;
                        `, {
                            refid: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                        }, {
                            outFormat: 4002
                        })

                        const otprefid = ((await result).outBinds as { refid: string }).refid

                        if (otprefid) {
                            /*... gen refid success ...*/

                            try {

                                let cizcard_null = [];
                                let cizcard_array: any
                                let cizcard_image_blob: any;
                                if (reqData.cizcardImage) {
                                    cizcard_image_blob = reqData.cizcardImage ? cizcard_array = Buffer.from(reqData.cizcardImage, "base64") : cizcard_null
                                }

                                const quotation_econsent = await dbconnect[0].execute(
                                    `
                                    INSERT INTO MPLS_QUOTATION 
                                    (
                                        QUO_KEY_APP_ID,
                                        USER_ID,
                                        CIZCARD_IMAGE,
                                        TITLE_CODE,
                                        TITLE_NAME,
                                        FIRST_NAME,
                                        LAST_NAME,
                                        CIZ_GENDER,
                                        IDCARD_NUM,
                                        BIRTH_DATE,
                                        CIZ_ISSUED_DATE,
                                        CIZ_EXPIRED_DATE,
                                        CIZ_ISSUED_PLACE,
                                        CIZ_ADDRESS,
                                        CIZ_DISTRICT,
                                        CIZ_SUB_DISTRICT,
                                        CIZ_PROVINCE_NAME,
                                        CIZ_PROVINCE_CODE,
                                        CIZ_POSTAL_CODE,
                                        QUO_APP_REF_NO,
                                        CHANNAL_TYPE,
                                        CIZ_AGE,
                                        POLICY_AGE,
                                        IS_DIPCHIP_CHANNAL,
                                        QUO_DOPA_STATUS,
                                        DIPCHIP_UUID,
                                        QUO_LIVING_PLACE_ID,
                                        QUO_CONTRACT_PLACE_ID,
                                        QUO_WORKING_PLACE_ID,
                                        QUO_HOUSE_REGIS_PLACE_ID,
                                        QUO_STATUS
                                    )
                                    VALUES 
                                    (
                                        :QUO_KEY_APP_ID,
                                        :USER_ID,
                                        :CIZCARD_IMAGE,
                                        :TITLE_CODE,
                                        :TITLE_NAME,
                                        :FIRST_NAME,
                                        :LAST_NAME,
                                        :CIZ_GENDER,
                                        :IDCARD_NUM,
                                        :BIRTH_DATE,
                                        :CIZ_ISSUED_DATE,
                                        :CIZ_EXPIRED_DATE,
                                        :CIZ_ISSUED_PLACE,
                                        :CIZ_ADDRESS,
                                        :CIZ_DISTRICT,
                                        :CIZ_SUB_DISTRICT,
                                        :CIZ_PROVINCE_NAME,
                                        :CIZ_PROVINCE_CODE,
                                        :CIZ_POSTAL_CODE,
                                        :QUO_APP_REF_NO,
                                        :CHANNAL_TYPE,
                                        :CIZ_AGE,
                                        :POLICY_AGE,
                                        :IS_DIPCHIP_CHANNAL,
                                        :QUO_DOPA_STATUS,
                                        :DIPCHIP_UUID,
                                        :QUO_LIVING_PLACE_ID,
                                        :QUO_CONTRACT_PLACE_ID,
                                        :QUO_WORKING_PLACE_ID,
                                        :QUO_HOUSE_REGIS_PLACE_ID,
                                        :QUO_STATUS
                                    )
                                `
                                    , {

                                        QUO_KEY_APP_ID: quotationKeyid,
                                        USER_ID: userid,
                                        CIZCARD_IMAGE: cizcard_image_blob,
                                        TITLE_CODE: reqData.titleCode,
                                        TITLE_NAME: reqData.titleName,
                                        FIRST_NAME: reqData.firstName,
                                        LAST_NAME: reqData.lastName,
                                        CIZ_GENDER: reqData.gender,
                                        IDCARD_NUM: reqData.citizenId,
                                        BIRTH_DATE: (new Date(reqData.birthDate)) ?? null,
                                        CIZ_ISSUED_DATE: (new Date(reqData.issueDate)) ?? null,
                                        CIZ_EXPIRED_DATE: (new Date(reqData.expireDate)) ?? null,
                                        CIZ_ISSUED_PLACE: reqData.issuePlace,
                                        CIZ_ADDRESS: reqData.address,
                                        CIZ_DISTRICT: reqData.district,
                                        CIZ_SUB_DISTRICT: reqData.subDistrict,
                                        CIZ_PROVINCE_NAME: reqData.provinceName,
                                        CIZ_PROVINCE_CODE: reqData.provinceCode,
                                        CIZ_POSTAL_CODE: reqData.postalCode,
                                        QUO_APP_REF_NO: otprefid,
                                        CHANNAL_TYPE: channalstamp,
                                        CIZ_AGE: reqData.age ?? null,
                                        POLICY_AGE: (reqData.age && reqData.age < 20) ? 'N' : 'Y',
                                        IS_DIPCHIP_CHANNAL: 'Y',
                                        QUO_DOPA_STATUS: 'N',
                                        DIPCHIP_UUID: reqData.dipchipuuid,
                                        QUO_LIVING_PLACE_ID: living_place_key_id,
                                        QUO_CONTRACT_PLACE_ID: contact_place_key_id,
                                        QUO_WORKING_PLACE_ID: work_place_key_id,
                                        QUO_HOUSE_REGIS_PLACE_ID: house_regis_place_key_id,
                                        QUO_STATUS: 4

                                    }, {
                                    outFormat: 4002
                                })

                                const recLivingplace = await dbconnect[0].execute(
                                    `
                                    INSERT INTO MPLS_LIVING_PLACE (
                                        LIV_QUO_KEY_APP_ID, APP_KEY_ID
                                    )
                                    VALUES (
                                        :LIV_QUO_KEY_APP_ID, :APP_KEY_ID
                                    )
                                `, {
                                    LIV_QUO_KEY_APP_ID: quotationKeyid,
                                    APP_KEY_ID: living_place_key_id
                                })
                                // console.log(`living place create : ${recLivingplace.rowsAffected}`)

                                const recContactplace = await dbconnect[0].execute(
                                    `
                                    INSERT INTO MPLS_CONTACT_PLACE (
                                        CONT_QUO_KEY_APP_ID, APP_KEY_ID
                                    )
                                    VALUES (
                                        :CONT_QUO_KEY_APP_ID, :APP_KEY_ID
                                    )
                                `, {
                                    CONT_QUO_KEY_APP_ID: quotationKeyid,
                                    APP_KEY_ID: contact_place_key_id
                                })
                                // console.log(`contact place create : ${recContactplace.rowsAffected}`)

                                const recHouseregisplace = await dbconnect[0].execute(
                                    `
                                    INSERT INTO MPLS_HOUSE_REGIS_PLACE (
                                        HRP_QUO_KEY_APP_ID, APP_KEY_ID
                                    )
                                    VALUES (
                                        :HRP_QUO_KEY_APP_ID, :APP_KEY_ID
                                    )
                                `, {
                                    HRP_QUO_KEY_APP_ID: quotationKeyid,
                                    APP_KEY_ID: house_regis_place_key_id
                                })
                                // console.log(`house regis place create : ${recHouseregisplace.rowsAffected}`)

                                const recWorkplace = await dbconnect[0].execute(
                                    `
                                    INSERT INTO MPLS_WORK_PLACE (
                                        WORK_QUO_KEY_APP_ID, APP_KEY_ID
                                    )
                                    VALUES (
                                        :WORK_QUO_KEY_APP_ID, :APP_KEY_ID
                                    )
                                `, {
                                    WORK_QUO_KEY_APP_ID: quotationKeyid,
                                    APP_KEY_ID: work_place_key_id
                                })
                                // console.log(`work place create : ${recWorkplace.rowsAffected}`)

                                if (!(
                                    quotation_econsent.rowsAffected !== 1 &&
                                    recLivingplace.rowsAffected !== 1 &&
                                    recContactplace.rowsAffected !== 1 &&
                                    recHouseregisplace.rowsAffected !== 1 &&
                                    recWorkplace.rowsAffected !== 1
                                )) {
                                    /* ... try to commit stage ...*/
                                    const commitall = await dbconnect[0].commit();

                                    try {
                                        commitall

                                        /*... replace quo_key_app_id instead of * (11/11/2023) ...*/
                                        const sqlstring_getquotationkeyid = `SELECT QUO_KEY_APP_ID FROM MPLS_QUOTATION WHERE QUO_KEY_APP_ID = '${quotationKeyid}'`
                                        const resultQuotation = await dbconnect[0].execute(sqlstring_getquotationkeyid, [],
                                            {
                                                outFormat: 4002
                                            })

                                        if (resultQuotation) {

                                            if (resultQuotation.rows.length == 0) {

                                                let resData = resultQuotation.rows
                                                const lowerResData = this.utilService.toLowerKeys(resData) as ({ quo_key_app_id: string })
                                                let returnData = new Object as IResBasicReturnRecord
                                                returnData.data = [lowerResData]
                                                returnData.status = 200
                                                returnData.message = 'success'
                                                return res.status(200).json(returnData);

                                            } else {
                                                /* ... finish and return data ...*/
                                                const noresultFormatJson = {
                                                    status: 500,
                                                    message: 'No quotation Record'
                                                }
                                                return res.status(200).send(noresultFormatJson)
                                            }
                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `Can't find record quotation id after select`,
                                                data: []
                                            })
                                        }
                                    } catch (e) {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `Eror during try to commit : ${e.message}`,
                                            data: []
                                        })
                                    }
                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `สร้าง quotation econsent ไม่สำเร็จ`,
                                        data: []
                                    })
                                }

                            } catch (e) {
                                return res.status(200).send({
                                    status: 500,
                                    message: ` Error during update quotaiton or create relate table record (non-econsent) : ${e.message ? e.message : ` No return msg.`}`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่สามารถสร้างเลข ref_otp_id ได้ (non-econsent)`,
                                data: []
                            })
                        }
                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            message: ` Error during gen ref id num (non-econsent): ${e.message ? e.message : `No return msg.`} `,
                            data: []
                        })
                    }

                } else {
                    if (dbconnect[1]) {
                        const errRes = dbconnect[1]
                        return res.status(200).send({
                            status: 500,
                            message: `${errRes.message ? errRes.message : 'FAIL : No return msg form basicexe (non-econsent)'}`,
                            data: []
                        })
                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `FAIL : no error return from oracle (non-econsent)`,
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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_create_or_update_citizendata(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        // === จัดการการบันทึก quotation หน้าแรก โดนแบ่งเป็๋น 3 ประเภทของการทำรายการได้แก้
        // 1. บันทึกรายการจากการแก้ไข quotation ที่สร้างผ่าน dipchip (dipchip_uuid is not null)
        // 2. บันทึกรายการจากการแก้ไข quotation ที่สร้างผ่านการ key ข้อมูลเอง (manual) (dipchip_uuid = '')
        // 3. สร้าง quotation โดยการ key ข้อมูลเอง (quotationid = '' and dipchip_uuid = '')

        // *** ไม่ได้รองรับการสร้างเคสผ่าน dipchip (ใช้ api MPLS_dipchip แทน) เช็คจาก (quotationid = '' and dipchip_uuid is not null) ***
        // *** เพิ่มเงื่อนไขการเพิ่มข้อมูล postalCode จากบัตรประชาชนกรณีที่ไม่มีค่ารหัสไปรษณีย์เวลา dipchip (add-on) 20/02/2023 ***

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const token = user.ID
            const userid = user.ID
            const radmin = user.admin_role
            const channalstamp = user.channal === 'checker' ? 'C' : user.channal === 'dealer' ? 'S' : '';

            if (dbconnect) {

                if (dbconnect[0]) {

                    try {

                        /* ... Check Permission ... */
                        if (radmin !== 'Y') {

                            const reqData = req.body as IReqMplsCreateOrUpdateCitizendata

                            /* ... check create or update with (QUO_KEY_APP_ID) ...*/

                            let logstagestatus: string
                            let createorupdateQuery: string;
                            let createorupdateBind: {};
                            let createorupdateCondition: string;

                            // === boolean for fact is 'UPDATE' or 'CREATE' orther schema === (true : update, false : create) ===
                            let isUpdate: boolean;

                            let createorupdate_living_place_query: string;
                            let createorupdate_living_place_bind: {};

                            let createorupdate_contact_place_query: string;
                            let createorupdate_contact_place_bind: {};

                            let createorupdate_house_regis_place_query: string;
                            let createorupdate_house_regis_place_bind: {};

                            let createorupdate_work_regis_place_query: string;
                            let createorupdate_work_regis_place_bind: {};


                            /* ... get referrene id ...*/
                            try {

                                const quotationKeyid = v4()
                                const living_place_key_id = v4()
                                const contact_place_key_id = v4()
                                const house_regis_place_key_id = v4()
                                const work_place_key_id = v4()

                                /* ... get referrene id ...*/
                                const result = dbconnect[0].execute(
                                    `
                                        DECLARE

                                        refid  VARCHAR2(11);
                                        BEGIN
                                
                                        BTW.PROC_GEN_QUO_APP_REF_NO(:refid);
                                
                                        END;
                                    `, {
                                    refid: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
                                }, {
                                    outFormat: 4002
                                })

                                const otprefid = ((await result).outBinds as { refid: string }).refid

                                if (otprefid !== '' && otprefid !== null) {

                                    if (reqData.quotationid) {

                                        /* ... เช็คว่าเลข quotationid ตรงกับเงื่อนไขในการอัพเดท record ในระบบไหม ...*/
                                        try {

                                            const resultquodata = await dbconnect[0].execute(
                                                `
                                                    SELECT DIPCHIP_UUID, QUO_STATUS, APPLICATION_NUM 
                                                    FROM MPLS_QUOTATION
                                                    WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                                `,
                                                {
                                                    QUO_KEY_APP_ID: reqData.quotationid
                                                },
                                                {
                                                    outFormat: 4002
                                                }
                                            )

                                            if (resultquodata.rows.length == 1) {

                                                /* ... ตรวจสอบสถานะ quotation (quo_status) ถ้าเกิด APPLICATION_NUM NOT NULL จะไม่สามารถทำการ update ได้ ...*/
                                                /* ... เปลี่ยนมาดูจาก quo_status แทน (quo_status !== 1 && quo_status !== 3) ...*/

                                                try {

                                                    const quodata = this.utilService.toLowerKeys(resultquodata.rows[0]) as IExecQuodata
                                                    const quostatus = quodata.quo_status

                                                    if (quostatus !== 1 && quostatus !== 3) {
                                                        /* ...เช็คช่องทางการ update ว่า update quotation จากสถานะไหน... */
                                                        const dipchipid = quodata.dipchip_uuid
                                                        const isdipchip = (dipchipid !== null && dipchipid !== '') ? true : false

                                                        if (isdipchip) {
                                                            /* ...  1. update record (dipchip) ... */
                                                            /* ...  build mpls_quotation data only (other schema set next stage) ... */

                                                            isUpdate = true
                                                            logstagestatus = `update record (dipchip)`
                                                            createorupdateQuery = `
                                                            UPDATE MPLS_QUOTATION
                                                            SET
                                                                EMAIL = :EMAIL,
                                                                PHONE_NUMBER = :PHONE_NUMBER,
                                                                CIZ_MARIED_STATUS = :CIZ_MARIED_STATUS,
                                                                CIZ_NICKNAME = :CIZ_NICKNAME,
                                                                CIZ_HOUSE_TYPE = :CIZ_HOUSE_TYPE,
                                                                CIZ_HOUSE_OWNER_TYPE = :CIZ_HOUSE_OWNER_TYPE,
                                                                CIZ_STAYED_YEAR = :CIZ_STAYED_YEAR,
                                                                CIZ_STAYED_MONTH = :CIZ_STAYED_MONTH,
                                                                CIZ_POSTAL_CODE = :CIZ_POSTAL_CODE
                                                            WHERE
                                                                QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                                                AND DIPCHIP_UUID = :DIPCHIP_UUID       
                                                            `

                                                            createorupdateBind = {
                                                                EMAIL: reqData.email,
                                                                PHONE_NUMBER: reqData.phone_number,
                                                                CIZ_MARIED_STATUS: reqData.maried_status,
                                                                CIZ_NICKNAME: reqData.nick_name,
                                                                CIZ_HOUSE_TYPE: reqData.house_type,
                                                                CIZ_HOUSE_OWNER_TYPE: reqData.house_owner_type,
                                                                CIZ_STAYED_YEAR: reqData.stayed_year,
                                                                CIZ_STAYED_MONTH: reqData.stayed_month,
                                                                CIZ_POSTAL_CODE: reqData.postalCode,
                                                                QUO_KEY_APP_ID: reqData.quotationid,
                                                                DIPCHIP_UUID: dipchipid
                                                            }
                                                            /* ... End Building query ... */
                                                        } else {
                                                            /* ... 2. update record (manual) ... */
                                                            /* ... build mpls_quotation data only (other schema set next stage) ... */
                                                            isUpdate = true
                                                            logstagestatus = `update record (manual)`
                                                            createorupdateQuery = `
                                                            UPDATE MPLS_QUOTATION
                                                            SET 
                                                                USER_ID = :USER_ID,
                                                                TITLE_CODE = :TITLE_CODE,
                                                                TITLE_NAME = :TITLE_NAME,
                                                                FIRST_NAME = :FIRST_NAME,
                                                                LAST_NAME = :LAST_NAME,
                                                                CIZ_GENDER = :CIZ_GENDER,
                                                                IDCARD_NUM = :IDCARD_NUM,
                                                                BIRTH_DATE = :BIRTH_DATE,
                                                                CIZ_ISSUED_DATE = :CIZ_ISSUED_DATE,
                                                                CIZ_EXPIRED_DATE = :CIZ_EXPIRED_DATE,
                                                                CIZ_ISSUED_PLACE = :CIZ_ISSUED_PLACE,
                                                                CIZ_ADDRESS = :CIZ_ADDRESS,
                                                                CIZ_DISTRICT = :CIZ_DISTRICT,
                                                                CIZ_SUB_DISTRICT = :CIZ_SUB_DISTRICT,
                                                                CIZ_PROVINCE_NAME = :CIZ_PROVINCE_NAME,
                                                                CIZ_PROVINCE_CODE = :CIZ_PROVINCE_CODE,
                                                                CIZ_POSTAL_CODE = :CIZ_POSTAL_CODE,
                                                                CHANNAL_TYPE = :CHANNAL_TYPE,
                                                                CIZ_AGE = :CIZ_AGE,
                                                                POLICY_AGE = :POLICY_AGE,
                                                                EMAIL = :EMAIL,
                                                                PHONE_NUMBER = :PHONE_NUMBER,
                                                                CIZ_MARIED_STATUS = :CIZ_MARIED_STATUS,
                                                                CIZ_NICKNAME = :CIZ_NICKNAME,
                                                                CIZ_HOUSE_TYPE = :CIZ_HOUSE_TYPE,
                                                                CIZ_HOUSE_OWNER_TYPE = :CIZ_HOUSE_OWNER_TYPE,
                                                                CIZ_STAYED_YEAR = :CIZ_STAYED_YEAR,
                                                                CIZ_STAYED_MONTH = :CIZ_STAYED_MONTH
                                                            WHERE 
                                                                QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                                            `

                                                            createorupdateBind = {
                                                                USER_ID: userid,
                                                                TITLE_CODE: reqData.titleCode,
                                                                TITLE_NAME: reqData.titleName,
                                                                FIRST_NAME: reqData.firstName,
                                                                LAST_NAME: reqData.lastName,
                                                                CIZ_GENDER: reqData.gender,
                                                                IDCARD_NUM: reqData.citizenId,
                                                                BIRTH_DATE: (new Date(reqData.birthDate)) ?? null,
                                                                CIZ_ISSUED_DATE: (new Date(reqData.issueDate)) ?? null,
                                                                CIZ_EXPIRED_DATE: (new Date(reqData.expireDate)) ?? null,
                                                                CIZ_ISSUED_PLACE: reqData.issuePlace,
                                                                CIZ_ADDRESS: reqData.address,
                                                                CIZ_DISTRICT: reqData.district,
                                                                CIZ_SUB_DISTRICT: reqData.subDistrict,
                                                                CIZ_PROVINCE_NAME: reqData.provinceName,
                                                                CIZ_PROVINCE_CODE: reqData.provinceCode,
                                                                CIZ_POSTAL_CODE: reqData.postalCode,
                                                                CHANNAL_TYPE: channalstamp,
                                                                CIZ_AGE: reqData.age ?? null,
                                                                POLICY_AGE: (reqData.age && typeof reqData.age === 'number' && reqData.age < 20) ? 'N' : 'Y',
                                                                EMAIL: reqData.email,
                                                                PHONE_NUMBER: reqData.phone_number,
                                                                CIZ_MARIED_STATUS: reqData.maried_status,
                                                                CIZ_NICKNAME: reqData.nick_name,
                                                                CIZ_HOUSE_TYPE: reqData.house_type,
                                                                CIZ_HOUSE_OWNER_TYPE: reqData.house_owner_type,
                                                                CIZ_STAYED_YEAR: reqData.stayed_year,
                                                                CIZ_STAYED_MONTH: reqData.stayed_month,
                                                                QUO_KEY_APP_ID: reqData.quotationid
                                                            }
                                                            /* ... End Building query ... */
                                                        }

                                                    } else {
                                                        return res.status(200).send({
                                                            status: 500,
                                                            message: `สถานะรายการใบคำขออยู่ในขั้นส่งพิจารณาแล้วไม่สามารถแก้ไขข้อมูลได้`
                                                        })
                                                    }
                                                } catch (e) {
                                                    return res.status(200).send({
                                                        status: 500,
                                                        message: `ไม่สามารถอัพเดทข้อมูลได้ : ${e.message ? e.message : 'No return message'}`
                                                    })
                                                }

                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `ไม่สามารถระบุกรายการใบคำขอที่ต้องการ update ได้`,
                                                    data: []
                                                })
                                            }

                                        } catch (e) {
                                            return res.status(200).send({
                                                status: 500,
                                                mesage: `Fail to check dipchip_uuid : ${e.message ? e.message : `No return msg`}`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        /* ... Create method ...*/

                                        /* ... เช็คการสร้างเคสผ่านช่องทาง dipchip ... */
                                        /* ... กรณีมีเลข dipchip_uuid ไม่รองรับ ... */

                                        if (reqData.dipchipuuid !== '' && reqData.dipchipuuid !== null) {
                                            /* ... กรณีนี้ให้ไปใช่ MPLS_dipchip แทน ... */
                                            return res.status(200).send({
                                                satatus: 500,
                                                message: `ระบบไม่รองรับการทำรายการด้วยข้อมูลดังกล่าว ติดต่อเจ้าหน้าที่`
                                            })
                                        } else {
                                            /* ... 3. create quotation manual .l;.. */
                                            isUpdate = false
                                            logstagestatus = `create quotation manual`
                                            createorupdateQuery = `
                                            INSERT INTO MPLS_QUOTATION 
                                            (
                                                QUO_KEY_APP_ID,
                                                USER_ID,
                                                TITLE_CODE,
                                                TITLE_NAME,
                                                FIRST_NAME,
                                                LAST_NAME,
                                                CIZ_GENDER,
                                                IDCARD_NUM,
                                                BIRTH_DATE,
                                                CIZ_ISSUED_DATE,
                                                CIZ_EXPIRED_DATE,
                                                CIZ_ISSUED_PLACE,
                                                CIZ_ADDRESS,
                                                CIZ_DISTRICT,
                                                CIZ_SUB_DISTRICT,
                                                CIZ_PROVINCE_NAME,
                                                CIZ_PROVINCE_CODE,
                                                CIZ_POSTAL_CODE,
                                                QUO_APP_REF_NO,
                                                CHANNAL_TYPE,
                                                CIZ_AGE,
                                                POLICY_AGE,
                                                EMAIL, 
                                                PHONE_NUMBER, 
                                                CIZ_MARIED_STATUS, 
                                                CIZ_NICKNAME,
                                                CIZ_HOUSE_TYPE, 
                                                CIZ_HOUSE_OWNER_TYPE, 
                                                CIZ_STAYED_YEAR, 
                                                CIZ_STAYED_MONTH,
                                                IS_DIPCHIP_CHANNAL,
                                                QUO_DOPA_STATUS,
                                                QUO_LIVING_PLACE_ID,
                                                QUO_CONTRACT_PLACE_ID,
                                                QUO_WORKING_PLACE_ID,
                                                QUO_HOUSE_REGIS_PLACE_ID
                                            )
                                            VALUES 
                                            (
                                                :QUO_KEY_APP_ID,
                                                :USER_ID,
                                                :TITLE_CODE,
                                                :TITLE_NAME,
                                                :FIRST_NAME,
                                                :LAST_NAME,
                                                :CIZ_GENDER,
                                                :IDCARD_NUM,
                                                :BIRTH_DATE,
                                                :CIZ_ISSUED_DATE,
                                                :CIZ_EXPIRED_DATE,
                                                :CIZ_ISSUED_PLACE,
                                                :CIZ_ADDRESS,
                                                :CIZ_DISTRICT,
                                                :CIZ_SUB_DISTRICT,
                                                :CIZ_PROVINCE_NAME,
                                                :CIZ_PROVINCE_CODE,
                                                :CIZ_POSTAL_CODE,
                                                :QUO_APP_REF_NO,
                                                :CHANNAL_TYPE,
                                                :CIZ_AGE,
                                                :POLICY_AGE,
                                                :EMAIL, 
                                                :PHONE_NUMBER, 
                                                :CIZ_MARIED_STATUS, 
                                                :CIZ_NICKNAME, 
                                                :CIZ_HOUSE_TYPE, 
                                                :CIZ_HOUSE_OWNER_TYPE, 
                                                :CIZ_STAYED_YEAR, 
                                                :CIZ_STAYED_MONTH,
                                                :IS_DIPCHIP_CHANNAL,
                                                :QUO_DOPA_STATUS,
                                                :QUO_LIVING_PLACE_ID,
                                                :QUO_CONTRACT_PLACE_ID,
                                                :QUO_WORKING_PLACE_ID,
                                                :QUO_HOUSE_REGIS_PLACE_ID
                                            )`

                                            createorupdateBind = {
                                                QUO_KEY_APP_ID: quotationKeyid,
                                                USER_ID: userid,
                                                TITLE_CODE: reqData.titleCode,
                                                TITLE_NAME: reqData.titleName,
                                                FIRST_NAME: reqData.firstName,
                                                LAST_NAME: reqData.lastName,
                                                CIZ_GENDER: reqData.gender,
                                                IDCARD_NUM: reqData.citizenId,
                                                BIRTH_DATE: (new Date(reqData.birthDate)) ?? null,
                                                CIZ_ISSUED_DATE: (new Date(reqData.issueDate)) ?? null,
                                                CIZ_EXPIRED_DATE: (new Date(reqData.expireDate)) ?? null,
                                                CIZ_ISSUED_PLACE: reqData.issuePlace,
                                                CIZ_ADDRESS: reqData.address,
                                                CIZ_DISTRICT: reqData.district,
                                                CIZ_SUB_DISTRICT: reqData.subDistrict,
                                                CIZ_PROVINCE_NAME: reqData.provinceName,
                                                CIZ_PROVINCE_CODE: reqData.provinceCode,
                                                CIZ_POSTAL_CODE: reqData.postalCode,
                                                QUO_APP_REF_NO: otprefid,
                                                CHANNAL_TYPE: 'C',
                                                CIZ_AGE: reqData.age ?? null,
                                                POLICY_AGE: (reqData.age && typeof reqData.age === 'number' && reqData.age < 20) ? 'N' : 'Y',
                                                EMAIL: reqData.email,
                                                PHONE_NUMBER: reqData.phone_number,
                                                CIZ_MARIED_STATUS: reqData.maried_status,
                                                CIZ_NICKNAME: reqData.nick_name,
                                                CIZ_HOUSE_TYPE: reqData.house_type,
                                                CIZ_HOUSE_OWNER_TYPE: reqData.house_owner_type,
                                                CIZ_STAYED_YEAR: reqData.stayed_year,
                                                CIZ_STAYED_MONTH: reqData.stayed_month,
                                                IS_DIPCHIP_CHANNAL: 'N',
                                                QUO_DOPA_STATUS: 'N',
                                                QUO_LIVING_PLACE_ID: living_place_key_id,
                                                QUO_CONTRACT_PLACE_ID: contact_place_key_id,
                                                QUO_WORKING_PLACE_ID: work_place_key_id,
                                                QUO_HOUSE_REGIS_PLACE_ID: work_place_key_id
                                            }
                                            /* ... End Building query ... */

                                        }
                                    }
                                    /* ... build query success ... */

                                    /* ... combine query and bind paremeter here ... */

                                    /* ... update or create quotation ... */

                                    /* ... bind other schema with check isUpdate ... */

                                    if (isUpdate) {
                                        // === update ===

                                        // === MPLS_LIVING_PLACE ===
                                        createorupdate_living_place_query = `
                                            UPDATE MPLS_LIVING_PLACE
                                            SET 
                                                ADDRESS = :ADDRESS,
                                                SUB_DISTRICT = :SUB_DISTRICT,
                                                DISTRICT = :DISTRICT,
                                                PROVINCE_NAME = :PROVINCE_NAME,
                                                PROVINCE_CODE = :PROVINCE_CODE,
                                                POSTAL_CODE = :POSTAL_CODE,
                                                LATITUDE = :LA,
                                                LONDTIUDE = :LON,
                                                LALON = :LALON
                                            WHERE
                                                LIV_QUO_KEY_APP_ID = :LIV_QUO_KEY_APP_ID
                                        `

                                        createorupdate_living_place_bind = {
                                            ADDRESS: reqData.liv_address,
                                            SUB_DISTRICT: reqData.liv_sub_district,
                                            DISTRICT: reqData.liv_district,
                                            PROVINCE_NAME: reqData.liv_province_name,
                                            PROVINCE_CODE: reqData.liv_province_code,
                                            POSTAL_CODE: reqData.liv_postal_code,
                                            LA: reqData.liv_la,
                                            LON: reqData.liv_lon,
                                            LALON: reqData.liv_lalon,
                                            LIV_QUO_KEY_APP_ID: reqData.quotationid
                                        }

                                        // === MPLS_CONTACT_PLACE ===

                                        createorupdate_contact_place_query = `
                                            UPDATE MPLS_CONTACT_PLACE
                                            SET 
                                                ADDRESS = :ADDRESS,
                                                SUB_DISTRICT = :SUB_DISTRICT,
                                                DISTRICT = :DISTRICT,
                                                PROVINCE_NAME = :PROVINCE_NAME,
                                                PROVINCE_CODE = :PROVINCE_CODE,
                                                POSTAL_CODE = :POSTAL_CODE
                                            WHERE
                                                CONT_QUO_KEY_APP_ID = :CONT_QUO_KEY_APP_ID
                                        `

                                        createorupdate_contact_place_bind = {
                                            ADDRESS: reqData.cont_address,
                                            SUB_DISTRICT: reqData.cont_sub_district,
                                            DISTRICT: reqData.cont_district,
                                            PROVINCE_NAME: reqData.cont_province_name,
                                            PROVINCE_CODE: reqData.cont_province_code,
                                            POSTAL_CODE: reqData.cont_postal_code,
                                            CONT_QUO_KEY_APP_ID: reqData.quotationid,
                                        }

                                        // === MPLS_HOUSE_REGIS_PLACE ===

                                        createorupdate_house_regis_place_query = `
                                            UPDATE MPLS_HOUSE_REGIS_PLACE
                                            SET 
                                                ADDRESS = :ADDRESS,
                                                SUB_DISTRICT = :SUB_DISTRICT,
                                                DISTRICT = :DISTRICT,
                                                PROVINCE_NAME = :PROVINCE_NAME,
                                                PROVINCE_CODE = :PROVINCE_CODE,
                                                POSTAL_CODE = :POSTAL_CODE
                                            WHERE
                                                HRP_QUO_KEY_APP_ID = :HRP_QUO_KEY_APP_ID
                                        `

                                        createorupdate_house_regis_place_bind = {
                                            ADDRESS: reqData.hrp_address,
                                            SUB_DISTRICT: reqData.hrp_sub_district,
                                            DISTRICT: reqData.hrp_district,
                                            PROVINCE_NAME: reqData.hrp_province_name,
                                            PROVINCE_CODE: reqData.hrp_province_code,
                                            POSTAL_CODE: reqData.hrp_postal_code,
                                            HRP_QUO_KEY_APP_ID: reqData.quotationid,
                                        }

                                        // === MPLS_WORK_PLACE ===

                                        createorupdate_work_regis_place_query = `
                                            UPDATE MPLS_WORK_PLACE
                                                SET 
                                                    ADDRESS = :ADDRESS,
                                                    SUB_DISTRICT = :SUB_DISTRICT,
                                                    DISTRICT = :DISTRICT,
                                                    PROVINCE_NAME = :PROVINCE_NAME,
                                                    PROVINCE_CODE = :PROVINCE_CODE,
                                                    POSTAL_CODE = :POSTAL_CODE,
                                                    DESCRIPTION = :DESCRIPTION
                                                WHERE
                                                    WORK_QUO_KEY_APP_ID = :WORK_QUO_KEY_APP_ID`

                                        createorupdate_work_regis_place_bind = {
                                            ADDRESS: reqData.work_address,
                                            SUB_DISTRICT: reqData.work_sub_district,
                                            DISTRICT: reqData.work_district,
                                            PROVINCE_NAME: reqData.work_province_name,
                                            PROVINCE_CODE: reqData.work_province_code,
                                            POSTAL_CODE: reqData.work_postal_code,
                                            DESCRIPTION: reqData.work_description,
                                            WORK_QUO_KEY_APP_ID: reqData.quotationid,
                                        }


                                    } else {
                                        // === create ===

                                        // === MPLS_LIVING_PLACE ===
                                        createorupdate_living_place_query = `
                                            INSERT INTO MPLS_LIVING_PLACE (
                                                LIV_QUO_KEY_APP_ID, APP_KEY_ID, ADDRESS, SUB_DISTRICT, 
                                                DISTRICT, PROVINCE_NAME, PROVINCE_CODE, POSTAL_CODE, LATITUDE, LONDTIUDE, LALON
                                            )
                                            VALUES (
                                                :LIV_QUO_KEY_APP_ID, :APP_KEY_ID, :ADDRESS, :SUB_DISTRICT, 
                                                :DISTRICT, :PROVINCE_NAME, :PROVINCE_CODE, :POSTAL_CODE, :LATITUDE, :LONDTIUDE, :LALON
                                            )`

                                        createorupdate_living_place_bind = {
                                            LIV_QUO_KEY_APP_ID: quotationKeyid,
                                            APP_KEY_ID: living_place_key_id,
                                            ADDRESS: reqData.liv_address,
                                            SUB_DISTRICT: reqData.liv_sub_district,
                                            DISTRICT: reqData.liv_district,
                                            PROVINCE_NAME: reqData.liv_province_name,
                                            PROVINCE_CODE: reqData.liv_province_code,
                                            POSTAL_CODE: reqData.liv_postal_code,
                                            LATITUDE: reqData.liv_la,
                                            LONDTIUDE: reqData.liv_lon,
                                            LALON: reqData.liv_lalon
                                        }

                                        // === MPLS_CONTACT_PLACE ===
                                        createorupdate_contact_place_query = `
                                        INSERT INTO MPLS_CONTACT_PLACE (
                                            CONT_QUO_KEY_APP_ID, APP_KEY_ID, ADDRESS, SUB_DISTRICT, 
                                            DISTRICT, PROVINCE_NAME, PROVINCE_CODE, POSTAL_CODE
                                        )
                                        VALUES (
                                            :CONT_QUO_KEY_APP_ID, :APP_KEY_ID, :ADDRESS, :SUB_DISTRICT, 
                                            :DISTRICT, :PROVINCE_NAME, :PROVINCE_CODE, :POSTAL_CODE
                                        )`

                                        createorupdate_contact_place_bind = {
                                            CONT_QUO_KEY_APP_ID: quotationKeyid,
                                            APP_KEY_ID: contact_place_key_id,
                                            ADDRESS: reqData.cont_address,
                                            SUB_DISTRICT: reqData.cont_sub_district,
                                            DISTRICT: reqData.cont_district,
                                            PROVINCE_NAME: reqData.cont_province_name,
                                            PROVINCE_CODE: reqData.cont_province_code,
                                            POSTAL_CODE: reqData.cont_postal_code
                                        }

                                        // === MPLS_HOUSE_REGIS_PLACE ===

                                        createorupdate_house_regis_place_query = `
                                        INSERT INTO MPLS_HOUSE_REGIS_PLACE (
                                            HRP_QUO_KEY_APP_ID, APP_KEY_ID, ADDRESS, SUB_DISTRICT, 
                                            DISTRICT, PROVINCE_NAME, PROVINCE_CODE, POSTAL_CODE
                                        )
                                        VALUES (
                                            :HRP_QUO_KEY_APP_ID, :APP_KEY_ID, :ADDRESS, :SUB_DISTRICT, 
                                            :DISTRICT, :PROVINCE_NAME, :PROVINCE_CODE, :POSTAL_CODE
                                        )`

                                        createorupdate_house_regis_place_bind = {
                                            HRP_QUO_KEY_APP_ID: quotationKeyid,
                                            APP_KEY_ID: house_regis_place_key_id,
                                            ADDRESS: reqData.hrp_address,
                                            SUB_DISTRICT: reqData.hrp_sub_district,
                                            DISTRICT: reqData.hrp_district,
                                            PROVINCE_NAME: reqData.hrp_province_name,
                                            PROVINCE_CODE: reqData.hrp_province_code,
                                            POSTAL_CODE: reqData.hrp_postal_code
                                        }

                                        // === MPLS_WORK_PLACE ====

                                        createorupdate_work_regis_place_query = `
                                        INSERT INTO MPLS_WORK_PLACE (
                                            WORK_QUO_KEY_APP_ID, APP_KEY_ID, ADDRESS, SUB_DISTRICT, 
                                            DISTRICT, PROVINCE_NAME, PROVINCE_CODE, POSTAL_CODE, DESCRIPTION 
                                        )
                                        VALUES (
                                            :WORK_QUO_KEY_APP_ID, :APP_KEY_ID, :ADDRESS, :SUB_DISTRICT, 
                                            :DISTRICT, :PROVINCE_NAME, :PROVINCE_CODE, :POSTAL_CODE, :DESCRIPTION 
                                        )`

                                        createorupdate_work_regis_place_bind = {
                                            WORK_QUO_KEY_APP_ID: quotationKeyid,
                                            APP_KEY_ID: work_place_key_id,
                                            ADDRESS: reqData.work_address,
                                            SUB_DISTRICT: reqData.work_sub_district,
                                            DISTRICT: reqData.work_district,
                                            PROVINCE_NAME: reqData.work_province_name,
                                            PROVINCE_CODE: reqData.work_province_code,
                                            POSTAL_CODE: reqData.work_postal_code,
                                            DESCRIPTION: reqData.work_description
                                        }
                                    }

                                    /* ..... MPLS_QUOTATION ..... */

                                    let quotationexecute: oracledb.Result<any>;
                                    let livingplaceexcecute: oracledb.Result<any>;
                                    let contactplaceexecute: oracledb.Result<any>;
                                    let houseregisplaceexecute: oracledb.Result<any>;
                                    let workplaceexecute: oracledb.Result<any>;

                                    try {
                                        quotationexecute = await dbconnect[0].execute(createorupdateQuery, createorupdateBind, { outFormat: 4002 })
                                        console.log(`success ${logstagestatus} (MPLS_QUOTATION) : ${quotationexecute.rowsAffected}`)
                                    } catch (e) {

                                        console.log(`error ${logstagestatus} (MPLS_QUOTATION) : ${e.message ? e.message : `No return message`}`)
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ข้อมูล MPLS_QUOTATION ไม่ถูกต้อง : ${e.message ? e.message : `No return message`}`
                                        })
                                    }

                                    /* ... MPLS_LIVING_PLACE ... */

                                    try {
                                        livingplaceexcecute = await dbconnect[0].execute(createorupdate_living_place_query, createorupdate_living_place_bind, { outFormat: 4002 })
                                        console.log(`success ${logstagestatus} (MPLS_LIVING_PLACE) : ${livingplaceexcecute.rowsAffected}`)
                                    } catch (e) {
                                        console.log(`error ${logstagestatus} (MPLS_LIVING_PLACE) : ${e.message ? e.message : `No return message`}`)
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ข้อมูล MPLS_LIVING_PLACE ไม่ถูกต้อง : ${e.message ? e.message : `No return message`}`
                                        })
                                    }

                                    /* ... MPLS_CONTACT_PLACE ... */

                                    try {
                                        contactplaceexecute = await dbconnect[0].execute(createorupdate_contact_place_query, createorupdate_contact_place_bind, { outFormat: 4002 })
                                        console.log(`success ${logstagestatus} (MPLS_CONTACT_PLACE) : ${contactplaceexecute.rowsAffected}`)
                                    } catch (e) {
                                        console.log(`error ${logstagestatus} (MPLS_CONTACT_PLACE) : ${e}`)
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ข้อมูล MPLS_CONTACT_PLACE ไม่ถูกต้อง : ${e.message ? e.message : `No return message`}`
                                        })
                                    }

                                    /* ... MPLS_HOUSE_REGIS_PLACE ... */

                                    try {
                                        houseregisplaceexecute = await dbconnect[0].execute(createorupdate_house_regis_place_query, createorupdate_house_regis_place_bind, { outFormat: 4002 })
                                        console.log(`success ${logstagestatus} (MPLS_HOUSE_REGIS_PLACE) : ${houseregisplaceexecute.rowsAffected}`)
                                    } catch (e) {
                                        console.log(`error ${logstagestatus} (MPLS_HOUSE_REGIS_PLACE) : ${e}`)
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ข้อมูล MPLS_HOUSE_REGIS_PLACE ไม่ถูกต้อง : ${e.message ? e.message : `No return message`}`
                                        })
                                    }
                                    /* ... MPLS_WORK_PLACE ... */

                                    try {
                                        workplaceexecute = await dbconnect[0].execute(createorupdate_work_regis_place_query, createorupdate_work_regis_place_bind, { outFormat: 4002 })
                                        console.log(`success ${logstagestatus} (MPLS_WORK_PLACE) : ${workplaceexecute.rowsAffected}`)
                                    } catch (e) {
                                        console.log(`error ${logstagestatus} (MPLS_WORK_PLACE) : ${e}`)
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ข้อมูล MPLS_WORK_PLACE ไม่ถูกต้อง : ${e.message ? e.message : `No return message`}`
                                        })
                                    }

                                    /* ... check all result ... */

                                    if (
                                        quotationexecute.rowsAffected === 1 &&
                                        livingplaceexcecute.rowsAffected === 1 &&
                                        contactplaceexecute.rowsAffected === 1 &&
                                        houseregisplaceexecute.rowsAffected === 1 &&
                                        workplaceexecute.rowsAffected === 1
                                    ) {
                                        /* ... finish ... */

                                        const commitall = await dbconnect[0].commit();

                                        try {
                                            commitall

                                            // === return success message ====
                                            const returnquotationid = isUpdate ? reqData.quotationid : quotationKeyid

                                            return res.status(200).send({
                                                status: 200,
                                                message: `success all create or update citizen info data`,
                                                data: {
                                                    quotationid: returnquotationid
                                                }
                                            })
                                        } catch (e) {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `Eror commit stage : ${e.message}`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        /* ... fail to update citizen info data to database ... */
                                        return res.status(200).send({
                                            status: 500,
                                            message: `fail to create or update citizen info data`,
                                            data: []
                                        })
                                    }

                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `ไม่สามารถสร้างเลข ref_otp_id ได้`,
                                        data: []
                                    })
                                }

                            } catch (e) {
                                return res.status(200).send({
                                    status: 500,
                                    message: ` Error during gen ref id num (non-econsent): ${e.message ? e.message : `No return msg.`} `,
                                    data: []
                                })
                            }

                        } else {
                            /* ... return status with no permission ...*/
                            return res.status(403).send({
                                status: 403,
                                message: `No permission to create quotation`,
                                data: []
                            })
                        }


                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            mesage: `Fail to execute sql : ${e.message ? e.message : `No return msg`}`,
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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_update_phone_number(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body.item) as PReqMplsUpdatePhoneNumber

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check parameter contain ... */
                    if (
                        reqData.phone_number !== null &&
                        reqData.phone_number !== '' &&
                        reqData.quotationid !== null &&
                        reqData.quotationid !== ''
                    ) {
                        try {

                            /* ... check duplicate quotation and owner record ...*/

                            /* ... check duplicate quotation ... */
                            const resultcheckowner = await dbconnect[0].execute(`
                                SELECT USER_ID
                                FROM MPLS_QUOTATION
                                WHERE QUO_KEY_APP_ID = :quotationid
                        `, {
                                quotationid: reqData.quotationid
                            }, {
                                outFormat: 4002,
                            })

                            if (resultcheckowner.rows.length == 1) {

                                /* ... check owner record ... */
                                const checkowner = this.utilService.toLowerKeys(resultcheckowner.rows[0]) as { user_id: string }

                                if (checkowner.user_id == userid) {

                                    /* .... update quotation phone number ... */
                                    const updatephonenumber = await dbconnect[0].execute(
                                        `
                                            UPDATE MPLS_QUOTATION  
                                            SET PHONE_NUMBER = :phone_number 
                                            WHERE QUO_KEY_APP_ID = :quotationid
                                        `
                                        , {
                                            phone_number: reqData.phone_number,
                                            quotationid: reqData.quotationid
                                        }, {
                                        outFormat: 4002
                                    })

                                    if (updatephonenumber.rowsAffected == 1) {

                                        /* ... commit and return ... */
                                        const commitall = await dbconnect[0].commit();

                                        try {
                                            commitall

                                            /* ... finish ... */
                                            console.log(`return true`)
                                            return res.status(200).send({
                                                status: true,
                                                message: `success`,
                                                data: []
                                            })
                                        } catch (e) {
                                            return res.send(200).send({
                                                status: 500,
                                                message: `Eror commit stage : ${e.message}`,
                                                data: []
                                            })
                                        }
                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `เงื่อนไขในการอัพเดทไม่ถูกต้อง`,
                                            data: []
                                        })
                                    }
                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        mesage: `No permission (didn't math with owner quotation)`,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `Can't Identify quotation record (duplicate)`,
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
                        return res.status(200).send({
                            status: 500,
                            message: `mission parameter arguement`,
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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    /* .. Recheck .. */
    async MPLS_check_secondhand_car_image_attach(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqMplsCheckSecondhandCarImageAttach

            /* ... check parameter quotationid ... */

            if (
                reqData.quotationid !== '' &&
                reqData.quotationid !== null &&
                reqData.contract_ref !== '' &&
                reqData.contract_ref !== null
            ) {
                if (dbconnect) {

                    if (dbconnect[0]) {

                        try {
                            /* ... check quotation record is exists ... */

                            const chkquotationexec = await dbconnect[0].execute(
                                `
                                    SELECT QUO.QUO_KEY_APP_ID, QUO.QUO_STATUS , CRE.CONTRACT_REF
                                    FROM MPLS_QUOTATION QUO, MPLS_CREDIT CRE
                                    WHERE QUO.QUO_KEY_APP_ID = :QUOTATIONID
                                    AND QUO.QUO_KEY_APP_ID = CRE.CRE_QUO_KEY_APP_ID
                                `, {
                                QUOTATIONID: reqData.quotationid
                            }, {
                                outFormat: 4002
                            })

                            const chkquotation = this.utilService.toLowerKeys(chkquotationexec.rows[0]) as IExecChkquotation

                            if (chkquotationexec.rows.length == 1) {
                                /* ... check status ... */

                                if (chkquotation.quo_status == 1) {
                                    // **** check secondhand car image attach valid ****
                                    const checkvalidsecondhandcarexec = await dbconnect[0].execute(
                                        `
                                            SELECT MPC.CRE_QUO_KEY_APP_ID AS QUOTATIONID, MPC.APP_KEY_ID AS CREDITID, MPI.VALID_FIELD
                                            FROM 
                                                MPLS_CREDIT MPC, 
                                                (
                                                    SELECT 
                                                        CASE WHEN COUNT(CASE WHEN IMGF.IMAGE_CODE = '12' THEN IMGF.IMAGE_CODE END) >= 2 
                                                            THEN 'Y' ELSE 'N' 
                                                        END AS VALID_FIELD 
                                                    FROM 
                                                        MPLS_IMAGE_FILE IMGF 
                                                    WHERE 
                                                        IMGF.IMGF_QUO_APP_KEY_ID = :QUOTATIONID
                                                ) MPI
                                            WHERE MPC.CRE_QUO_KEY_APP_ID = :QUOTATIONID 
                                        `, {
                                        QUOTATIONID: reqData.quotationid
                                    }, {
                                        outFormat: 4002
                                    })

                                    /* ... check valid image attach status for secondhand car ... */
                                    if (checkvalidsecondhandcarexec.rows.length == 1) {
                                        /* ... check valid is 'Y' ... */
                                        const checkvalidsecondhandcar = this.utilService.toLowerKeys(checkvalidsecondhandcarexec.rows[0]) as IExecCheckvalidsecondhandcar
                                        if (checkvalidsecondhandcar.valid_field == 'Y') {
                                            /* ... valid ... */
                                            let resData = checkvalidsecondhandcar
                                            const lowerResData = resData as IResMplsCheckSecondhandCarImageAttachData
                                            let returnData = new Object as IResMplsCheckSecondhandCarImageAttach
                                            returnData.data = lowerResData

                                            returnData.contract_ref_change = (chkquotation.contract_ref == reqData.contract_ref) ? false : true
                                            returnData.status = true
                                            returnData.valid = (returnData.contract_ref_change) ? false : true
                                            returnData.message = 'success'
                                            return res.status(200).json(returnData);

                                        } else {
                                            /* ... not valid ... */
                                            return res.status(200).send({
                                                status: true,
                                                valid: false,
                                                message: `not valid (image attach)`
                                            })
                                        }
                                    } else {
                                        return res.status(200).send({
                                            status: false,
                                            valid: false,
                                            message: `ไม่พบผลการตรวจสอบสถานะประเภทสินค้า`
                                        })
                                    }

                                } else {
                                    return res.status(200).send({
                                        status: false,
                                        valid: false,
                                        message: `สถานะใบคำขออยู่ในขั้นพิจารณา ไม่สามารถแก้ไขข้อมูลได้`,
                                    })
                                }

                            } else {
                                try {

                                    /* ... check is new case ( have quo id but no credit id ) ... */
                                    const checkquoidrecentexc = await dbconnect[0].execute(
                                        `
                                            SELECT QUO_KEY_APP_ID 
                                            FROM MPLS_QUOTATION
                                            WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                        `, {
                                        QUO_KEY_APP_ID: reqData.quotationid
                                    }, {
                                        outFormat: 4002
                                    })

                                    if (checkquoidrecentexc.rows.length == 1) {
                                        /* ...  is new case (return valid status) ... */
                                        return res.status(200).send({
                                            status: 200,
                                            message: `succcess`,
                                            valid: false,
                                            newcase: true
                                        })
                                    } else {
                                        /* ... finish ...*/
                                        return res.status(200).send({
                                            status: false,
                                            valid: false,
                                            message: `เลข quotaion ไอดี ไม่สามารถระบุใบคำขอได้`
                                        })
                                        /* ... End ... */
                                    }
                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        mesage: `Fail to check secondhand car image attach : ${e.message ? e.message : `No return msg`}`,
                                        data: []
                                    })
                                }
                            }
                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                mesage: `Fail to check secondhand car image attach : ${e.message ? e.message : `No return msg`}`,
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
            } else {
                return res.status(200).send({
                    status: false,
                    valid: false,
                    message: `ไม่พบ parameter : (quotationid : ${reqData.quotationid}, contract_ref: ${reqData.contract_ref})`
                })
            }

        } catch (e) {
            return res.status(200).send({
                status: 500,
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_create_or_update_credit(@UploadedFiles() files: { image_file?: Array<Express.Multer.File> }, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body.item) as IReqMplsCreateOrUpdateCredit

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check permission ... */
                    if (radmin !== 'Y') {

                        /* ... check parameter quotationid ... */

                        const checkquotationexec = await dbconnect[0].execute(
                            `
                            SELECT QUO_KEY_APP_ID, QUO_STATUS 
                            FROM MPLS_QUOTATION
                            WHERE QUO_KEY_APP_ID = :QUOTATIONID
                        `, {
                            QUOTATIONID: reqData.quotationid
                        }, {
                            outFormat: 4002
                        })

                        if (checkquotationexec.rows.length == 1) {

                            const checkquotation = this.utilService.toLowerKeys(checkquotationexec.rows[0]) as IExecCheckquotationexec

                            /* ... record is already exists ... */

                            const chkcreditexec = await dbconnect[0].execute(
                                `
                                    SELECT * FROM MPLS_CREDIT
                                    WHERE CRE_QUO_KEY_APP_ID = :QUOTATIONID
                                `, {
                                QUOTATIONID: reqData.quotationid
                            }, {
                                outFormat: 4002
                            })

                            /* ... set format date of reg_date parameter ... */
                            let reg_date_dtype;
                            if (reqData.reg_date) {
                                const reg_date_current = moment(new Date(reqData.reg_date)).format("DD/MM/YYYY")
                                reg_date_dtype = reg_date_current
                                console.log(`this is reg_date : ${reg_date_dtype}`)
                            } else {
                                reg_date_dtype = null
                            }

                            /* ... seperate way with 2 senario ...*/
                            if (chkcreditexec.rows.length !== 0) {
                                /* ... senario 1 : No MPLS_credit ...*/

                                const chkcredit = this.utilService.toLowerKeys(chkcreditexec.rows[0]) as IExecChkcredit
                                /* ... identity mpls_credit record ...*/
                                if (chkcreditexec.rows.length == 1) {
                                    /* ... check quo_status === (if MPLS_QUOTATION.QUO_STATUS = 1 : can't update record) ... */
                                    if (checkquotation.quo_status !== 1) {

                                        /* ... Update Credit ... */

                                        try {
                                            console.log(`update credit`)
                                            if (reqData.bussiness_code == '002' || reqData.bussiness_code == '003') {
                                                const checksecondhancdcaractiveexec = await dbconnect[0].execute(
                                                    `
                                                    SELECT CONTRACT_NO as CONTRACT_REF FROM 
                                                    (
                                                        SELECT  REG_NO,prov_name,  BRAND_NAME,MODEL_NAME,COLOR ,CC ,ENGINE_NUMBER,ENGINE_NO_RUNNING,
                                                                CHASSIS_NUMBER, CHASSIS_NO_RUNNING, REG_DATE,
                                                                PROV_CODE, PRODUC,BRAND_CODE,MODEL_CODE, MODEL_YEAR, APPLICATION_NUM , CONTRACT_NO , SL_CODE ,AUCTION_CODE
                                                                FROM(
                                                                SELECT  D.APPLICATION_NUM , D.CONTRACT_NO , C.SL_CODE ,C.AUCTION_CODE , G.REG_NO REG_NO,
                                                                BTW.F_GET_PROVINCE_NAME(E.REG_CITY) AS PROV_NAME, BTW.GET_BRAND_NAME(E.PRODUC ,E.BRAND_CODE) AS BRAND_NAME,
                                                                F.MODEL AS MODEL_NAME,E.COLOR ,F.CC, F.MODEL_YEAR ,G.ENGINE_NUMBER,G.ENGINE_NO_RUNNING,
                                                                G.CHASSIS_NUMBER, G.CHASSIS_NO_RUNNING,
                                                                E.REG_CITY prov_code,E.PRODUC,E.BRAND_CODE,E.MODEL_CODE,TRUNC(G.REG_DATE) AS REG_DATE
                                                                FROM BTW.COLL_RECIEPT A, BTW.X_RECEIVE B, BTW.X_REPOSSESS_AUCTION_P C , BTW.X_CUST_MAPPING_EXT D, BTW.AC_PROVE E, BTW.X_MODEL_P F,
                                                                BTW.X_PRODUCT_DETAIL G
                                                                WHERE A.RECEIPT_NUMBER_PREFIX = B.RECEIPT_NUMBER_PREFIX
                                                                AND A.RECEIPT_NUMBER_POSTFIX = B.RECEIPT_NUMBER_POSTFIX
                                                                AND A.HP_NO = B.CONTRACT_NO
                                                                AND B.AUCTION_CODE = C.AUCTION_CODE
                                                                AND A.HP_NO = D.CONTRACT_NO
                                                                AND E.HP_NO = D.CONTRACT_NO
                                                                AND E.PRODUC = F.PRO_CODE
                                                                AND C.SL_CODE = (SELECT DL_CODE FROM X_DEALER_P WHERE DL_CODE = C.SL_CODE AND ACTIVE_STATUS = 'Y')
                                                                AND E.BRAND_CODE = F.BRAND_CODE
                                                                AND E.MODEL_CODE = F.MODEL_CODE
                                                                AND G.APPLICATION_NUM =D.APPLICATION_NUM
                                                                AND D.BUSSINESS_CODE IN ('001','002')
                                                                AND A.PAY_CODE IN ('80','81')
                                                                AND NVL(A.CANCELL,'F') = 'F'
                                                                AND BTW.GET_MOTO_AGE (TRUNC(G.REG_DATE),TRUNC(SYSDATE)) <= BTW.GET_VALUE_NUM_MARKET_SETTING ('005','002',E.PRODUC ,E.BRAND_CODE ,E.MODEL_CODE ,C.SL_CODE ,TRUNC(SYSDATE))
                                                                AND D.CONTRACT_NO NOT IN (
                                                                                            SELECT DISTINCT CONTRACT_REF
                                                                                            FROM X_PRODUCT_DETAIL A,X_CUST_MAPPING_EXT B
                                                                                            WHERE A.APPLICATION_NUM = B.APPLICATION_NUM
                                                                                            AND  B.BUSSINESS_CODE = '002'
                                                                                            AND (B.LOAN_RESULT in ('Y','Z','W') OR B.LOAN_RESULT IS NULL)
                                                                                            AND a.REG_NO = G.REG_NO 
                                                                                            UNION
                                                                                            SELECT DISTINCT CD.CONTRACT_REF 
                                                                                            FROM MPLS_CREDIT CD, MPLS_QUOTATION QUO
                                                                                            WHERE CD.CRE_QUO_KEY_APP_ID = QUO.QUO_KEY_APP_ID
                                                                                            AND QUO.QUO_STATUS = '4'
                                                                                            AND QUO.QUO_KEY_APP_ID NOT IN :QUO_KEY_APP_ID 
                                                                                            AND CD.REG_NO = G.REG_NO  
                                                                                        )
                                                                )
                                                                WHERE APPLICATION_NUM IS NOT NULL
                                                                GROUP BY APPLICATION_NUM , CONTRACT_NO , SL_CODE ,AUCTION_CODE ,  REG_NO,
                                                                prov_name,  BRAND_NAME,MODEL_NAME,COLOR ,CC ,ENGINE_NUMBER,ENGINE_NO_RUNNING,
                                                                CHASSIS_NUMBER, CHASSIS_NO_RUNNING,
                                                                prov_code,PRODUC,BRAND_CODE,MODEL_CODE, REG_DATE, MODEL_YEAR
                                                    ) CARSEC 
                                                    `, {
                                                    QUO_KEY_APP_ID: reqData.quotationid
                                                }, {
                                                    outFormat: 4002
                                                })

                                                if (checksecondhancdcaractiveexec.rows.length !== 0) {
                                                    const checksecondhancdcaractive = this.utilService.loopObjtolowerkey(checksecondhancdcaractiveexec.rows) as [IExecChecksecondhandcaractiveexec]
                                                    const checkmatchsecondhandcar = checksecondhancdcaractive.some((x) => x.contract_ref === reqData.contract_ref);

                                                    if (!checkmatchsecondhandcar) {

                                                        /* ... allow on case bussiness_code == 003 and contract_ref is empty string (20/04/2023) ... */

                                                        if (!((reqData.contract_ref == '' || reqData.contract_ref == null || reqData.contract_ref == undefined) && reqData.bussiness_code == '003')) {

                                                            /* ... update record MPLS_CREDIT with SQL ... */

                                                            const creid = chkcredit.app_key_id
                                                            const quoid = chkcredit.cre_quo_key_app_id

                                                            const updatecreditexec = await dbconnect[0].execute(
                                                                `
                                                                UPDATE MPLS_CREDIT
                                                                SET
                                                                    BRAND_CODE = :BRAND_CODE, 
                                                                    BRAND_NAME = :BRAND_NAME, 
                                                                    MODEL_CODE = :MODEL_CODE,
                                                                    MODEL_NAME = :MODEL_NAME, 
                                                                    COLOR_NAME = :COLOR_NAME, 
                                                                    LOAN_AMOUNT = :LOAN_AMOUNT, 
                                                                    PRODUCT_VALUE = :PRODUCT_VALUE,
                                                                    INTEREST_RATE = :INTEREST_RATE, 
                                                                    PAYMENT_VALUE = :PAYMENT_VALUE, 
                                                                    PAYMENT_ROUND_COUNT = :PAYMENT_ROUND_COUNT, 
                                                                    INSURANCE_CODE = :INSURANCE_CODE,
                                                                    INSURANCE_NAME = :INSURANCE_NAME,
                                                                    INSURANCE_YEAR = :INSURANCE_YEAR, 
                                                                    INSURANCE_PLAN_PRICE = :INSURANCE_PLAN_PRICE, 
                                                                    IS_INCLUDE_LOANAMOUNT = :IS_INCLUDE_LOANAMOUNT, 
                                                                    FACTORY_PRICE = :FACTORY_PRICE, 
                                                                    SIZE_MODEL = :SIZE_MODEL, 
                                                                    INSURER_CODE = :INSURER_CODE, 
                                                                    INSURER_NAME = :INSURER_NAME,
                                                                    COVERAGE_TOTAL_LOSS = :COVERAGE_TOTAL_LOSS,
                                                                    MAX_LTV = :MAX_LTV,
                                                                    ENGINE_NUMBER = :ENGINE_NUMBER,
                                                                    CHASSIS_NUMBER = :CHASSIS_NUMBER,
                                                                    ENGINE_NO_RUNNING = :ENGINE_NO_RUNNING,
                                                                    CHASSIS_NO_RUNNING = :CHASSIS_NO_RUNNING,
                                                                    PRICE_INCLUDE_VAT = :PRICE_INCLUDE_VAT,
                                                                    SL_CODE = :SL_CODE,
                                                                    BUSSINESS_CODE = :BUSSINESS_CODE,
                                                                    BUSSINESS_NAME = :BUSSINESS_NAME,
                                                                    MODEL_YEAR = :MODEL_YEAR,
                                                                    CC = :CC, 
                                                                    REG_NO = :REG_NO,
                                                                    REG_DATE = TRUNC(BTW.BUDDHIST_TO_CHRIS_F(TO_DATE(:REG_DATE, 'DD/MM/YYYY'))),
                                                                    CONTRACT_REF = :CONTRACT_REF,
                                                                    REG_MILE = :REG_MILE,
                                                                    PROV_CODE = :PROV_CODE,
                                                                    PROV_NAME = :PROV_NAME, 
                                                                    MOTO_YEAR = :MOTO_YEAR,  
                                                                    GRADE = :GRADE, 
                                                                    IS_OVER_MAX_LTV = :IS_OVER_MAX_LTV, 
                                                                    OVER_MAX_LTV_REASON = :OVER_MAX_LTV_REASON,
                                                                    MOTOR_NUMBER = :MOTOR_NUMBER
                                                                WHERE
                                                                    CRE_QUO_KEY_APP_ID = :CRE_QUO_KEY_APP_ID
                                                                    AND APP_KEY_ID = :APP_KEY_ID
                                                                `, {

                                                                BRAND_CODE: reqData.brand_code,
                                                                BRAND_NAME: reqData.brand_name,
                                                                MODEL_CODE: reqData.model_code,
                                                                MODEL_NAME: reqData.model_name,
                                                                COLOR_NAME: reqData.color_name,
                                                                LOAN_AMOUNT: reqData.loan_amount,
                                                                PRODUCT_VALUE: reqData.product_value,
                                                                INTEREST_RATE: reqData.interest_rate,
                                                                PAYMENT_VALUE: reqData.payment_value,
                                                                PAYMENT_ROUND_COUNT: reqData.payment_round_count,
                                                                INSURANCE_CODE: reqData.insurance_code,
                                                                INSURANCE_NAME: reqData.insurance_name,
                                                                INSURANCE_YEAR: reqData.insurance_year,
                                                                INSURANCE_PLAN_PRICE: reqData.insurance_plan_price,
                                                                IS_INCLUDE_LOANAMOUNT: reqData.is_include_loanamount,
                                                                FACTORY_PRICE: reqData.factory_price,
                                                                SIZE_MODEL: reqData.size_model,
                                                                INSURER_CODE: reqData.insurer_code,
                                                                INSURER_NAME: reqData.insurer_name,
                                                                COVERAGE_TOTAL_LOSS: reqData.coverage_total_loss,
                                                                MAX_LTV: reqData.max_ltv,
                                                                ENGINE_NUMBER: reqData.engine_number,
                                                                CHASSIS_NUMBER: reqData.chassis_number,
                                                                ENGINE_NO_RUNNING: reqData.engine_no_running,
                                                                CHASSIS_NO_RUNNING: reqData.chassis_no_running,
                                                                PRICE_INCLUDE_VAT: reqData.price_include_vat,
                                                                SL_CODE: reqData.dealer_code,
                                                                BUSSINESS_CODE: reqData.bussiness_code,
                                                                BUSSINESS_NAME: reqData.bussiness_name,
                                                                MODEL_YEAR: reqData.model_year,
                                                                CC: reqData.cc,
                                                                REG_NO: reqData.reg_no,
                                                                REG_DATE: reg_date_dtype ?? null,
                                                                CONTRACT_REF: reqData.contract_ref,
                                                                REG_MILE: reqData.reg_mile,
                                                                PROV_CODE: reqData.prov_code,
                                                                PROV_NAME: reqData.prov_name,
                                                                MOTO_YEAR: reqData.moto_year,
                                                                GRADE: reqData.grade_moto,
                                                                IS_OVER_MAX_LTV: reqData.is_over_max_ltv,
                                                                OVER_MAX_LTV_REASON: reqData.over_max_ltv_reason,
                                                                MOTOR_NUMBER: reqData.motor_number,
                                                                CRE_QUO_KEY_APP_ID: quoid,
                                                                APP_KEY_ID: creid,
                                                            })

                                                            /* ... update sl_code to MPLS_QUOTATION ... */
                                                            const update_sl_code_quotation_resultexec = await dbconnect[0].execute(
                                                                `
                                                                        UPDATE MPLS_QUOTATION
                                                                        SET
                                                                            SL_CODE = :SL_CODE,
                                                                            CHECKER_CODE = :CHECKER_CODE 
                                                                        WHERE
                                                                            QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                                                `, {
                                                                SL_CODE: reqData.dealer_code,
                                                                CHECKER_CODE: reqData.checker_id,
                                                                QUO_KEY_APP_ID: reqData.quotationid
                                                            })

                                                            if (!(updatecreditexec.rowsAffected !== 1 && update_sl_code_quotation_resultexec.rowsAffected !== 1)) {
                                                                /* ... update success ... */
                                                                const commitall = await dbconnect[0].commit();

                                                                try {
                                                                    commitall

                                                                    /*... Finish (senario 1) ... */

                                                                    return res.status(200).send({
                                                                        status: true,
                                                                        message: `บันทึกรายการ credit เรียบร้อย`
                                                                    })
                                                                } catch (e) {
                                                                    return res.send(200).send({
                                                                        status: false,
                                                                        message: `Error during commit : ${e.message ? e.message : 'No message'}`,
                                                                    })
                                                                }

                                                            } else {
                                                                return res.status(200).send({
                                                                    status: false,
                                                                    message: `อัพเดทรายการ MPLS_CREDIT ผิดพลาด (rowAffected : ${updatecreditexec.rowsAffected}, (quotation) : ${update_sl_code_quotation_resultexec.rowsAffected})`
                                                                })
                                                            }

                                                        } else {
                                                            return res.status(200).send({
                                                                status: false,
                                                                message: `ไม่สามารถบันทึกรายการรถมือสองได้ เนื่องจากไม่พบรถ หรือยังมีเคสรายการอื่นอยู่ในระบบ 1`
                                                            })
                                                        }
                                                    }

                                                } else {
                                                    return res.status(200).send({
                                                        status: false,
                                                        messgae: `ไม่พบรายการรถมือสองที่สามารถเลือกได้`
                                                    })
                                                }

                                            } else {
                                                /* ... checkquotation.quo_status == 1 ... */
                                                return res.status(200).send({
                                                    status: false,
                                                    message: `สถานะใบคำขออยู่ในขั้นพิจารณา ไม่สามารถแก้ไขข้อมูลได้`,
                                                    data: []
                                                })
                                            }
                                        } catch (e) {
                                            return res.status(200).send({
                                                status: false,
                                                mesage: `Fail to update MPLS_credit : ${e.message ? e.message : `No return msg`}`,
                                                data: []
                                            })
                                        }
                                    } else {
                                        /* ...chkcreditexec.rows.length !== 1 ... */
                                        return res.status(200).send({
                                            status: false,
                                            message: `Can't Identify MPLS_credit record (duplicate)`,
                                            data: []
                                        })
                                    }
                                } else {
                                    /* ... senario 2 : already have MPLS_credit ...*/
                                    /* ... check contract ref is already exist (secondhand car only) (with another quotation) (17/04/2023) ... */

                                    try {
                                        if (reqData.bussiness_code == '002' || reqData.bussiness_code == '003') {
                                            const checksecondhancdcaractiveexec = await dbconnect[0].execute(`
                                            SELECT CONTRACT_NO as CONTRACT_REF FROM 
                                            (
                                                SELECT  REG_NO,prov_name,  BRAND_NAME,MODEL_NAME,COLOR ,CC ,ENGINE_NUMBER,ENGINE_NO_RUNNING,
                                                        CHASSIS_NUMBER, CHASSIS_NO_RUNNING, REG_DATE,
                                                        PROV_CODE, PRODUC,BRAND_CODE,MODEL_CODE, MODEL_YEAR, APPLICATION_NUM , CONTRACT_NO , SL_CODE ,AUCTION_CODE
                                                        FROM(
                                                        SELECT  D.APPLICATION_NUM , D.CONTRACT_NO , C.SL_CODE ,C.AUCTION_CODE , G.REG_NO REG_NO,
                                                        BTW.F_GET_PROVINCE_NAME(E.REG_CITY) AS PROV_NAME, BTW.GET_BRAND_NAME(E.PRODUC ,E.BRAND_CODE) AS BRAND_NAME,
                                                        F.MODEL AS MODEL_NAME,E.COLOR ,F.CC, F.MODEL_YEAR ,G.ENGINE_NUMBER,G.ENGINE_NO_RUNNING,
                                                        G.CHASSIS_NUMBER, G.CHASSIS_NO_RUNNING,
                                                        E.REG_CITY prov_code,E.PRODUC,E.BRAND_CODE,E.MODEL_CODE,TRUNC(G.REG_DATE) AS REG_DATE
                                                        FROM BTW.COLL_RECIEPT A, BTW.X_RECEIVE B, BTW.X_REPOSSESS_AUCTION_P C , BTW.X_CUST_MAPPING_EXT D, BTW.AC_PROVE E, BTW.X_MODEL_P F,
                                                        BTW.X_PRODUCT_DETAIL G
                                                        WHERE A.RECEIPT_NUMBER_PREFIX = B.RECEIPT_NUMBER_PREFIX
                                                        AND A.RECEIPT_NUMBER_POSTFIX = B.RECEIPT_NUMBER_POSTFIX
                                                        AND A.HP_NO = B.CONTRACT_NO
                                                        AND B.AUCTION_CODE = C.AUCTION_CODE
                                                        AND A.HP_NO = D.CONTRACT_NO
                                                        AND E.HP_NO = D.CONTRACT_NO
                                                        AND E.PRODUC = F.PRO_CODE
                                                        AND C.SL_CODE = (SELECT DL_CODE FROM X_DEALER_P WHERE DL_CODE = C.SL_CODE AND ACTIVE_STATUS = 'Y')
                                                        AND E.BRAND_CODE = F.BRAND_CODE
                                                        AND E.MODEL_CODE = F.MODEL_CODE
                                                        AND G.APPLICATION_NUM =D.APPLICATION_NUM
                                                        AND D.BUSSINESS_CODE IN ('001','002')
                                                        AND A.PAY_CODE IN ('80','81')
                                                        AND NVL(A.CANCELL,'F') = 'F'
                                                        AND BTW.GET_MOTO_AGE (TRUNC(G.REG_DATE),TRUNC(SYSDATE)) <= BTW.GET_VALUE_NUM_MARKET_SETTING ('005','002',E.PRODUC ,E.BRAND_CODE ,E.MODEL_CODE ,C.SL_CODE ,TRUNC(SYSDATE))
                                                        AND D.CONTRACT_NO NOT IN (
                                                                                    SELECT DISTINCT CONTRACT_REF
                                                                                    FROM X_PRODUCT_DETAIL A,X_CUST_MAPPING_EXT B
                                                                                    WHERE A.APPLICATION_NUM = B.APPLICATION_NUM
                                                                                    AND  B.BUSSINESS_CODE = '002'
                                                                                    AND (B.LOAN_RESULT in ('Y','Z','W') OR B.LOAN_RESULT IS NULL)
                                                                                    AND a.REG_NO = G.REG_NO 
                                                                                    UNION
                                                                                    SELECT DISTINCT CD.CONTRACT_REF 
                                                                                    FROM MPLS_CREDIT CD, MPLS_QUOTATION QUO
                                                                                    WHERE CD.CRE_QUO_KEY_APP_ID = QUO.QUO_KEY_APP_ID
                                                                                    AND QUO.QUO_STATUS = '4'
                                                                                    AND QUO.QUO_KEY_APP_ID NOT IN :QUO_KEY_APP_ID 
                                                                                    AND CD.REG_NO = G.REG_NO  
                                                                                )
                                                        )
                                                        WHERE APPLICATION_NUM IS NOT NULL
                                                        GROUP BY APPLICATION_NUM , CONTRACT_NO , SL_CODE ,AUCTION_CODE ,  REG_NO,
                                                        prov_name,  BRAND_NAME,MODEL_NAME,COLOR ,CC ,ENGINE_NUMBER,ENGINE_NO_RUNNING,
                                                        CHASSIS_NUMBER, CHASSIS_NO_RUNNING,
                                                        prov_code,PRODUC,BRAND_CODE,MODEL_CODE, REG_DATE, MODEL_YEAR
                                            ) CARSEC 
                                            `, {
                                                QUO_KEY_APP_ID: reqData.quotationid
                                            }, {
                                                outFormat: 4002
                                            })

                                            if (checksecondhancdcaractiveexec.rows.length !== 0) {
                                                const checksecondhancdcaractive = this.utilService.loopObjtolowerkey(checksecondhancdcaractiveexec.rows) as [IExecChecksecondhandcaractiveexec]
                                                const checkmatchsecondhandcar = checksecondhancdcaractive.some((x) => x.contract_ref === reqData.contract_ref);

                                                if (checkmatchsecondhandcar) {

                                                    console.log(`create credit`)
                                                    /* ... create record MPLS_CREDIT with SQL ... */

                                                    const creditid = v4()

                                                    const credit_create_resultexec = await dbconnect[0].execute(
                                                        `
                                                            INSERT INTO MPLS_CREDIT 
                                                            (
                                                                BRAND_CODE, 
                                                                BRAND_NAME, 
                                                                MODEL_CODE,
                                                                MODEL_NAME, 
                                                                COLOR_NAME, 
                                                                LOAN_AMOUNT, 
                                                                PRODUCT_VALUE,
                                                                INTEREST_RATE, 
                                                                PAYMENT_VALUE, 
                                                                PAYMENT_ROUND_COUNT, 
                                                                INSURANCE_CODE,
                                                                INSURANCE_NAME,
                                                                INSURANCE_YEAR, 
                                                                INSURANCE_PLAN_PRICE, 
                                                                IS_INCLUDE_LOANAMOUNT, 
                                                                FACTORY_PRICE, 
                                                                SIZE_MODEL, 
                                                                INSURER_CODE, 
                                                                INSURER_NAME,
                                                                COVERAGE_TOTAL_LOSS,
                                                                MAX_LTV,
                                                                ENGINE_NUMBER,
                                                                CHASSIS_NUMBER,
                                                                ENGINE_NO_RUNNING,
                                                                CHASSIS_NO_RUNNING,
                                                                PRICE_INCLUDE_VAT,
                                                                SL_CODE,
                                                                BUSSINESS_CODE,
                                                                BUSSINESS_NAME,
                                                                MODEL_YEAR,
                                                                CC,
                                                                REG_NO,
                                                                REG_DATE,
                                                                CONTRACT_REF,
                                                                REG_MILE,
                                                                PROV_CODE,
                                                                PROV_NAME, 
                                                                MOTO_YEAR, 
                                                                GRADE,
                                                                IS_OVER_MAX_LTV,
                                                                OVER_MAX_LTV_REASON,
                                                                MOTOR_NUMBER,
                                                                CRE_QUO_KEY_APP_ID,
                                                                APP_KEY_ID
                                                            )
                                                            VALUES 
                                                            (
                                                                :BRAND_CODE, 
                                                                :BRAND_NAME, 
                                                                :MODEL_CODE, 
                                                                :MODEL_NAME, 
                                                                :COLOR_NAME, 
                                                                :LOAN_AMOUNT, 
                                                                :PRODUCT_VALUE,
                                                                :INTEREST_RATE, 
                                                                :PAYMENT_VALUE, 
                                                                :PAYMENT_ROUND_COUNT, 
                                                                :INSURANCE_CODE,
                                                                :INSURANCE_NAME,
                                                                :INSURANCE_YEAR, 
                                                                :INSURANCE_PLAN_PRICE, 
                                                                :IS_INCLUDE_LOANAMOUNT, 
                                                                :FACTORY_PRICE, 
                                                                :SIZE_MODEL, 
                                                                :INSURER_CODE, 
                                                                :INSURER_NAME,
                                                                :COVERAGE_TOTAL_LOSS,
                                                                :MAX_LTV,
                                                                :ENGINE_NUMBER,
                                                                :CHASSIS_NUMBER,
                                                                :ENGINE_NO_RUNNING,
                                                                :CHASSIS_NO_RUNNING,
                                                                :PRICE_INCLUDE_VAT,
                                                                :SL_CODE,
                                                                :BUSSINESS_CODE,
                                                                :BUSSINESS_NAME,
                                                                :MODEL_YEAR, 
                                                                :CC, 
                                                                :REG_NO, 
                                                                TRUNC(BTW.BUDDHIST_TO_CHRIS_F(TO_DATE(:REG_DATE, 'DD/MM/YYYY'))), 
                                                                :CONTRACT_REF,
                                                                :REG_MILE,
                                                                :PROV_CODE,
                                                                :PROV_NAME, 
                                                                :MOTO_YEAR, 
                                                                :GRADE, 
                                                                :IS_OVER_MAX_LTV, 
                                                                :OVER_MAX_LTV_REASON, 
                                                                :MOTOR_NUMBER,
                                                                :CRE_QUO_KEY_APP_ID,
                                                                :APP_KEY_ID
                                                            )
                                                        `, {
                                                        BRAND_CODE: reqData.brand_code,
                                                        BRAND_NAME: reqData.brand_name,
                                                        MODEL_CODE: reqData.model_code,
                                                        MODEL_NAME: reqData.model_name,
                                                        COLOR_NAME: reqData.color_name,
                                                        LOAN_AMOUNT: reqData.loan_amount,
                                                        PRODUCT_VALUE: reqData.product_value,
                                                        INTEREST_RATE: reqData.interest_rate,
                                                        PAYMENT_VALUE: reqData.payment_value,
                                                        PAYMENT_ROUND_COUNT: reqData.payment_round_count,
                                                        INSURANCE_CODE: reqData.insurance_code,
                                                        INSURANCE_NAME: reqData.insurance_name,
                                                        INSURANCE_YEAR: reqData.insurance_year,
                                                        INSURANCE_PLAN_PRICE: reqData.insurance_plan_price,
                                                        IS_INCLUDE_LOANAMOUNT: reqData.is_include_loanamount,
                                                        FACTORY_PRICE: reqData.factory_price,
                                                        SIZE_MODEL: reqData.size_model,
                                                        INSURER_CODE: reqData.insurer_code,
                                                        INSURER_NAME: reqData.insurer_name,
                                                        COVERAGE_TOTAL_LOSS: reqData.coverage_total_loss,
                                                        MAX_LTV: reqData.max_ltv,
                                                        ENGINE_NUMBER: reqData.engine_number,
                                                        CHASSIS_NUMBER: reqData.chassis_number,
                                                        ENGINE_NO_RUNNING: reqData.engine_no_running,
                                                        CHASSIS_NO_RUNNING: reqData.chassis_no_running,
                                                        PRICE_INCLUDE_VAT: reqData.price_include_vat,
                                                        SL_CODE: reqData.dealer_code,
                                                        BUSSINESS_CODE: reqData.bussiness_code,
                                                        BUSSINESS_NAME: reqData.bussiness_name,
                                                        MODEL_YEAR: reqData.model_year,
                                                        CC: reqData.cc,
                                                        REG_NO: reqData.reg_no,
                                                        // REG_DATE: (new Date(reg_date_dtype)) ?? null,
                                                        REG_DATE: reg_date_dtype ?? null,
                                                        CONTRACT_REF: reqData.contract_ref,
                                                        REG_MILE: reqData.reg_mile,
                                                        PROV_CODE: reqData.prov_code,
                                                        PROV_NAME: reqData.prov_name,
                                                        MOTO_YEAR: reqData.moto_year,
                                                        GRADE: reqData.grade_moto,
                                                        IS_OVER_MAX_LTV: reqData.is_over_max_ltv,
                                                        OVER_MAX_LTV_REASON: reqData.over_max_ltv_reason,
                                                        MOTOR_NUMBER: reqData.motor_number,
                                                        CRE_QUO_KEY_APP_ID: reqData.quotationid,
                                                        APP_KEY_ID: creditid
                                                    })

                                                    // === update sl_code to MPLS_QUOTATION ===
                                                    const update_sl_code_quotation_resultexec = await dbconnect[0].execute(
                                                        `
                                                                UPDATE MPLS_QUOTATION
                                                                SET
                                                                    SL_CODE = :SL_CODE, 
                                                                    QUO_CREDIT_ID = :QUO_CREDIT_ID,
                                                                    CHECKER_CODE = :CHECKER_CODE
                                                                WHERE
                                                                    QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                                        `, {
                                                        SL_CODE: reqData.dealer_code,
                                                        QUO_CREDIT_ID: creditid,
                                                        CHECKER_CODE: reqData.checker_id,
                                                        QUO_KEY_APP_ID: reqData.quotationid
                                                    })

                                                    if (credit_create_resultexec.rowsAffected === 1 || update_sl_code_quotation_resultexec.rowsAffected === 1) {

                                                        /* ... success ... */

                                                        const commitall = await dbconnect[0].commit();

                                                        try {
                                                            commitall
                                                        } catch (e) {
                                                            return res.send(200).send({
                                                                status: false,
                                                                message: `Error : ${e.message ? e.message : 'No message'}`,
                                                            })
                                                        }

                                                        /* ... Finish ... */

                                                        return res.status(200).send({
                                                            status: true,
                                                            message: `สร้างรายการ credit เรียบร้อย`
                                                        })
                                                    } else {
                                                        return res.status(200).send({
                                                            status: false,
                                                            message: `สร้างรายการ MPLS_CREDIT ผิดพลาด (rowAffected (credit) : ${credit_create_resultexec.rowsAffected}, (quotation) : ${update_sl_code_quotation_resultexec.rowsAffected})`
                                                        })
                                                    }

                                                } else {
                                                    return res.status(200).send({
                                                        status: false,
                                                        message: `ไม่สามารถบันทึกรายการรถมือสองได้ เนื่องจากไม่พบรถ หรือยังมีเคสรายการอื่นอยู่ในระบบ`
                                                    })
                                                }
                                            } else {
                                                return res.status(200).send({
                                                    status: false,
                                                    messgae: `ไม่พบรายการรถมือสองที่สามารถเลือกได้`
                                                })
                                            }
                                        }

                                    } catch (e) {
                                        return res.status(200).send({
                                            status: false,
                                            message: `Error during create MPLS_credit : ${e.message ? e.message : 'No return msg'}`,
                                            data: []
                                        })
                                    }
                                }
                                /* ...................... */

                            } else {
                                /* ...checkquotationexec.rows.length !== 1 ...*/
                                return res.status(200).send({
                                    status: false,
                                    message: `เลข quotaion ไอดี ไม่สามารถระบุใบคำขอได้`
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: false,
                                message: `No Permission`,
                                data: []
                            })
                        }

                    } else {
                        if (dbconnect[1]) {
                            const errRes = dbconnect[1]
                            return res.status(200).send({
                                status: false,
                                message: `${errRes.message ? errRes.message : 'FAIL : No return msg form basicexe'}`,
                                data: []
                            })
                        } else {
                            return res.status(200).send({
                                status: false,
                                message: `FAIL : no error return from oracle`,
                                data: []
                            })
                        }
                    }
                } else {
                    /* ... dbconnect[0] == null ... */
                    return res.status(200).send({
                        status: false,
                        message: `FAIL : No return msg`,
                        data: []
                    })
                }
            }
        } catch (e) {
            return res.status(200).send({
                status: false,
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_check_application_no(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.body as IReqMplsCheckApplicationNo

            if (dbconnect) {

                /* ... check permission ... */
                if (radmin == 'Y') {
                    return res.status(403).send({
                        status: 403,
                        message: `No Permission`,
                        data: []
                    })
                }

                if (dbconnect[0]) {

                    try {
                        const checkappnoexec = await dbconnect[0].execute(
                            `
                                SELECT APPLICATION_NUM
                                FROM MPLS_QUOTATION
                                WHERE QUO_KEY_APP_ID = :quotationid
                            `
                            , {
                                quotationid: reqData.quotationid
                            }, {
                            outFormat: 4002
                        })

                        if (checkappnoexec.rows.length !== 0) {
                            /* ... check application num and return result check ... */
                            const checkappnoe = this.utilService.toLowerKeys((checkappnoexec.rows[0])) as IExecCheckappnoexec

                            const applicationidvalue = checkappnoe.application_num
                            if (applicationidvalue == '' || applicationidvalue == null) {
                                return res.status(200).send({
                                    status: 200,
                                    message: `ยังไม่มีเลข application_num`,
                                    data: [{
                                        application_no: ''
                                    }]
                                })
                            } else {
                                return res.status(200).send({
                                    status: 200,
                                    message: `มีเลข application_num อยู่แล้ว`,
                                    data: [{
                                        application_no: applicationidvalue
                                    }]
                                })
                            }
                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: 'No application_no',
                                data: []
                            })
                        }
                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            mesage: `Fail to execute check application no : ${e.message ? e.message : `No return msg`}`,
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
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_getservertime(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==

        try {

            var date = moment()

            return res.status(200).send({
                status: 200,
                message: `Success`,
                data: date
            })
        } catch (e) {
            return res.status(200).send({
                status: 500,
                message: `Error with message : ${e.message ? e.message : `No message`}`
            })
        }
    }

    async MPLS_validation_otp_econsent_non(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            let reqData = JSON.parse(req.body) as IReqMplsValidationOtpEconsentNon

            if (dbconnect) {

                if (dbconnect[0]) {

                    if (!(reqData.quotationid == '' || reqData.quotationid == null)) {

                        try {

                            const checkstatusverifyconsentexec = await dbconnect[0].execute(
                                `
                                    UPDATE MPLS_QUOTATION
                                    SET OTP_CONSENT_VERIFY = 'N'
                                    WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                `
                                , {
                                    QUO_KEY_APP_ID: reqData.quotationid
                                }, {

                            })

                            console.log(`flag non-econsent success : ${checkstatusverifyconsentexec.rowsAffected}`)

                            /* ... Verify Identity record (Duplicate check) ... */
                            if (checkstatusverifyconsentexec.rowsAffected == 1) {

                                /* ... success flag non-econsent ... */

                                const commitall = await dbconnect[0].commit();
                                try {
                                    commitall

                                    /* ... Finish ... */
                                    return res.status(200).send({
                                        status: true,
                                        message: `success`
                                    })

                                } catch (e) {

                                    return res.status(200).send({
                                        status: 500,
                                        message: `Fail with Error : ${e.message ? e.message : 'No return message'}`,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: false,
                                    message: `can't intizialise record`,
                                    data: []
                                })
                            }


                        } catch (e) {
                            return res.status(200).send({
                                status: false,
                                mesage: `Fail to update consent verify statud  : ${e.message ? e.message : `No return msg`}`,
                                data: []
                            })
                        }
                    } else {
                        /* .... No quotationid ... */
                        return res.status(200).send({
                            status: false,
                            message: `ไม่พบ quotationid`,
                            data: []
                        })
                    }

                } else {
                    if (dbconnect[1]) {
                        const errRes = dbconnect[1]
                        return res.status(200).send({
                            status: false,
                            message: `${errRes.message ? errRes.message : 'FAIL : No return msg form basicexe'}`,
                            data: []
                        })
                    } else {
                        return res.status(200).send({
                            status: false,
                            message: `FAIL : no error return from oracle`,
                            data: []
                        })
                    }
                }
            } else {
                return res.status(200).send({
                    status: false,
                    message: `FAIL : No return msg`,
                    data: []
                })
            }
        } catch (e) {
            return res.status(200).send({
                status: false,
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_create_or_update_careerandpurpose(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            let reqData = JSON.parse(req.body) as IReqMplsCreateOrUpdateCareerandpurpose

            if (dbconnect) {

                /*... check permission ... */
                if (radmin !== 'Y') {

                    /* ... check parameter quotationid .., */
                    if (!(reqData.quotationid == '' || reqData.quotationid == null)) {

                        if (dbconnect[0]) {
                            /* ... check quotation is already exist ... */
                            const chkquotationexec = await dbconnect[0].execute(
                                `
                                    SELECT QUO_KEY_APP_ID, QUO_STATUS 
                                    FROM MPLS_QUOTATION
                                    WHERE QUO_KEY_APP_ID = :QUOTATIONID
                                `, {
                                QUOTATIONID: reqData.quotationid
                            }, {
                                outFormat: 4002
                            })



                            if (chkquotationexec.rows.length == 1) {

                                const chkquotation = this.utilService.toLowerKeys(chkquotationexec.rows[0]) as IExecChkquotationcareer

                                /* .... record is already exists ... */

                                /* ... career ... */
                                const chkdupcareerexec = await dbconnect[0].execute(
                                    `
                                    SELECT APP_KEY_ID, CARE_QUO_APP_KEY_ID 
                                    FROM MPLS_CAREER
                                    WHERE CARE_QUO_APP_KEY_ID = :QUOTATIONID
                                `, {
                                    QUOTATIONID: reqData.quotationid
                                }, {
                                    outFormat: 4002
                                })

                                /* ... purpose ... */
                                const chkduppurposeexec = await dbconnect[0].execute(
                                    `
                                    SELECT APP_KEY_ID 
                                    FROM MPLS_PURPOSE
                                    WHERE PURP_QUO_APP_KEY_ID = :QUOTATIONID
                                `, {
                                    QUOTATIONID: reqData.quotationid
                                }, {
                                    outFormat: 4002
                                })

                                /* ... check senario (update or create MPLS_career , MPLS_purpose) ... */
                                if (chkdupcareerexec.rows.length == 1 && chkduppurposeexec.rows.length == 1) {

                                    /* ... Update Flow ... */
                                    const chkdupcareer = this.utilService.toLowerKeys(chkdupcareerexec.rows[0]) as IExecChkdupcareer
                                    const chkduppurpose = this.utilService.toLowerKeys(chkduppurposeexec.rows[0]) as IExecChkduppurpose

                                    /* ... check quo_status === (if MPLS_QUOTATION.QUO_STATUS = 1 : can't update record) ... */

                                    if (chkquotation.quo_status !== 1) {
                                        const careerid = chkdupcareer.app_key_id
                                        const purposeid = chkduppurpose.app_key_id
                                        const quoid = chkdupcareer.care_quo_app_key_id

                                        /* ... update record MPLS_CAREER with SQL ... */
                                        const updatecareerexec = await dbconnect[0].execute(
                                            `
                                                UPDATE MPLS_CAREER
                                                            SET MAIN_CAREER_NAME = :MAIN_CAREER_NAME,
                                                                MAIN_CAREER_CODE = :MAIN_CAREER_CODE,
                                                                MAIN_WORKPLACE_NAME = :MAIN_WORKPLACE_NAME,
                                                                MAIN_POSITION = :MAIN_POSITION,
                                                                MAIN_DEPARTMENT = :MAIN_DEPARTMENT,
                                                                MAIN_EXPERIENCE_YEAR = :MAIN_EXPERIENCE_YEAR,
                                                                MAIN_EXPERIENCE_MONTH = :MAIN_EXPERIENCE_MONTH,
                                                                MAIN_SALARY_PER_MONTH = :MAIN_SALARY_PER_MONTH,
                                                                MAIN_SALARY_PER_DAY = :MAIN_SALARY_PER_DAY,
                                                                MAIN_LEADER_NAME = :MAIN_LEADER_NAME,
                                                                MAIN_WORK_PER_WEEK = :MAIN_WORK_PER_WEEK, 
                                                                MAIN_WORKPLACE_PHONE_NO_1 = :MAIN_WORKPLACE_PHONE_NO_1, 
                                                                MAIN_WORKPLACE_PHONE_NO_2 = :MAIN_WORKPLACE_PHONE_NO_2, 
                                                                IS_SUB_CAREER = :IS_SUB_CAREER,
                                                                SUB_CAREER_NAME = :SUB_CAREER_NAME,
                                                                SUB_CAREER_CODE = :SUB_CAREER_CODE,
                                                                SUB_WORKPLACE_NAME = :SUB_WORKPLACE_NAME,
                                                                SUB_POSITION = :SUB_POSITION,
                                                                SUB_DEPARTMENT = :SUB_DEPARTMENT,
                                                                SUB_EXPERIENCE_YEAR = :SUB_EXPERIENCE_YEAR,
                                                                SUB_EXPERIENCE_MONTH = :SUB_EXPERIENCE_MONTH,
                                                                SUB_SALARY_PER_MONTH = :SUB_SALARY_PER_MONTH,
                                                                SUB_SALARY_PER_DAY = :SUB_SALARY_PER_DAY,
                                                                SUB_LEADER_NAME = :SUB_LEADER_NAME,
                                                                SUB_WORK_PER_WEEK = :SUB_WORK_PER_WEEK
                                                WHERE CARE_QUO_APP_KEY_ID = :CARE_QUO_APP_KEY_ID
                                                AND APP_KEY_ID = :APP_KEY_ID
                                            `, {

                                            MAIN_CAREER_NAME: reqData.main_career_name,
                                            MAIN_CAREER_CODE: reqData.main_career_code,
                                            MAIN_WORKPLACE_NAME: reqData.main_workplace_name,
                                            MAIN_POSITION: reqData.main_position,
                                            MAIN_DEPARTMENT: reqData.main_department,
                                            MAIN_EXPERIENCE_YEAR: reqData.main_experience_year,
                                            MAIN_EXPERIENCE_MONTH: reqData.main_experience_month,
                                            MAIN_SALARY_PER_MONTH: reqData.main_salary_per_month,
                                            MAIN_SALARY_PER_DAY: reqData.main_salary_per_day,
                                            MAIN_LEADER_NAME: reqData.main_leader_name,
                                            MAIN_WORK_PER_WEEK: reqData.main_work_per_week,
                                            MAIN_WORKPLACE_PHONE_NO_1: reqData.main_workplace_phone_no_1,
                                            MAIN_WORKPLACE_PHONE_NO_2: reqData.main_workplace_phone_no_2,
                                            IS_SUB_CAREER: reqData.is_sub_career,
                                            SUB_CAREER_NAME: reqData.sub_career_name,
                                            SUB_CAREER_CODE: reqData.sub_career_code,
                                            SUB_WORKPLACE_NAME: reqData.sub_workplace_name,
                                            SUB_POSITION: reqData.sub_position,
                                            SUB_DEPARTMENT: reqData.sub_department,
                                            SUB_EXPERIENCE_YEAR: reqData.sub_experience_year,
                                            SUB_EXPERIENCE_MONTH: reqData.sub_experience_month,
                                            SUB_SALARY_PER_MONTH: reqData.sub_salary_per_month,
                                            SUB_SALARY_PER_DAY: reqData.sub_salary_per_day,
                                            SUB_LEADER_NAME: reqData.sub_leader_name,
                                            SUB_WORK_PER_WEEK: reqData.sub_work_per_week,
                                            CARE_QUO_APP_KEY_ID: quoid,
                                            APP_KEY_ID: careerid,
                                        })

                                        // *** update record MPLS_PURPOSE with SQL ***
                                        const updatepurposeexec = await dbconnect[0].execute(
                                            `
                                                UPDATE MPLS_PURPOSE
                                                SET 
                                                    PURPOSE_OF_BUY = :PURPOSE_OF_BUY, 
                                                    PURPOSE_OF_BUY_NAME = :PURPOSE_OF_BUY_NAME, 
                                                    REASON_OF_BUY = :REASON_OF_BUY, 
                                                    REASON_OF_BUY_NAME = :REASON_OF_BUY_NAME, 
                                                    CAR_USER = :CAR_USER, 
                                                    CAR_USER_RELATION = :CAR_USER_RELATION, 
                                                    CAR_USER_NAME = :CAR_USER_NAME, 
                                                    CAR_USER_FULLNAME = :CAR_USER_FULLNAME, 
                                                    CAR_USER_CITIZENCARD_ID = :CAR_USER_CITIZENCARD_ID, 
                                                    CAR_USER_HOME_NO = :CAR_USER_HOME_NO, 
                                                    CAR_USER_HOME_NAME = :CAR_USER_HOME_NAME, 
                                                    CAR_USER_SOI = :CAR_USER_SOI, 
                                                    CAR_USER_MOO = :CAR_USER_MOO, 
                                                    CAR_USER_ROAD = :CAR_USER_ROAD, 
                                                    CAR_USER_SUB_DISTRICT = :CAR_USER_SUB_DISTRICT, 
                                                    CAR_USER_DISTRICT = :CAR_USER_DISTRICT, 
                                                    CAR_USER_PROVINCE_NAME = :CAR_USER_PROVINCE_NAME, 
                                                    CAR_USER_PROVINCE_CODE = :CAR_USER_PROVINCE_CODE, 
                                                    CAR_USER_POSTAL_CODE = :CAR_USER_POSTAL_CODE, 
                                                    CAR_USER_ROOM_NO = :CAR_USER_ROOM_NO, 
                                                    CAR_USER_FLOOR = :CAR_USER_FLOOR, 
                                                    CAR_USER_PHONENO = :CAR_USER_PHONENO, 
                                                    FIRST_REFERRAL_FULLNAME = :FIRST_REFERRAL_FULLNAME, 
                                                    FIRST_REFERRAL_PHONENO = :FIRST_REFERRAL_PHONENO, 
                                                    FIRST_REFERRAL_RELATION = :FIRST_REFERRAL_RELATION, 
                                                    SECOND_REFERRAL_FULLNAME = :SECOND_REFERRAL_FULLNAME, 
                                                    SECOND_REFERRAL_PHONENO = :SECOND_REFERRAL_PHONENO, 
                                                    SECOND_REFERRAL_RELATION = :SECOND_REFERRAL_RELATION
                                                WHERE PURP_QUO_APP_KEY_ID = :PURP_QUO_APP_KEY_ID
                                                AND APP_KEY_ID = :APP_KEY_ID
                                        `, {

                                            PURPOSE_OF_BUY: reqData.purpose_buy,
                                            PURPOSE_OF_BUY_NAME: reqData.purpose_buy_name,
                                            REASON_OF_BUY: reqData.reason_buy,
                                            REASON_OF_BUY_NAME: reqData.reason_buy_etc,
                                            CAR_USER: reqData.car_user,
                                            CAR_USER_RELATION: reqData.car_user_relation,
                                            CAR_USER_NAME: reqData.car_user_name,
                                            CAR_USER_FULLNAME: reqData.car_user_name_2,
                                            CAR_USER_CITIZENCARD_ID: reqData.car_user_citizen_id,
                                            CAR_USER_HOME_NO: reqData.car_user_home_no,
                                            CAR_USER_HOME_NAME: reqData.car_user_home_name,
                                            CAR_USER_SOI: reqData.car_user_soi,
                                            CAR_USER_MOO: reqData.car_user_moo,
                                            CAR_USER_ROAD: reqData.car_user_road,
                                            CAR_USER_SUB_DISTRICT: reqData.car_user_sub_district,
                                            CAR_USER_DISTRICT: reqData.car_user_district,
                                            CAR_USER_PROVINCE_NAME: reqData.car_user_province_name,
                                            CAR_USER_PROVINCE_CODE: reqData.car_user_province_code,
                                            CAR_USER_POSTAL_CODE: reqData.car_user_postal_code,
                                            CAR_USER_ROOM_NO: reqData.car_user_room_no,
                                            CAR_USER_FLOOR: reqData.car_user_floor,
                                            CAR_USER_PHONENO: reqData.car_user_phone_no,
                                            FIRST_REFERRAL_FULLNAME: reqData.first_referral_fullname,
                                            FIRST_REFERRAL_PHONENO: reqData.first_referral_phone_no,
                                            FIRST_REFERRAL_RELATION: reqData.first_referral_relation,
                                            SECOND_REFERRAL_FULLNAME: reqData.second_referral_fullname,
                                            SECOND_REFERRAL_PHONENO: reqData.second_referral_phone_no,
                                            SECOND_REFERRAL_RELATION: reqData.second_referral_relation,
                                            PURP_QUO_APP_KEY_ID: quoid,
                                            APP_KEY_ID: purposeid
                                        })

                                        if (updatecareerexec.rowsAffected !== 1 && updatepurposeexec.rowsAffected !== 1) {
                                            return res.status(200).send({
                                                status: false,
                                                message: `อัพเดทรายการ MPLS_CAREER, MPLS_PURPOSE ผิดพลาด (Career : rowAffected : ${updatecareerexec.rowsAffected}, \n
                                                    Purpose : rowsAffected : ${updatepurposeexec.rowsAffected}`
                                            })
                                        } else {
                                            // === update success ===
                                            const commitall = await dbconnect[0].commit();

                                            try {
                                                commitall

                                                return res.status(200).send({
                                                    status: true,
                                                    message: `บันทึกรายการ career, purpose เรียบร้อย`
                                                })

                                                /* ... Finish ...*/
                                            } catch (e) {
                                                return res.send(200).send({
                                                    status: false,
                                                    message: `Error during try to commit after update career and purpose : ${e.message ? e.message : 'No message'}`,
                                                })
                                            }

                                        }

                                        /* ... End Update ... */
                                    } else {
                                        /* ... chkquotation.quo_status == 1 ... */
                                        return res.status(200).send({
                                            status: false,
                                            message: `สถานะใบคำขออยู่ในขั้นพิจารณา ไม่สามารถแก้ไขข้อมูลได้`,
                                            data: []
                                        })
                                    }

                                    /* ... Last exporession Update here ...*/
                                } else if (chkdupcareerexec.rows.length == 0 && chkduppurposeexec.rows.length == 0) {
                                    /* .... Create Flow ... */
                                    const careerid = v4()
                                    const purposeid = v4()

                                    /*... create record MPLS_CAREER with SQL ... */
                                    const career_create_resultexec = await dbconnect[0].execute(
                                        `
                                            INSERT INTO MPLS_CAREER (
                                                CARE_QUO_APP_KEY_ID, APP_KEY_ID, MAIN_CAREER_NAME, MAIN_CAREER_CODE, MAIN_WORKPLACE_NAME, 
                                                MAIN_POSITION, MAIN_DEPARTMENT,
                                                MAIN_EXPERIENCE_YEAR, MAIN_EXPERIENCE_MONTH, MAIN_SALARY_PER_MONTH, MAIN_SALARY_PER_DAY,
                                                MAIN_LEADER_NAME, MAIN_WORK_PER_WEEK, MAIN_WORKPLACE_PHONE_NO_1, MAIN_WORKPLACE_PHONE_NO_2, IS_SUB_CAREER, SUB_CAREER_NAME, SUB_CAREER_CODE,
                                                SUB_WORKPLACE_NAME, SUB_POSITION, SUB_DEPARTMENT,SUB_EXPERIENCE_YEAR, SUB_EXPERIENCE_MONTH,
                                                SUB_SALARY_PER_MONTH, SUB_SALARY_PER_DAY, SUB_LEADER_NAME, SUB_WORK_PER_WEEK)
                                            VALUES (:CARE_QUO_APP_KEY_ID, :APP_KEY_ID, :MAIN_CAREER_NAME, :MAIN_CAREER_CODE, :MAIN_WORKPLACE_NAME, :MAIN_POSITION, :MAIN_DEPARTMENT,
                                                :MAIN_EXPERIENCE_YEAR, :MAIN_EXPERIENCE_MONTH,  :MAIN_SALARY_PER_MONTH, :MAIN_SALARY_PER_DAY,
                                                :MAIN_LEADER_NAME, :MAIN_WORK_PER_WEEK, :MAIN_WORKPLACE_PHONE_NO_1, :MAIN_WORKPLACE_PHONE_NO_2, :IS_SUB_CAREER, :SUB_CAREER_NAME, :SUB_CAREER_CODE, 
                                                :SUB_WORKPLACE_NAME, :SUB_POSITION, :SUB_DEPARTMENT, :SUB_EXPERIENCE_YEAR, :SUB_EXPERIENCE_MONTH, 
                                                :SUB_SALARY_PER_MONTH, :SUB_SALARY_PER_DAY, :SUB_LEADER_NAME, :SUB_WORK_PER_WEEK)
                                        `, {
                                        CARE_QUO_APP_KEY_ID: reqData.quotationid,
                                        APP_KEY_ID: careerid,
                                        MAIN_CAREER_NAME: reqData.main_career_name,
                                        MAIN_CAREER_CODE: reqData.main_career_code,
                                        MAIN_WORKPLACE_NAME: reqData.main_workplace_name,
                                        MAIN_POSITION: reqData.main_position,
                                        MAIN_DEPARTMENT: reqData.main_department,
                                        MAIN_EXPERIENCE_YEAR: reqData.main_experience_year,
                                        MAIN_EXPERIENCE_MONTH: reqData.main_experience_month,
                                        MAIN_SALARY_PER_MONTH: reqData.main_salary_per_month,
                                        MAIN_SALARY_PER_DAY: reqData.main_salary_per_day,
                                        MAIN_LEADER_NAME: reqData.main_leader_name,
                                        MAIN_WORK_PER_WEEK: reqData.main_work_per_week,
                                        MAIN_WORKPLACE_PHONE_NO_1: reqData.main_workplace_phone_no_1,
                                        MAIN_WORKPLACE_PHONE_NO_2: reqData.main_workplace_phone_no_2,
                                        IS_SUB_CAREER: reqData.is_sub_career,
                                        SUB_CAREER_NAME: reqData.sub_career_name,
                                        SUB_CAREER_CODE: reqData.sub_career_code,
                                        SUB_WORKPLACE_NAME: reqData.sub_workplace_name,
                                        SUB_POSITION: reqData.sub_position,
                                        SUB_DEPARTMENT: reqData.sub_department,
                                        SUB_EXPERIENCE_YEAR: reqData.sub_experience_year,
                                        SUB_EXPERIENCE_MONTH: reqData.sub_experience_month,
                                        SUB_SALARY_PER_MONTH: reqData.sub_salary_per_month,
                                        SUB_SALARY_PER_DAY: reqData.sub_salary_per_day,
                                        SUB_LEADER_NAME: reqData.sub_leader_name,
                                        SUB_WORK_PER_WEEK: reqData.sub_work_per_week
                                    })

                                    /*...  create record MPLS_PURPOSE with SQL ... */
                                    const purpose_create_resultexec = await dbconnect[0].execute(
                                        `
                                        INSERT INTO MPLS_PURPOSE (
                                            PURP_QUO_APP_KEY_ID, APP_KEY_ID, PURPOSE_OF_BUY, PURPOSE_OF_BUY_NAME, REASON_OF_BUY,
                                            REASON_OF_BUY_NAME, CAR_USER, CAR_USER_RELATION, CAR_USER_NAME, CAR_USER_FULLNAME, CAR_USER_CITIZENCARD_ID,
                                            CAR_USER_HOME_NO, CAR_USER_HOME_NAME, CAR_USER_SOI, CAR_USER_MOO, CAR_USER_ROAD, CAR_USER_SUB_DISTRICT,
                                            CAR_USER_DISTRICT, CAR_USER_PROVINCE_NAME, CAR_USER_PROVINCE_CODE, CAR_USER_POSTAL_CODE, CAR_USER_ROOM_NO,
                                            CAR_USER_FLOOR, CAR_USER_PHONENO, FIRST_REFERRAL_FULLNAME,
                                            FIRST_REFERRAL_PHONENO, FIRST_REFERRAL_RELATION, SECOND_REFERRAL_FULLNAME,
                                            SECOND_REFERRAL_PHONENO, SECOND_REFERRAL_RELATION)
                                        VALUES (:PURP_QUO_APP_KEY_ID, :APP_KEY_ID, :PURPOSE_OF_BUY, :PURPOSE_OF_BUY_NAME, :REASON_OF_BUY,
                                            :REASON_OF_BUY_NAME, :CAR_USER, :CAR_USER_RELATION, :CAR_USER_NAME, :CAR_USER_FULLNAME, :CAR_USER_CITIZENCARD_ID,
                                            :CAR_USER_HOME_NO, :CAR_USER_HOME_NAME, :CAR_USER_SOI, :CAR_USER_MOO, :CAR_USER_ROAD, :CAR_USER_SUB_DISTRICT,
                                            :CAR_USER_DISTRICT, :CAR_USER_PROVINCE_NAME, :CAR_USER_PROVINCE_CODE, :CAR_USER_POSTAL_CODE, :CAR_USER_ROOM_NO,
                                            :CAR_USER_FLOOR, :CAR_USER_PHONENO, :FIRST_REFERRAL_FULLNAME,
                                            :FIRST_REFERRAL_PHONENO, :FIRST_REFERRAL_RELATION, :SECOND_REFERRAL_FULLNAME,
                                            :SECOND_REFERRAL_PHONENO, :SECOND_REFERRAL_RELATION)
                                        `, {
                                        PURP_QUO_APP_KEY_ID: reqData.quotationid,
                                        APP_KEY_ID: purposeid,
                                        PURPOSE_OF_BUY: reqData.purpose_buy, PURPOSE_OF_BUY_NAME: reqData.purpose_buy_name, REASON_OF_BUY: reqData.reason_buy, // valid
                                        REASON_OF_BUY_NAME: reqData.reason_buy_etc, CAR_USER: reqData.car_user, CAR_USER_RELATION: reqData.car_user_relation, CAR_USER_NAME: reqData.car_user_name, CAR_USER_FULLNAME: reqData.car_user_name_2, CAR_USER_CITIZENCARD_ID: reqData.car_user_citizen_id, // valid
                                        CAR_USER_HOME_NO: reqData.car_user_home_no, CAR_USER_HOME_NAME: reqData.car_user_home_name, CAR_USER_SOI: reqData.car_user_soi, CAR_USER_MOO: reqData.car_user_moo, CAR_USER_ROAD: reqData.car_user_road, CAR_USER_SUB_DISTRICT: reqData.car_user_sub_district, // valid
                                        CAR_USER_DISTRICT: reqData.car_user_district, CAR_USER_PROVINCE_NAME: reqData.car_user_province_name, CAR_USER_PROVINCE_CODE: reqData.car_user_province_code, CAR_USER_POSTAL_CODE: reqData.car_user_postal_code, CAR_USER_ROOM_NO: reqData.car_user_room_no, // valid
                                        CAR_USER_FLOOR: reqData.car_user_floor, CAR_USER_PHONENO: reqData.car_user_phone_no, FIRST_REFERRAL_FULLNAME: reqData.first_referral_fullname, // last 2 field (FIRST_REFERRAL_HOUSE_NO, FIRST_REFERRAL_MOO) // valid
                                        FIRST_REFERRAL_PHONENO: reqData.first_referral_phone_no, FIRST_REFERRAL_RELATION: reqData.first_referral_relation, SECOND_REFERRAL_FULLNAME: reqData.second_referral_fullname, // 3-4 valid // valid
                                        SECOND_REFERRAL_PHONENO: reqData.second_referral_phone_no, SECOND_REFERRAL_RELATION: reqData.second_referral_relation
                                    })

                                    // === upate quotation with key id ==== 

                                    const update_key_to_quotationexec = await dbconnect[0].execute(
                                        `
                                            UPDATE MPLS_QUOTATION
                                                SET
                                                    QUO_CAREER_ID = :QUO_CAREER_ID,
                                                    QUO_PURPOSE_ID = :QUO_PURPOSE_ID
                                                WHERE
                                                    QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                        `, {
                                        QUO_CAREER_ID: careerid,
                                        QUO_PURPOSE_ID: purposeid,
                                        QUO_KEY_APP_ID: reqData.quotationid
                                    })

                                    if (career_create_resultexec.rowsAffected === 1 || purpose_create_resultexec.rowsAffected === 1 || update_key_to_quotationexec.rowsAffected === 1) {
                                        /* ... Success ...*/

                                        const commitall = await dbconnect[0].commit();

                                        try {

                                            commitall
                                            return res.status(200).send({
                                                status: true,
                                                message: `สร้างรายการ MPLS_CAREER, MPLS_PURPOSE เรียบร้อย`
                                            })

                                            /* ... Finish ...*/
                                        } catch (e) {

                                            return res.send(200).send({
                                                status: false,
                                                message: `Error during try to commit after create career and purpose: ${e.message ? e.message : 'No message'}`,
                                            })
                                        }


                                    } else {
                                        return res.status(200).send({
                                            status: false,
                                            message: `สร้างรายการ MPLS_CAREER, MPLS_PURPOSE ผิดพลาด (rowAffected (MPLS_CAREER) : ${career_create_resultexec.rowsAffected}, (MPLS_PURPOSE) : ${purpose_create_resultexec.rowsAffected}, (update field quotation (keyid) : ${update_key_to_quotationexec.rowsAffected}))`
                                        })
                                    }


                                    /* ... Last exporession Create here ...*/
                                } else {
                                    /* ... orther execute result didn't math with update or create flow (career and purpose) ... */
                                    return res.status(200).send({
                                        status: false,
                                        message: `ไม่สามารถกำหนดเงื่อนไขในการบันทึกค่าได้ Carreer row : ${chkdupcareerexec}, Purpuse row : ${chkduppurposeexec}`,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: false,
                                    message: `เลข QUOTATION ID ไม่สามารถระบุใบคำขอได้`
                                })

                            }
                        } else {
                            if (dbconnect[1]) {
                                const errRes = dbconnect[1]
                                return res.status(200).send({
                                    status: false,
                                    message: `${errRes.message ? errRes.message : 'FAIL : No return msg form basicexe'}`
                                })
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `FAIL : no error return from oracle`
                                })
                            }
                        }
                    } else {
                        return res.status(200).send({
                            status: false,
                            message: `ไม่พบ parameter quotationid`,
                        })
                    }

                } else {
                    return res.status(403).send({
                        status: 403,
                        message: `No permission`,
                    })
                }
            } else {
                return res.status(200).send({
                    status: false,
                    message: `FAIL : No return msg`
                })
            }
        } catch (e) {
            return res.status(200).send({
                status: false,
                message: `Error with message : ${e.message ? e.message : `No message`}`
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

    async MPLS_create_consent(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            let reqData = JSON.parse(req.body.item) as IReqMplsCreateConsent



            if (dbconnect) {

                /*... check permission ... */
                if (radmin !== 'Y') {

                    const signature_image = files.find((x) => x.fieldname == `signature_image`)
                    const witness_image = files.find((x) => x.fieldname === `witness_image`)

                    const signatureBuffer = signature_image ? this.utilService.imagetobuffer(signature_image) : null
                    const witnessBuffer = witness_image ? this.utilService.imagetobuffer(witness_image) : null

                    /* .... check variable param ...*/

                    if (
                        signatureBuffer &&
                        witnessBuffer &&
                        (reqData.quotationid !== '' && reqData.quotationid !== null)
                    ) {

                        if (dbconnect[0]) {

                            try {
                                /* ... check quotation is already exist ... */
                                const chkquotationexec = await dbconnect[0].execute(
                                    `
                                    SELECT QUO_KEY_APP_ID FROM MPLS_QUOTATION
                                    WHERE QUO_KEY_APP_ID = :QUOTATIONID
                                `, {
                                    QUOTATIONID: reqData.quotationid
                                }, {
                                    outFormat: 4002
                                })

                                if (chkquotationexec.rows.length === 1) {
                                    /* ... check consent is not already exist ... */
                                    const checkexistconsent = await dbconnect[0].execute(
                                        `
                                        SELECT * FROM MPLS_CONSENT 
                                        WHERE CONS_QUO_KEY_APP_ID = :CONS_QUO_KEY_APP_ID
                                    `, {
                                        CONS_QUO_KEY_APP_ID: reqData.quotationid
                                    }, { outFormat: 4002 })

                                    if (checkexistconsent.rows.length !== 0) {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `มีการทำรายการสร้าง Consent ไปแล้ว`,
                                            data: []
                                        })
                                    }

                                    /* ... create MPLS_CONSENT ... */
                                    const consentuuid = v4()
                                    let create_consentexec;
                                    try {
                                        create_consentexec = await dbconnect[0].execute(
                                            `
                                            INSERT INTO MPLS_CONSENT (
                                                CONS_QUO_KEY_APP_ID, APP_KEY_ID, 
                                                CUSTOMER_NAME, FRIST_NAME, LAST_NAME, 
                                                IS_CREDIT_CONSENT,
                                                IDENTITY_APPROVE_CONSENT_VALUE, 
                                                MOTOR_INSURANCE_CONSENT_VALUE, 
                                                NMOTOR_INSURANCE_CONSENT_VALUE, 
                                                ANALYZE_CONSENT_VALUE, INFO_CONSENT_VALUE, 
                                                INFO_PARTY_CONSENT_VALUE, ANALYZE_PARTY_CONSENT_VALUE, 
                                                PRDT_INFO_PARTY_CONSENT_VALUE, 
                                                FOLLOWUP_CONSENT_VALUE, INFO_DEVELOP_CONSENT_VALUE, 
                                                E_PAPER_CONSENT_VALUE, 
                                                SIGNATURE_IMAGE, 
                                                WITNESS_IMAGE 
                                            ) 
                                            VALUES 
                                                (
                                                :CONS_QUO_KEY_APP_ID, :APP_KEY_ID, 
                                                :CUSTOMER_NAME, :FRIST_NAME, :LAST_NAME, 
                                                :IS_CREDIT_CONSENT, 
                                                :IDENTITY_APPROVE_CONSENT_VALUE, 
                                                :MOTOR_INSURANCE_CONSENT_VALUE, 
                                                :NMOTOR_INSURANCE_CONSENT_VALUE, 
                                                :ANALYZE_CONSENT_VALUE, :INFO_CONSENT_VALUE, 
                                                :INFO_PARTY_CONSENT_VALUE, :ANALYZE_PARTY_CONSENT_VALUE, 
                                                :PRDT_INFO_PARTY_CONSENT_VALUE, 
                                                :FOLLOWUP_CONSENT_VALUE, :INFO_DEVELOP_CONSENT_VALUE, 
                                                :E_PAPER_CONSENT_VALUE,
                                                :SIGNATURE_IMAGE, 
                                                :WITNESS_IMAGE 
                                                )
                                            `, {
                                            CONS_QUO_KEY_APP_ID: reqData.quotationid,
                                            APP_KEY_ID: consentuuid,
                                            CUSTOMER_NAME: reqData.consent_customer_name,
                                            FRIST_NAME: reqData.consent_first_name,
                                            LAST_NAME: reqData.consent_last_name,
                                            IS_CREDIT_CONSENT: reqData.is_credit_consent,
                                            IDENTITY_APPROVE_CONSENT_VALUE: reqData.identity_approve_consent_value,
                                            MOTOR_INSURANCE_CONSENT_VALUE: reqData.motor_insurance_consent_value,
                                            NMOTOR_INSURANCE_CONSENT_VALUE: reqData.nmotor_insurance_consent_value,
                                            ANALYZE_CONSENT_VALUE: reqData.analyze_consent_value,
                                            INFO_CONSENT_VALUE: reqData.info_consent_value,
                                            INFO_PARTY_CONSENT_VALUE: reqData.info_party_consent_value,
                                            ANALYZE_PARTY_CONSENT_VALUE: reqData.analyze_party_consent_value,
                                            PRDT_INFO_PARTY_CONSENT_VALUE: reqData.prdt_info_party_consent_value,
                                            FOLLOWUP_CONSENT_VALUE: reqData.followup_consent_value,
                                            INFO_DEVELOP_CONSENT_VALUE: reqData.info_develop_consent_value,
                                            E_PAPER_CONSENT_VALUE: reqData.e_paper_consent_value,
                                            SIGNATURE_IMAGE: signatureBuffer,
                                            WITNESS_IMAGE: witnessBuffer,
                                        }, {
                                            outFormat: 4002
                                        })

                                        /* ... update MPLS_QUOTATION (QUO_STATUS = '1') ... */
                                        let update_quotationexec
                                        try {
                                            update_quotationexec = await dbconnect[0].execute(
                                                `
                                                    UPDATE MPLS_QUOTATION 
                                                    SET QUO_STATUS = :QUO_STATUS, 
                                                        E_PAPER = :E_PAPER, 
                                                        QUO_CONSENT_ID = :QUO_CONSENT_ID
                                                    WHERE QUO_KEY_APP_ID = :QUO_KEY_APP_ID
                                            `, {
                                                QUO_STATUS: 0,
                                                E_PAPER: reqData.e_paper_consent_value == 1 ? 'Y' : 'N',
                                                QUO_CONSENT_ID: consentuuid,
                                                QUO_KEY_APP_ID: reqData.quotationid

                                            }, {
                                                outFormat: 4002
                                            })

                                            /* ... check all update and create success ... */

                                            if (update_quotationexec.rowsAffected === 1 || create_consentexec.rowsAffected === 1) {

                                                /* ... commit ... */

                                                /* ... update success ... */
                                                const commitall = await dbconnect[0].commit();
                                                try {
                                                    commitall

                                                    return res.status(200).send({
                                                        status: 200,
                                                        message: `ทำรายการสำเร็จ`,
                                                        data: []
                                                    })

                                                    /* ... Finish ... */

                                                } catch (e) {
                                                    return res.status(200).send({
                                                        status: 500,
                                                        message: `Commit data fail : ${e.message ? e.meesasge : 'No return message'}`,
                                                        data: []
                                                    })
                                                }
                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `ทำรายการไม่สำเร็จ Update record  : ${update_quotationexec.rowsAffected} , Create record (consent) : ${create_consentexec.rowsAffected}`,
                                                    data: []
                                                })
                                            }

                                        } catch (e) {
                                            console.log(`Fail create consent : ${e}`)
                                            return res.status(200).send({
                                                status: 500,
                                                message: `ข้อมูลเอกสารสัญญาไม่ถูกต้อง : ${e.message ? e.message : `No message`}`
                                            })
                                        }

                                    } catch (e) {
                                        console.log(`Fail create consent : ${e}`)
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ข้อมูลเอกสารสัญญาไม่ถูกต้อง : ${e.message ? e.message : `No message`}`
                                        })
                                    }

                                } else {
                                    return res.status(200).send({
                                        status: false,
                                        message: `เลข Quotation ID ไม่สามรถระบุใบคำขอนี้ได้`,
                                        data: []
                                    })
                                }

                                /* ... End trt catch execute sql ... */
                            } catch (e) {
                                return res.status(200).send({
                                    status: 500,
                                    mesage: `Fail to execute sql : ${e.message ? e.message : `No return msg`}`,
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
                            mesage: `Missing parameter arguement`,
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
    product-detail-tab page 
    (blank)
    ... */

    /* 
    career-and-purpose page
    */

    /* 
    image-attach 
    */

    /* 

    /*
    signature (consent)
    */

    /* 
    Send-Car
    */

    async getinsurancedetailbyid(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = req.query
            if (dbconnect) {

                if (dbconnect[0]) {

                    /* .... check parameter applicationid ... */
                    if (reqData.applicationid !== null && reqData.applicationid !== ``) {

                        const resultaddressinfoexec = await dbconnect[0].execute(
                            `
                                SELECT 
                                    X_CUST_MAPPING_EXT.APPLICATION_NUM,
                                    X_CUST_MAPPING_EXT.NET_FINANCE,
                                    X_CUST_MAPPING_EXT.MONTHLY,
                                    X_CUST_MAPPING_EXT.RATE_CHARGE,
                                    X_CUST_MAPPING_EXT.TERM,
                                    X_SAMM_CONTRACT.FIRST_DUE,
                                    -- X_PRODUCT_DETAIL.PRODUCT_CODE,
                                    X_PRODUCT_DETAIL.BRAND_CODE,
                                    X_PRODUCT_DETAIL.MODELCODE,
                                    BTW.F_GET_MODEL_NAME (X_PRODUCT_DETAIL.BRAND_CODE,X_PRODUCT_DETAIL.MODELCODE)  AS MODEL_NAME,
                                    X_CUST_MAPPING_EXT.INSURANCE_YEARS,
                                    X_INSURER_INFO.INSURER_NAME,
                                    BTW.GET_FACTORY_PRICE(X_PRODUCT_DETAIL.PRODUCT_CODE,X_PRODUCT_DETAIL.BRAND_CODE,X_PRODUCT_DETAIL.MODELCODE) AS TL_T1,
                                    X_CUST_MAPPING_EXT.COVERAGE_TOTAL_LOSS
                                FROM btw.X_CUST_MAPPING_EXT,btw.X_SAMM_CONTRACT, btw.X_PRODUCT_DETAIL,btw.X_INSURANCE,btw.X_INSURER_INFO
                                WHERE (X_CUST_MAPPING_EXT.APPLICATION_NUM =X_SAMM_CONTRACT.APPLICATION_NUM)
                                AND (X_CUST_MAPPING_EXT.APPLICATION_NUM =X_PRODUCT_DETAIL.APPLICATION_NUM)
                                AND (X_CUST_MAPPING_EXT.INSURANCE_CODE   =   X_INSURANCE.INSURANCE_CODE)
                                AND (X_INSURANCE.INSURER_CODE = X_INSURER_INFO.INSURER_CODE)
                                AND X_CUST_MAPPING_EXT.LOAN_RESULT='Y'
                                AND  X_CUST_MAPPING_EXT.APPLICATION_NUM = :applicationid
                            `,
                            {
                                applicationid: <string>(reqData.applicationid)
                            },
                            {
                                outFormat: 4002
                            }
                        )

                        /* ... check result query address info ... */

                        if (resultaddressinfoexec.rows.length !== 0) {

                            const resultaddressinfo = this.utilService.loopObjtolowerkey(resultaddressinfoexec.rows) as [IResGetinsurancedetailbyidData]
                            let returnData = new Object as IResGetinsurancedetailbyid
                            returnData.data = resultaddressinfo
                            returnData.status = 200
                            returnData.message = 'success'

                            return res.status(200).json(returnData);

                            /* ... Finish ... */

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบรายการ insurance detail (not found record)`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 200,
                            message: `Not Found parameter applicationid`,
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

    /* ... bypass-signature ... */

    async bypasssignature(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body.quotationid) as IReqBypasssignature
            const quotationid = reqData.quotationid ? reqData.quotationid : ''
            let validateQuo: boolean = false

            if (dbconnect) {

                if (dbconnect[0]) {

                    const customersig_image = files.find((x) => x.fieldname == `customersig_image`) ?? null
                    const witnesssig_image = files.find((x) => x.fieldname == `witnesssig_image`) ?? null

                    const customersigbuffer = customersig_image ? this.utilService.imagetobuffer(customersig_image) : null
                    const witnesssigbuffer = witnesssig_image ? this.utilService.imagetobuffer(witnesssig_image) : null

                    /* ... check request paramter ... */
                    if (quotationid && customersig_image && witnesssig_image) {

                        /* ... check quotation status (loan_result) ... */

                        const chkloanresultstatusexec = await dbconnect[0].execute(
                            `
                                SELECT QUO_KEY_APP_ID, CONTRACT_NO, LOAN_RESULT 
                                FROM MPLS_QUOTATION 
                                WHERE QUO_KEY_APP_ID = :quotationid
                            `, {
                            quotationid: quotationid
                        }, {
                            outFormat: 4002
                        })

                        if (chkloanresultstatusexec.rows.length == 1) {

                            /* ... check validate ... */
                            const chkloanresultstatus = this.utilService.toLowerKeys(chkloanresultstatusexec.rows[0]) as IExecChkloanresultstatus
                            validateQuo = chkloanresultstatus.loan_result == 'Y' ? false : true


                            if (!validateQuo) {

                                try {

                                    /* ... check content not already exits before insert ... */

                                    const chkrecentexitsexec = await dbconnect[0].execute(
                                        `
                                            SELECT CONS_QUO_KEY_APP_ID FROM MPLS_CONSENT
                                            WHERE CONS_QUO_KEY_APP_ID = :quotationid
                                        `, {
                                        quotationid: quotationid
                                    }, {
                                        outFormat: 4002
                                    })

                                    if (chkrecentexitsexec.rows.length == 0) {
                                        /* ... allow condition byapss ... */
                                        /* .... insert mpls_consent ... */
                                        try {

                                            const consentkeyid = v4()
                                            /* ... insert consent record to link with quotation record ... */

                                            const updatemplsconsentbypassexec = await dbconnect[0].execute(
                                                `
                                                    INSERT INTO MPLS_CONSENT 
                                                    (
                                                        CONS_QUO_KEY_APP_ID, 
                                                        APP_KEY_ID, 
                                                        SIGNATURE_IMAGE, 
                                                        WITNESS_IMAGE
                                                    )
                                                    VALUES 
                                                    (
                                                        :CONS_QUO_KEY_APP_ID, 
                                                        :APP_KEY_ID, 
                                                        :SIGNATURE_IMAGE, 
                                                        :WITNESS_IMAGE
                                                    )
                                                `,
                                                {
                                                    CONS_QUO_KEY_APP_ID: quotationid,
                                                    APP_KEY_ID: consentkeyid,
                                                    SIGNATURE_IMAGE: customersigbuffer,
                                                    WITNESS_IMAGE: witnesssigbuffer
                                                })

                                            console.log(`sussecc create consent bypass : ${updatemplsconsentbypassexec.rowsAffected}`)

                                            const resResultUpdate = updatemplsconsentbypassexec.rows

                                            return res.status(200).send({
                                                status: 200,
                                                message: `Create consent bypass Success`,
                                                data: resResultUpdate
                                            })

                                            /* ... Finish ... */

                                        } catch (e) {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `Error during during insert image (${e.message ? e.message : 'no return msg'})`
                                            })
                                        }

                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `Can't create, MPLS_consent was Duplicate`,
                                            data: []
                                        })
                                    }

                                } catch (e) {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `Error during check mpls_econsent record exits (${e.message ? e.message : 'no return msg'})`
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 200,
                                    message: 'quotation record not valid',
                                    data: chkloanresultstatus
                                })
                            }

                        } else if (chkloanresultstatusexec.rows.length == 0) {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่พบรายการ quotation ภายใต้ ID`
                            })
                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ไม่สามารถระบุรายการ quotation ได้ (duplicate) : (rowsAffected : ${chkloanresultstatusexec.rowsAffected ? chkloanresultstatusexec.rowsAffected : '-'})`
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `ตรวจไม่พบ parameter (customersig_image, witnesssig_image, quotationid)`,
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