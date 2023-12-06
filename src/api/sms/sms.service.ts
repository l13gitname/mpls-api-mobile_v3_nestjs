import { Injectable, Next, Req, Res } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import { User } from '../decorator/user.decorator';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { Request, Response, NextFunction } from 'express';
import { IReqSendsmsconfirmpayment } from 'src/interface/sms/sendsmsconfirmpayment/i-req-sendsmsconfirmpayment.interface';
import { IReqSendsms } from 'src/interface/sms/sendsms/i-req-sendsms.interface';
import { IResSmssuccess } from 'src/interface/sms/sendsms/i-res-smssuccess.interface';
import { IResSmsfail } from 'src/interface/sms/sendsms/i-res-smsfail.interface';
const sdk = require('api')('@thaibulksms/v1.0#3f3jj5gxlo72a68r');



@Injectable()
export class SmsService {
    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService
    ) { }

    /*... Test servise sms here ... */
    async testsmsservice(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {


        const userid = user.ID
        const radmin = user.admin_role
        const reqData = req.body as { message: string, phone_no: string }

        try {

            if (
                reqData.phone_no &&
                reqData.message
            ) {

                const smssend = await this.sendsms({ phone_no: reqData.phone_no, message: reqData.message })

                if (smssend[0]) {
                    return res.status(200).send({
                        status: 200,
                        message: `Success`,
                        data: []
                    })
                } else {
                    if (smssend[1]) {
                        return res.status(200).send({
                            status: 500,
                            messge: `Fail During send SMS : ${smssend[1].error.description ? smssend[1].error.description : 'no sms return msg'}`,
                            data: []
                        })
                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `Fail During send SMS (no return msg)`
                        })
                    }
                }

            } else {
                return res.status(200).send({
                    status: 500,
                    message: `missing parameters \n
                    phone_no : ${reqData.phone_no ? `true` : `false`} \n
                    message : ${reqData.message ? `true` : `false`}`
                })
            }
        } catch (e) {
            return res.status(200).send({
                status: 500,
                message: `Error test send sms : ${e.message ? e.message : `no return msg`}`,
                data: []
            })
        }

    }

    async sendsmsconfirmpayment(@Req() req: Request, @User() user: IResUserToken, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            let responseSendsms: any
            let mapvaluesms: any
            const userid = user.ID
            const radmin = user.admin_role
            const reqData = JSON.parse(req.body) as IReqSendsmsconfirmpayment

            if (dbconnect) {

                if (dbconnect[0]) {

                    /* ... check allow permission on parameter ... */
                    if (reqData.smsserviceallow !== 0) {

                        /* ... check paramters contain ... */
                        if (
                            reqData.phone_no &&
                            reqData.sms_message &&
                            reqData.sender &&
                            reqData.force
                        ) {

                            /* ... create instance sms api ... */

                            responseSendsms = await this.sendsms({ phone_no: reqData.phone_no, message: reqData.sms_message })


                            if (responseSendsms[0]) {

                                /* ... send sms success ... */

                                mapvaluesms = this.mapnewresponsearray(responseSendsms[0])

                                /* ... check type data format ... */

                                if (mapvaluesms) {

                                    try {


                                        const createlogsmsapiexec = await dbconnect[0].execute(
                                            `
                                            INSERT INTO MPLS_SMS_RESPONSE (
                                                REMAINING_CREDIT,
                                                TOTAL_USE_CREDIT,
                                                CREDIT_TYPE,
                                                PHONENUMBER,
                                                MESSAGE_ID,
                                                USED_CREDIT,
                                                ERROR_CODE,
                                                ERROR_NAME,
                                                ERROR_DESCRIPTION
                                            ) VALUES (
                                                :REMAINING_CREDIT,
                                                :TOTAL_USE_CREDIT,
                                                :CREDIT_TYPE,
                                                :PHONENUMBER,
                                                :MESSAGE_ID,
                                                :USED_CREDIT,
                                                :ERROR_CODE,
                                                :ERROR_NAME,
                                                :ERROR_DESCRIPTION
                                            `,
                                            {
                                                REMAINING_CREDIT: mapvaluesms.remaining_credit,
                                                TOTAL_USE_CREDIT: mapvaluesms.total_use_credit,
                                                CREDIT_TYPE: mapvaluesms.credit_type,
                                                PHONENUMBER: mapvaluesms.phonenumber,
                                                MESSAGE_ID: mapvaluesms.message_id,
                                                USED_CREDIT: mapvaluesms.used_credit,
                                                ERROR_CODE: mapvaluesms.error_code,
                                                ERROR_NAME: mapvaluesms.error_name,
                                                ERROR_DESCRIPTION: mapvaluesms.error_description
                                            },
                                            {
                                                autoCommit: false
                                            })

                                        if (createlogsmsapiexec) {

                                            /* ... commit all execute ... */
                                            const commitall = await dbconnect[0].commit()

                                            try {

                                                commitall

                                                return res.status(200).send({
                                                    status: 200,
                                                    message: `Success`,
                                                    data: []
                                                })

                                                /* ... Finish ... */
                                            } catch (e) {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `Error when try to commit insert sms log : ${e.message ? e.message : `no return msg`}`,
                                                    data: []
                                                })
                                            }

                                        } else {
                                            return res.status(400).send({
                                                status: 400,
                                                message: `Log Stamp error`,
                                                data: []
                                            })
                                        }

                                    } catch (e) {
                                        return res.status(200).send({
                                            status: 500,
                                            mesage: `Error during insert sms log : ${e.message ? e.message : `no return msg`}`,
                                            data: []
                                        })
                                    }
                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `Wrong format data to create log`,
                                        data: []
                                    })
                                }
                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    message: `ไม่พบ Responses SMS API`
                                })
                            }


                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `mission parameters \n 
                                phone_no : ${reqData.phone_no ? `true` : `false`} \n
                                sms_message : ${reqData.sms_message ? `true` : `false`} \n
                                sender : ${reqData.sender ? `true` : `false`} \n
                                force : ${reqData.force ? `true` : `false`} \n`
                            })
                        }
                    } else {
                        return res.status(200).send({
                            status: 500,
                            message: `Unallow to call service`,
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

    async sendsms(param: IReqSendsms): Promise<[IResSmssuccess, IResSmsfail]> {

        /* ... this clas build on 06/12/2023 depend on api thaibulk v1.0#3f3jj5gxlo72a68r ... */

        try {
            sdk.auth(process.env.SMS_API_KEY, process.env.SMS_API_SECRET)
            const responseSms = await sdk.postSms({
                msisdn: param.phone_no,
                message: param.message,
                sender: 'MICROPLUS',
                force: 'corporate',
            })

            /* ... Check create SMS success ... */
            if (responseSms.status == 201) {
                /* ... send return success message ... */
                return [responseSms.data, null]
            } else {
                return [null, null]
            }

        } catch (e) {
            /* ... send return error message ... */
            return [null, e.data]
        }

    }

    mapnewresponsearray(resArray: any) {

        if (!resArray.error) {
            resArray = {
                remaining_credit: resArray.remaining_credit ? resArray.remaining_credit : '',
                total_use_credit: resArray.total_use_credit ? resArray.total_use_credit : '',
                credit_type: resArray.credit_type ? resArray.credit_type : '',
                phonenumber: resArray.phone_number_list[0].number ? resArray.phone_number_list[0].number : '',
                message_id: resArray.phone_number_list[0].message_id ? resArray.phone_number_list[0].message_id : '',
                used_credit: resArray.phone_number_list[0].used_credit ? resArray.phone_number_list[0].used_credit : '',
                error_code: '',
                error_name: '',
                error_description: '',
            }
        } else {
            resArray = {
                remaining_credit: '',
                total_use_credit: '',
                credit_type: '',
                phonenumber: '',
                message_id: '',
                used_credit: '',
                error_code: resArray.error.code ? resArray.error.code : '',
                error_name: resArray.error.name ? resArray.error.name : '',
                error_description: resArray.error.description ? resArray.error.description : '',
            }
        }
        return resArray
    }
}
