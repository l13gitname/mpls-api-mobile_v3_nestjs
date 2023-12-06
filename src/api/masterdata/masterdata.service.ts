import { BindParameters } from 'oracledb';
import { UtilityService } from 'src/utility/utility.service';
import { DbService } from 'src/db/db.service';
import { Injectable, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment';
import { IReqMplsCalculateMotoYear } from 'src/interface/master/MPLS_calculate_moto_year/i-req-mpls_calculate_moto_year';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';

@Injectable()
export class MasterdataService {

    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) {

    }

    async getmasterquotationstatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT LOAN_RESULT_CODE AS STATUS , 
                            LOAN_RESULT_NAME AS STATUSTEXT 
                            FROM BTW.X_LOAN_RESULT_P`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterbranch(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        const strsql = `SELECT BRANCH_CODE, BRANCH_NAME 
                        FROM BTW.BRANCH_P
                        ORDER BY BRANCH_CODE ASC`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterrate(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT  RATE
                FROM BTW.RATE_P 
                WHERE SIZE_CODE = :size_model 
                AND PRO_CODE = :pro_code 
                AND BUSI_CODE = :bussiness_code
                AND TRUNC(SYSDATE) BETWEEN TRUNC(ST_DATE) AND TRUNC(NVL(EN_DATE,SYSDATE))
                ORDER BY RATE
            `

        const bindparam: BindParameters = {
            size_model: { val: req.query.size_model },
            pro_code: { val: req.query.pro_code }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getmasterterm(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const reqData = req.query
        // let quotationid: string = (req.body as IReqGetquotationbyid).quotationid
        const strsql =
            `
            SELECT TERM
            FROM BTW.TENOR_P
            WHERE SIZE_CODE = :size_model
            AND PRO_CODE = :pro_code
            AND BUSI_CODE = :bussiness_code
            AND TRUNC(SYSDATE) BETWEEN TRUNC(ST_DATE) AND NVL(TRUNC(EN_DATE),TRUNC(SYSDATE))
            AND BTW.PKG_CALCULATE.RATE_EFFECTIVE(ROUND(TRUNC(BTW.PKG_CAL_VAT.F_GET_AMOUNT_NO_VAT( :net_finance, BTW.GET_VAT (SYSDATE)),3),2),TERM,ROUND(TRUNC(BTW.PKG_CAL_VAT.F_GET_AMOUNT_NO_VAT(CEIL(round(BTW.pkg_installment.CAL_MONTHLY(:net_finance, TERM , :rate ),2)), BTW.GET_VAT (SYSDATE)),3),2))*12 <= (SELECT RATE FROM BTW.EFF_RATE_P WHERE TYPE_CODE = '1')
            AND TERM >= BTW.GET_MIN_TERM_RATE_P(PRO_CODE,SIZE_CODE,SYSDATE, :rate, :bussiness_code)
            ORDER BY TERM
        `
        const bindparam: BindParameters = {
            size_model: { val: reqData.size_model ? reqData.size_model : '' },
            pro_code: { val: '01' },
            rate: { val: reqData.rate ? reqData.rate : null },
            net_finance: { val: reqData.net_finance ? reqData.net_finance : null },
            bussiness_code: { val: reqData.bussiness_code ? reqData.bussiness_code : '' }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getmasterimage(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT * FROM MPLS_MASTER_IMAGE_P`
        return await this.basicexecute(req, res, strsql)
    }

    async getmastertitle(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT * FROM BTW.TITLE_P`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterdealer(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT DL_CODE ,DL_FNAME||' '||DL_NAME||' '||DL_NAME DL_NAME
                FROM BTW.X_DEALER_P
                WHERE ACTIVE_STATUS = 'Y'
                AND PRODUCT_ITEM = :PRO_CODE
                ORDER BY DL_CODE
            `
        const bindparam: BindParameters = {
            PRO_CODE: { val: req.query.pro_code }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getmasterdealergrade(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT XDP.DL_CODE, SNP.*
                        FROM BTW.X_DEALER_P XDP, BTW.SELLER_NOTICE_P SNP
                        WHERE XDP.SL_NOTICE_CODE = SNP.SL_NOTICE_CODE
                        AND XDP.DL_CODE = :DL_CODE`
        const bindparam: BindParameters = {
            DL_CODE: { val: req.query.dl_code }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }


    async getmasterprovince(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT PROV_CODE, PROV_NAME FROM BTW.PROVINCE_P`
        return await this.basicexecute(req, res, strsql)
    }

    async getmastercarcheckstatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT DETAILS, STATUS 
        FROM ESTIMATE_REPO_CHECK_MASTER_P EP
        WHERE EP.ON_ACTIVE = '1' ORDER BY STATUS`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterinsurance(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT A.INSURER_CODE, C.INSURER_NAME, B.YEARS_INSUR, B.PREMIUM_INSUR, A.INSURANCE_CODE
                FROM X_INSURANCE A
                JOIN X_INSURANCE_DETAIL B ON A.INSURANCE_CODE = B.INSURANCE_CODE
                JOIN X_INSURER_INFO C ON A.INSURER_CODE = C.INSURER_CODE
                WHERE C.CANCEL_STATUS = 'N'
                AND A.STATUS = 'Y'
                AND A.BUSINESS_CODE = :BUSSI_CODE 
                AND (BTW.GET_COVERAGE_COMPARE_MAX_LTV(
                        B.INSURANCE_CODE, 
                        TRUNC((:FACTORY_PRICE * BTW.GET_VALUE_NUM_MARKET_SETTING('004', :BUSSI_CODE, '01', :BRAND_CODE, :MODEL_CODE, :DL_CODE, SYSDATE)) / 100)
                    ) BETWEEN B.COVERAGE_INSUR_MIN AND B.COVERAGE_INSUR_MAX)
                ORDER BY B.YEARS_INSUR, B.PREMIUM_INSUR, A.INSURER_CODE, B.INSURANCE_CODE 
            `
        const bindparam: BindParameters = {
            p_max_ltv: { val: !Number.isNaN(Number(req.query.max_ltv)) ? Number(req.query.max_ltv as string) : 0, type: 2010 }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getmasterinsurer(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT A.INSURER_CODE, A.INSURANCE_CODE ,B.INSURER_NAME
                        FROM x_INSURANCE A , X_INSURER_INFO B
                        WHERE  A.INSURER_CODE = B.INSURER_CODE
                        AND A.STATUS = 'Y'
                        AND A.BUSINESS_CODE = '001'`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterinsuranceyear(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT DISTINCT B.YEARS_INSUR , A.INSURER_CODE , A.INSURANCE_CODE, C.INSURER_NAME  
                        FROM x_INSURANCE A, X_INSURANCE_DETAIL B , X_INSURER_INFO C
                        WHERE A.INSURANCE_CODE = B.INSURANCE_CODE
                        AND A.INSURER_CODE = C.INSURER_CODE
                        AND C.CANCEL_STATUS = 'N'
                        AND A.STATUS = 'Y'
                        AND A.BUSINESS_CODE = '001'
                        AND A.INSURER_CODE = :insurer_code
                        ORDER BY B.YEARS_INSUR ASC`
        const bindparam: BindParameters = {
            insurer_code: { val: req.query.insurer_code }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getmastersizemodel(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
            SELECT btw.GET_SIZE_MODEL
            (
                :pro_code , :brand_code, :model_code, :dealer_code, 
                :busi_code, :factory_price, trunc(sysdate), :moto_year 
            ) "SIZE"
            FROM DUAL
            `
        const bindparam: BindParameters = {
            pro_code: { val: req.query.pro_code },
            brand_code: { val: req.query.brand_code },
            model_code: { val: req.query.model_code },
            dealer_code: { val: req.query.dealer_code },
            busi_code: { val: req.query.busi_code },
            factory_price: { val: req.query.factory_price },
            moto_year: { val: req.query.moto_year },
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getmasteroccupation(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT ALL X_OCCUPA_CATEGORY_P.CAT_CODE,
                        X_OCCUPA_CATEGORY_P.CAT_NAME
                        FROM BTW.X_OCCUPA_CATEGORY_P`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasternegostatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT * FROM 
                        BTW.NEG_RESULT_P`
        return await this.basicexecute(req, res, strsql)
    }

    async getmastermariedstatus(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT CODE, NAME
                        FROM BTW.X_MARRIED_STATUS_P 
                        WHERE CODE NOT IN('0')
                        ORDER BY CODE ASC`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterhousetype(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT  CODE, NAME
                        FROM BTW.X_HOUSE_TYPE_P
                        WHERE CODE NOT IN('0')
                        ORDER BY CODE ASC`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterhouseownertype(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT  STATUS_CODE, STATUS_NAME
                        FROM BTW.X_HOUSEOWNERSTATUS_P
                        WHERE STATUS_CODE NOT IN('0')
                        ORDER BY STATUS_CODE ASC`
        return await this.basicexecute(req, res, strsql)
    }

    async getmasterbrand(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT BRAND_CODE, BRAND_NAME 
                FROM BTW.X_BRAND_P 
                WHERE PRO_CODE = '01' 
            `
        return await this.basicexecute(req, res, strsql)
    }

    async getmastermodel(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT B.BRAND_NAME, B.BRAND_CODE, P.MODEL_CODE,P.MODEL, P.PRICE,
                P.ENGINE_NO, P.ENGINE_NO_RUNNING, P.CHASSIS_NO, P.CHASSIS_NO_RUNNING, 
                P.MODEL_YEAR, P.CC ,P.MOTOR, P.MOTOR_NUMBER, P.BATTERY_TYPE, P.BATTERY_CAPACITY, P.FUEL_TYPE
                FROM  BTW.X_MODEL_P  P,BTW.X_BRAND_P B
                WHERE P.BRAND_CODE= B.BRAND_CODE
                AND   P.PRO_CODE = '01' 
            `
        return await this.basicexecute(req, res, strsql)
    }

    async getmastermodel_btw(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `SELECT B.BRAND_NAME, B.BRAND_CODE, P.MODEL_CODE,P.MODEL, P.PRICE,
        P.ENGINE_NO, P.ENGINE_NO_RUNNING, P.CHASSIS_NO, P.CHASSIS_NO_RUNNING
        FROM  X_MODEL_P  P, X_BRAND_P B
        WHERE P.BRAND_CODE = B.BRAND_CODE
        AND   P.PRO_CODE = '01' `
        return await this.basicexecute(req, res, strsql)
    }

    async querybasicexecute(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = req.body.strsql
        return await this.basicexecute(req, res, strsql)
    }

    async querybasicexecutebinding(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const { strsql, bindparams } = req.body
        const objBind = this.utilService.objecttobindparams(bindparams)
        console.log(`objBind : ${JSON.stringify(objBind)}`)
        if (objBind.success) {
            const bindparam: BindParameters = objBind.data
            return await this.basicexecutebinding(req, res, strsql, bindparam)
        } else {
            // === fail to build bindParameters from obj ====
            return res.status(200).send({
                status: 500,
                message: objBind.message,
                data: []
            })
        }
    }

    async getmasterbussiness(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        const strsql =
            `
                SELECT * FROM BTW.X_BUSSINESS_P
            `
        return await this.basicexecute(req, res, strsql)
    }

    async MPLS_calculate_moto_year(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        try {

            const reg_date = ((req.body) as IReqMplsCalculateMotoYear).reg_date

            /* ... set format date of reg_date parameter ... */
            let reg_date_dtype;
            if (reg_date) {
                const reg_date_current = moment(new Date(reg_date)).format("DD/MM/YYYY")
                reg_date_dtype = reg_date_current

                /* ... execute stage ... */
                try {
                    const strsql =
                        `
                            SELECT
                                BTW.GET_MOTO_AGE(TRUNC(BTW.BUDDHIST_TO_CHRIS_F(TO_DATE(:REG_DATE, 'DD/MM/YYYY'))), TRUNC(SYSDATE)) AS MOTO_YEAR
                            FROM DUAL
                        `
                    const bindparam: BindParameters = {
                        REG_DATE: { val: reg_date_dtype }
                    }
                    return await this.basicexecutebinding(req, res, strsql, bindparam)
                } catch (e) {
                    return res.status(200).send({
                        status: 500,
                        mesage: `Fail to execute data with binding : ${e.message ? e.message : `No return msg`}`,
                        data: []
                    })
                }
            } else {
                return res.status(200).send({
                    status: 500,
                    message: `ไม่พบ parameter reg_date`,
                    data: []
                })
            }

        } catch (e) {
            return res.status(200).send({
                status: 500,
                mesage: `Fail to convert reg_date : ${e.message ? e.message : `No return msg`}`,
                data: []
            })
        }


    }




    async getmasterfueltype(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        const strsql =
            `
            SELECT CODE, DETAIL 
            FROM BTW.FUEL_TYPE_P
        `
        return await this.basicexecute(req, res, strsql)
    }

    async getmaxltv(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql = `
                        SELECT
                            TRUNC((
                                BTW.PKG_ABOUT_PRODUCT.GET_AMT_FOR_LTV(
                                    :con_ref,
                                    :factory_price,
                                    :bussi_code
                                ) * BTW.GET_VALUE_NUM_MARKET_SETTING(
                                    '001',
                                    :bussi_code,
                                    :pro_code,
                                    :brand_code,
                                    :model_code,
                                    :dl_code,
                                    SYSDATE,
                                    :moto_year
                                )
                            ) / 100) AS maxltv
                        FROM
                            DUAL
                        `
        const bindparam: BindParameters = {
            factory_price: { val: req.query.factory_price },
            bussi_code: { val: req.query.bussi_code },
            pro_code: { val: req.query.pro_code },
            brand_code: { val: req.query.brand_code },
            model_code: { val: req.query.model_code },
            dl_code: { val: req.query.dl_code },
            moto_year: { val: req.query.moto_year },
            con_ref: { val: req.query.con_ref ? req.query.con_ref : '' }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getcoveragetotalloss(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
        SELECT
            BTW.GET_COVERAGE_COMPARE_MAX_LTV(
                :INSURANCE_CODE,
                TRUNC(
                    (:FACTORY_PRICE * BTW.GET_VALUE_NUM_MARKET_SETTING(
                        '004',
                        :BUSSI_CODE,
                        '01',
                        :BRAND_CODE,
                        :MODEL_CODE,
                        :DL_CODE,
                        SYSDATE
                    )) / 100
                )
            ) AS COVERAGE_TOTAL_LOSS
        FROM
            DUAL
        `
        const bindparam: BindParameters = {
            INSURANCE_CODE: { val: req.query.insurance_code ? req.query.insurance_code : '' },
            FACTORY_PRICE: { val: req.query.factory_price ? req.query.factory_price : '' },
            BUSSI_CODE: { val: req.query.bussi_code ? req.query.bussi_code : '' },
            BRAND_CODE: { val: req.query.brand_code ? req.query.brand_code : '' },
            MODEL_CODE: { val: req.query.model_code ? req.query.model_code : '' },
            DL_CODE: { val: req.query.dl_code ? req.query.dl_code : '' }
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    async getpaymentvalue(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
            SELECT CEIL(ROUND(
                btw.pkg_installment.CAL_MONTHLY(
                  NVL(:net_finance, 0),
                  NVL(TO_NUMBER(:term), 0),
                  NVL(TO_NUMBER(:rate), 0)
                ), 2)
              ) AS value
              FROM DUAL
            `
        const bindparam: BindParameters = {
            net_finance: { val: req.query.net_finance ? req.query.net_finance : null },
            term: { val: req.query.term ? req.query.term : null },
            rate: { val: req.query.rate ? req.query.rate : null },
        }
        return await this.basicexecutebinding(req, res, strsql, bindparam)
    }

    /* .... image-attach page ...*/

    async getimagetypeattach(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT * 
                FROM MPLS_MASTER_IMAGE_P
                WHERE IMAGE_CODE IN ('01', '02', '03', '04', '05', '06', '07', '08', '09', '10')
            `
        return await this.basicexecute(req, res, strsql)
    }

    async getimagetypeattachmultiple(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT * 
                FROM MPLS_MASTER_IMAGE_P
                WHERE IMAGE_CODE IN ('01', '02', '03', '04', '05', '06', '07', '08', '09', '10')
            `
        return await this.basicexecute(req, res, strsql)
    }

    /* ... mrta ... */
    async getmrtaseller(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {
        const strsql =
            `
                SELECT A.emp_id ,BTW.PKG_HR_INFO.GET_EMP_FULLNAME (A.EMP_ID) AS FULLNAME , LIFE_LICENSED_NO ,LIFE_START_DATE , LIFE_END_DATE
                FROM EMP A,BTW.X_LICENSED_INSURANCE B
                WHERE A.EMP_ID = B.EMP_ID
                AND NVL(A.LEAVE,'N')='N'
                AND TRUNC(SYSDATE) BETWEEN TRUNC(LIFE_START_DATE) AND TRUNC(LIFE_END_DATE)
                ORDER BY A.EMP_ID
            `
        return await this.basicexecute(req, res, strsql)
    }


    async basicexecute(@Req() req: Request, @Res() res: Response, executequery: string) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            if (dbconnect) {

                if (dbconnect[0]) {
                    const result = await dbconnect[0].execute(`
                        ${executequery}
                    `, {}, { outFormat: 4002 })

                    if (result.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'No contain data',
                            data: []
                        })
                    } else {
                        const resData = result.rows
                        const lowerResData = this.utilService.loopObjtolowerkey(resData)
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

            }
        } catch (e) {
            return res.status(200).send({
                status: 500,
                data: `Error with message : ${e.message ? e.message : `No message`}`
            })
        } finally {
            if (dbconnect) {
                if (dbconnect[0]) {
                    try {
                        await dbconnect[0].close();
                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            message: `Error : message : ${e.message ? e.message : ''}`,
                            data: []
                        })
                    }
                }
            }
        }
    }

    async basicexecutebinding(@Req() req: Request, @Res() res: Response, executequery: string, bindparam: BindParameters) {
        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            if (dbconnect) {

                if (dbconnect[0]) {
                    const result = await dbconnect[0].execute(`
                        ${executequery}
                    `, bindparam, { outFormat: 4002 })

                    if (result.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'No contain data',
                            data: []
                        })
                    } else {
                        let resData = result.rows

                        if ((req.url).includes(`getmasterterm`)) {
                            resData.map((item: { TERM: number }) => {
                                item.TERM = Number(item.TERM);
                                return item;
                            })
                        }
                        const lowerResData = this.utilService.loopObjtolowerkey(resData)
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
            if (dbconnect) {
                if (dbconnect[0]) {
                    try {
                        await dbconnect[0].close();
                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            message: `Error : message : ${e.message ? e.message : ''}`,
                            data: []
                        })
                    }
                }
            }
        }
    }

}
