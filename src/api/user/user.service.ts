import { AuthService } from 'src/auth/auth.service';
import { Injectable, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UtilityService } from 'src/utility/utility.service';
import { DbService } from 'src/db/db.service';
import oracledb, { BindParameter } from 'oracledb';
import { IReqForgetpassword } from 'src/interface/user/forgetpassword/i-req-forgetpassword';
import { IExecCheckmailvalid } from 'src/interface/user/forgetpassword/i-exec-checkmailvalid';
import { IExecChkdecrpytpassexec } from 'src/interface/user/forgetpassword/i-exec-chkdecrpytpassexec.interface';
import * as nodemailer from 'nodemailer';
import { IReqResetpassword } from 'src/interface/user/resetpassword/i-req-resetpassword';
import { IExecCheckusertypeexec } from 'src/interface/user/resetpassword/i-exec-checkusertypeexec.interface';


@Injectable()
export class UserService {

    constructor(
        private dbconnect: DbService,
        private utilService: UtilityService,
        private authService: AuthService
    ) {

    }

    async login(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        return await this.authService.loginget(req, res, next)
    }

    async findOneget(username: string, password: string) {
        return await this.authService.findOneget(username, password)
    }


    async findOnepost(username: string, password: string) {
        return await this.authService.findOnepost(username, password)
    }

    async validlogin(@Req() req: Request, @Res() res: Response) {
        return await this.authService.validlogin(req, res)
    }

    async forgetpassword(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {

            const reqData = JSON.parse(req.body) as IReqForgetpassword

            if (dbconnect) {

                if (dbconnect[0]) {


                    /* ... Check Email parameter ... */
                    if (reqData.email) {

                        /* ... check email is valid ... */
                        /* ... email in database (EMP) ... */

                        try {

                            const checkmailvalidexec = await dbconnect[0].execute(
                                `
                                    SELECT USERS.PASSWORD 
                                    FROM USERS 
                                    LEFT JOIN EMP 
                                    ON USERS.USERID = EMP.EMP_ID
                                    WHERE EMP.EMAIL = :email
                                ` ,
                                {
                                    email: reqData.email
                                },
                                {
                                    outFormat: 4002
                                }
                            )

                            if (checkmailvalidexec.rows.length !== 0) {

                                /* ... get password and decrypt ... */
                                const checkmailvalid = this.utilService.loopObjtolowerkey(checkmailvalidexec.rows) as [IExecCheckmailvalid]
                                const encryptpass = checkmailvalid[0].password
                                const chkdecrpytpassexec = await dbconnect[0].execute(
                                    `
                                        SELECT BTW.TOOLKIT.DECRYPT(:encryptpass) AS EPASSWORD 
                                        FROM DUAL
                                    `,
                                    {
                                        encryptpass: encryptpass
                                    },
                                    {
                                        outFormat: 4002
                                    }
                                )

                                if (chkdecrpytpassexec.rows.length == 1) {

                                    const chkdecrpytpass = this.utilService.loopObjtolowerkey(chkdecrpytpassexec.rows) as [IExecChkdecrpytpassexec]

                                    /* ... declare decrypt password ... */
                                    const decryptpass = chkdecrpytpass[0].epassword

                                    /* ... check variable for send email (PASSWORD and email) ... */

                                    if (reqData.email && decryptpass) {
                                        /* ... send email with USER password ... */
                                        try {

                                            let transporter = nodemailer.createTransport({
                                                host: "mail.online.inet.co.th",
                                                port: 587,
                                                secure: false, // true for 465, false for other ports
                                                tls:
                                                {
                                                    servername: 'mail.online.inet.co.th'
                                                },
                                                auth: {
                                                    user: 'info@microplusleasing.com', // generated ethereal user
                                                    pass: 'Mplus@2022', // generated ethereal password
                                                }

                                            })

                                            /* ... send mail with defined transport object ... */
                                            let info = await transporter.sendMail({
                                                from: 'info@microplusleasing.com', // sender address
                                                to: reqData.email, // list of receivers
                                                subject: "Recovery Password", // Subject line
                                                text: "รหัสผ่านสำหรับเข้าใช้งานระบบออกใบคำขอ (MPlus)", // plain text body
                                                html: `<b>รหัสผ่านสำหรับเข้าใช้งานของคุณคือ '${decryptpass}'</b>`, // html body
                                            })

                                            /* ... check success send email ... */
                                            if (info.accepted.length !== 0) {
                                                /* ... finish send email ... */

                                                return res.status(200).send({
                                                    status: 200,
                                                    message: `Email send successfuly`,
                                                    data: []
                                                })

                                                /* ... Finish ... */

                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `ส่ง Email ไม่สำเร็จ : ${info.response}`
                                                })
                                            }

                                        } catch (e) {
                                            console.error(e);
                                            return res.status(200).send({
                                                status: 500,
                                                message: `Fail duruing send email with nodemailer: ${e.message ? e.message : 'no return msg'}`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `เกิดข้อผิดพลาด กรุณาติดต่อแผนก IT (No password)`,
                                            data: []
                                        })
                                    }

                                } else if (chkdecrpytpassexec.rows.length > 1) {
                                    return res.status(200).send({
                                        status: 500,
                                        mesage: `เกิดข้อผิดพลาด กรุณาติดต่อแผนก IT`,
                                        data: []
                                    })
                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        mesage: `เกิดข้อผิดพลาด กรุณาติดต่อแผนก IT`,
                                        data: []
                                    })
                                }

                            } else {
                                return res.status(200).send({
                                    status: 500,
                                    mesaage: `ไม่พบ Email ในระบบ ติดต่อเจ้าหน้าที่`,
                                    data: []
                                })
                            }

                        } catch (e) {
                            return res.status(200).send({
                                status: 500,
                                mesage: `Error during execute query : ${e.message ? e.message : `No return msg`}`,
                                data: []
                            })
                        }

                    } else {
                        return res.status(200).send({
                            status: 500,
                            mesage: `missing parameter Email`,
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

    async resetpassword(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let dbconnect = await this.dbconnect.ConnectionDB()
        try {
            const reqData = JSON.parse(req.body) as IReqResetpassword

            if (dbconnect) {

                if (dbconnect[0]) {

                    try {

                        /* ... check parameters ... */

                        if (reqData.username && reqData.oldpassword && reqData.newpassword) {

                            /* ... check type of user (dealer or checker) ... */


                            const checkusertypeexec = await dbconnect[0].execute(
                                `
                                    SELECT 
                                        A.USERID,
                                        UPPER(A.USERNAME) AS USERNAME,
                                        UPPER(B.EMP_NAME) AS FNAME,
                                        UPPER(B.EMP_LNAME) AS LNAME,
                                        UPPER(B.EMAIL) AS EMAIL,
                                        UPPER(A.RADMIN) AS RADMIN,
                                        UPPER(A.STATUS) AS STATUS,
                                        NULL AS SELLER_ID,
                                        TO_CHAR(A.DATE_CHPWS, 'DD/MM/YYYY') AS EXPIRE_DATE,
                                        NULL AS CHECKER_CODE,
                                        NULL AS WITNESS_NAME,
                                        NULL AS WITNESS_LNAME,
                                        NULL AS WITNESS_TITLE_NAME,
                                        'CHECKER' AS CHANNEL_TYPE 
                                    FROM 
                                        BTW.USERS A
                                    JOIN 
                                        BTW.EMP B ON A.USERID = B.EMP_ID
                                    WHERE 
                                        UPPER(A.USERNAME) = UPPER(:username)
                                        AND a.password = UPPER(btw.TOOLKIT.encrypt(:oldpassword))
                                        AND A.ACTIVATE = 'T'

                                    UNION

                                    SELECT 
                                        A.USERID,
                                        UPPER(A.USERNAME) AS USERNAME,
                                        UPPER(B.DL_FNAME || ' ' || B.DL_NAME) AS FNAME,
                                        UPPER(B.DL_LNAME) AS LNAME,
                                        UPPER(B.DL_EMAIL) AS DL_EMAIL,
                                        UPPER(A.RADMIN) AS RADMIN,
                                        UPPER(A.STATUS) AS STATUS,
                                        UPPER(B.DL_CODE) AS SELLER_ID,
                                        TO_CHAR(A.DATE_CHPWS, 'DD/MM/YYYY') AS EXPIRE_DATE,
                                        UPPER(B.CHECKER_CODE) AS CHECKER_CODE,
                                        UPPER(C.EMP_NAME) AS WITNESS_NAME,
                                        UPPER(C.EMP_LNAME) AS WITNESS_LNAME,
                                        UPPER(D.TITLE_NAME) AS WITNESS_TITLE_NAME,
                                        'DEALER' AS CHANNEL_TYPE
                                    FROM 
                                        BTW.USERS A
                                    JOIN 
                                        BTW.X_DEALER_P B ON A.USERNAME = B.DL_CODE
                                    JOIN 
                                        BTW.EMP C ON B.CHECKER_CODE = C.EMP_ID
                                    JOIN 
                                        BTW.TITLE_P D ON C.TITLE_ID = D.TITLE_ID
                                    WHERE 
                                        UPPER(A.USERNAME) = UPPER(:username)
                                        AND a.password = UPPER(btw.TOOLKIT.encrypt(:oldpassword)) 
                                        AND UPPER(A.USER_TYPE) = 'P'
                                        AND A.ACTIVATE = 'T'
                                `,
                                {
                                    username: reqData.username,
                                    oldpassword: reqData.oldpassword
                                },
                                {
                                    outFormat: 4002
                                }
                            )

                            if (checkusertypeexec.rows.length == 1) {

                                const checkusertype = this.utilService.toLowerKeys(checkusertypeexec.rows[0]) as IExecCheckusertypeexec

                                /* ... get username form check result (25/10/2022) ... */

                                const resultusername = checkusertype.username // ext. 10654004

                                const userid = checkusertype.userid

                                /* ... check password not-repeat 3 time ... */

                                const chkpasswordrepeatexec = await dbconnect[0].execute(
                                    `
                                        SELECT * FROM    
                                            (
                                                SELECT * FROM
                                                    (SELECT USER_NAME, PASSWORD_NEW  FROM BTW.PASSWORD_LOG
                                                        WHERE USER_NAME = :username
                                                        ORDER BY UPD_DATETIME DESC
                                                    ) LPW 
                                                WHERE ROWNUM <= 3
                                            ) ONPW
                                        WHERE ONPW.PASSWORD_NEW = btw.TOOLKIT.encrypt(:newpassword)
                                    `, {
                                    username: resultusername,
                                    newpassword: reqData.newpassword
                                }, {
                                    outFormat: 4002
                                })

                                if (chkpasswordrepeatexec.rows.length == 0) {

                                    /* ... get expire time change from oracle X_CPS_INIT (25/12/2022) ... */

                                    const queryexpiredurationexec = await dbconnect[0].execute(
                                        `
                                            SELECT DETAIL 
                                            FROM BTW.X_CPS_INIT
                                            WHERE HEADER = 'DAY_CHANGE_PWS
                                        `, {}, {
                                        outFormat: 4002
                                    })

                                    if (queryexpiredurationexec.rows.length !== 0) {

                                        /* ... create expire duration ... */

                                        const queryexpireduration = this.utilService.toLowerKeys(queryexpiredurationexec.rows[0]) as { detail: string }

                                        const expireduration = queryexpireduration.detail

                                        if (expireduration) {


                                            /* ... update with new password (and add expire date next 3 month.) === (deprecate) (09/06/2023) ... */

                                            /* ... chage check expire date from field expire that plus auto from resetpassword to check with paremeter when login (P Thep Khor) (09/06/2023) instead  ... */

                                            /* *** ... (replace 'DATE_CHPWS = SYSDATE' instead of 'DATE_CHPWS = SYSDATE + :expireduration') (09/06/2023) ... *** */

                                            const updatenewpasswordexec = await dbconnect[0].execute(
                                                `
                                                    UPDATE BTW.USERS
                                                    SET PASSWORD = btw.TOOLKIT.encrypt(:newpassword),
                                                        DATE_CHPWS = SYSDATE
                                                    WHERE USERNAME = :resultusername
                                                    AND ACTIVATE = 'T'
                                                `,
                                                {
                                                    newpassword: reqData.newpassword,
                                                    resultusername: resultusername
                                                }, {
                                                outFormat: 4002
                                            })

                                            /* ... check update query result ... */

                                            if (updatenewpasswordexec.rowsAffected == 1) {

                                                /* ... insert password_log record (26/10/2022) ... */

                                                try {


                                                    const insertpasswordlogexec = await dbconnect[0].execute(
                                                        `
                                                            INSERT INTO BTW.PASSWORD_LOG (
                                                                USER_NAME, 
                                                                USER_ID, 
                                                                PASSWORD_OLD, 
                                                                PASSWORD_NEW, 
                                                                UPD_DATETIME 
                                                                )
                                                            VALUES (
                                                                :USER_NAME, 
                                                                :USER_ID, 
                                                                btw.TOOLKIT.encrypt(:PASSWORD_OLD), 
                                                                btw.TOOLKIT.encrypt(:PASSWORD_NEW), 
                                                                SYSDATE
                                                                )
                                                            `, {
                                                        USER_NAME: reqData.username,
                                                        USER_ID: userid,
                                                        PASSWORD_OLD: reqData.oldpassword,
                                                        PASSWORD_NEW: reqData.newpassword
                                                    })

                                                    if (insertpasswordlogexec.rowsAffected == 1) {

                                                        /* ... Success Update New Password ... */

                                                        /* ... commit stage ... */

                                                        const commitall = await dbconnect[0].commit();
                                                        try {
                                                            commitall

                                                            return res.status(200).send({
                                                                status: 200,
                                                                message: `อัพเดทรหัสผ่านสำเร็จ, กลับหน้า login เพื่อเข้าสู่ระบบ`,
                                                                data: []
                                                            })

                                                            /* ... Finish ... */
                                                        } catch (e) {

                                                            res.send(200).send({
                                                                status: 500,
                                                                message: `เกิดข้อผิดพลาดที่ server (commit stage) : ${e.message ? e.message : 'no return msg'}`
                                                            })
                                                        }
                                                    } else if (insertpasswordlogexec.rowsAffected == 0) {
                                                        return res.status(200).send({
                                                            status: 500,
                                                            message: `ทำรายการไม่สำเร็จ (update new password fail)`,
                                                            data: []
                                                        })
                                                    } else {
                                                        return res.status(200).send({
                                                            status: 500,
                                                            message: `ทำรายการไม่สำเร้จ (Can't verify identity record (rowsAffected : ${insertpasswordlogexec.rowsAffected ? insertpasswordlogexec.rowsAffected : '-'}))`,
                                                            data: []
                                                        })
                                                    }



                                                } catch (e) {

                                                    return res.status(200).send({
                                                        status: 500,
                                                        message: `สร้าง password log record ไม่สำเร็จ : ${e.message ? e.message : `no return msg`}`
                                                    })
                                                }

                                            } else if (updatenewpasswordexec.rowsAffected == 0) {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `ไม่สามารถอัพเดทรหัสผ่านได้ตามเงื่อนไข`,
                                                    data: []
                                                })
                                            } else {
                                                return res.status(200).send({
                                                    status: 500,
                                                    message: `ไม่สามารถอัพเดทรหัสผ่านได้ เงื่อนไขไม่ถูกต้อง (Duplication rows update for (${updatenewpasswordexec.rowsAffected ?? '-'}))`,
                                                    data: []
                                                })
                                            }


                                        } else {
                                            return res.status(200).send({
                                                status: 500,
                                                message: `ไม่พบการกำหนดค่า Expire duration ภายในระบบ`,
                                                data: []
                                            })
                                        }

                                    } else {
                                        return res.status(200).send({
                                            status: 500,
                                            message: `ไม่พบการกำหนดค่า expire duration บนระบบ`,
                                            data: []
                                        })
                                    }

                                } else {
                                    return res.status(200).send({
                                        status: 500,
                                        message: `Password ซ้ำกันภายใน 3 ครั้งล่าสุด กรุณากำหนด Password ใหม่`
                                    })
                                }

                            } else if (checkusertypeexec.rows.length == 0) {
                                return res.status(200).send({
                                    status: 500,
                                    message: `username หรือ password ไม่ถูกต้อง`,
                                    data: []
                                })
                            }

                        } else {
                            return res.status(200).send({
                                status: 500,
                                message: `ข้อมูลไม่ครบ ไม่สามารถเปลี่ยน password ได้`,
                                data: []
                            })
                        }

                    } catch (e) {
                        return res.status(200).send({
                            status: 500,
                            message: `Error during execute reset password (${e.message ? e.message : 'no return msg'})`,
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
