import { IResUser, IResUserData } from 'src/interface/i-res-user.interface';
import { Injectable, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';
import oracledb from 'oracledb';
import { IResUserV2, IResUserV2Data } from 'src/interface/i-res-user-v2.interface';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private dbconnect: DbService,
        private utilService: UtilityService,
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.findOnepost(username, pass);
        if (user) {
            const { ...result } = user;
            return result
        }
        return null;
    }

    async login(user: IResUserV2Data) {
        const payload = <IResUserToken>{
            ID: user.userid,
            username: user.username,
            status: user.status,
            admin_role: user.radmin,
            first_name: user.fname,
            last_name: user.lname,
            expire_date: user.expire_date,
            email: user.email
        }
        const access_token = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
        const res: IResUserV2 = {
            status: 200,
            token: access_token,
            data: user,
            message: `success`
        }

        return res

    }

    async loginget(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        req.headers['cache-control'] = 'no-cache' // === clear cache data ==
        let connection = await this.dbconnect.ConnectionDB()
        try {

            if (connection[0]) {
                const { username, password, channal } = req.query

                // === check usernae , password , channal contain data === 

                if (!(username && password && channal)) {
                    return res.status(200).send({
                        status: 500,
                        message: `กรอกข้อมูล username, password , channal ไม่ครบ`,
                        data: []
                    })
                }

                // === encrypt password === 
                const resultsencrypt = await connection[0].execute(`
                    select btw.TOOLKIT.encrypt (:password) as epassword from dual
                `, {
                    password: { val: password }
                },
                    {
                        outFormat: 4002 // oracledb.OBJECT
                    })

                if (resultsencrypt.rows.length == 0) {
                    const noresultFormatJson = {
                        status: 500,
                        message: 'enctypt service error'
                    }
                    return res.status(200).send(noresultFormatJson)
                } else {
                    let encryptpassword = resultsencrypt.rows[0]['EPASSWORD']
                    // === check user in oracledb with hash password ===
                    const resultuser = await connection[0].execute(`
                        select a.userid ,a.username, (b.emp_name) as fname , (b.emp_lname) as lname, b.email, a.radmin , a.status, TO_CHAR(a.DATE_CHPWS, 'DD/MM/YYYY') AS EXPIRE_DATE
                        from btw.users a , BTW.EMP b
                        where a.username = :username
                        and a.password = :encryptpassword
                        and a.userid = b.emp_id
                        and a.activate = 'T'
                    `, {
                        username: { val: username },
                        encryptpassword: encryptpassword
                    }, { outFormat: 4002 })

                    if (resultuser.rows.length == 0) {
                        return res.status(200).send({
                            status: 500,
                            message: 'not found user math with username and password',
                            data: []
                        })
                    } else {
                        const resData = resultuser.rows
                        const lowerResData = this.utilService.loopObjtolowerkey(resData)
                        return res.status(200).send({
                            status: 200,
                            message: `success`,
                            data: lowerResData
                        })
                    }
                }
            } else {
                /*.... can't connect oracle database ....*/

                /*... check error database return ...*/
                if (connection[1]) {
                    const errRes = connection[1]
                    return res.status(200).send({
                        status: 500,
                        message: `${errRes.message ? errRes.message : 'No return message inside DBError return'}`
                    })
                } else {
                    return res.status(200).send({
                        status: 500,
                        message: `Fail : can't connect database oracle`
                    })
                }
            }

        } catch (e) {
            return res.status(200).send({
                status: 500,
                data: `Error with message : ${e.message ? e.message : `No message`}`
            })
        } finally {
            if (connection) {
                if (connection[0]) {
                    try {
                        await connection[0].close();
                    } catch (e) {
                        return next(e);
                    }
                }
            }
        }
    }

    async findOneget(username: string, password: string)
    // : Promise<IUserData | undefined> 
    {
        try {

            const connection = await this.dbconnect.ConnectionDB()

            if (connection) {

                if (connection[0]) {
                    const resultsencrypt = await connection[0].execute(`
                    select btw.TOOLKIT.encrypt (:password) as epassword from dual
                `, {
                        password: { val: password }
                    },
                        {
                            outFormat: 4002 // oracledb.OBJECT
                        })

                    if (resultsencrypt.rows.length == 0) {
                        return undefined
                    } else {
                        let encryptpassword = resultsencrypt.rows[0]['EPASSWORD']
                        // === check user in oracledb with hash password ===
                        const resultbranch = await connection[0].execute(`
                        select a.userid ,a.username, (b.emp_name) as fname , (b.emp_lname) as lname, b.email, a.radmin , a.status, TO_CHAR(a.DATE_CHPWS, 'DD/MM/YYYY') AS EXPIRE_DATE
                        from btw.users a , BTW.EMP b
                        where a.username = :username
                        and a.password = :encryptpassword
                        and a.userid = b.emp_id
                        and a.activate = 'T'
                    `, {
                            username: { val: username },
                            encryptpassword: encryptpassword
                        }, { outFormat: 4002 })

                        if (resultbranch.rows.length == 0) {
                            return undefined
                        } else {
                            const resData = resultbranch.rows
                            const lowerResData = this.utilService.loopObjtolowerkey(resData)[0] as IResUserData
                            return lowerResData
                        }
                    }
                } else {
                    if (connection[1]) {
                        const errRes = connection[1]
                        return {
                            status: 500,
                            message: `${errRes.message ? errRes.message : 'No return message inside DBError return'}`
                        }
                    } else {
                        return {
                            status: 500,
                            message: `Fail : can't connect database oracle`
                        }
                    }
                }

            }

        } catch (e) {
            return undefined
        }
    }

    async findOnepost(username: string, password: string)
    // : Promise<IUserData | undefined> 
    {
        // return this.users.find(user => user.username === username);
        try {

            const connection = await this.dbconnect.ConnectionDB()

            if (connection) {
                if (connection[0]) {
                    const resultsencrypt = await connection[0].execute(`
                  select btw.TOOLKIT.encrypt (:password) as epassword from dual
              `, {
                        password: { val: password }
                    },
                        {
                            outFormat: 4002 // oracledb.OBJECT
                        })

                    if (resultsencrypt.rows.length == 0) {
                        return undefined
                    } else {
                        let encryptpassword = resultsencrypt.rows[0]['EPASSWORD']
                        // === check user in oracledb with hash password ===
                        const resultbranch = await connection[0].execute(`
                      select a.userid ,a.username, (b.emp_name) as fname , (b.emp_lname) as lname, b.email, a.radmin , a.status, TO_CHAR(a.DATE_CHPWS, 'DD/MM/YYYY') AS EXPIRE_DATE
                      from btw.users a , BTW.EMP b
                      where a.username = :username
                      and a.password = :encryptpassword
                      and a.userid = b.emp_id
                      and a.activate = 'T'
                  `, {
                            username: { val: username },
                            encryptpassword: encryptpassword
                        }, { outFormat: 4002 })

                        if (resultbranch.rows.length == 0) {
                            return undefined
                        } else {
                            const resData = resultbranch.rows
                            const lowerResData = this.utilService.loopObjtolowerkey(resData)[0] as IResUserV2Data
                            return lowerResData
                        }
                    }
                } else {
                    if (connection[1]) {
                        const errRes = connection[1]
                        return {
                            status: 500,
                            message: `${errRes.message ? errRes.message : 'No return message inside DBError return'}`
                        }
                    } else {
                        return {
                            status: 500,
                            message: `Fail : can't connect database oracle`
                        }
                    }
                }
            }


        } catch (e) {
            return undefined
        }
    }

    async validlogin(@Req() req: Request, @Res() res: Response) {
        const resUser = await this.findOnepost(req.body.username, req.body.password)
        if (resUser) {
            /*... check return type of reqUser from findOnepost (IResUserV2Data | {status: number, message: string} ***error*** )  ...*/
            if ('userid' in resUser) {
                const resData = await this.login(resUser)
                return res.status(200).send(resData)
            } else {
                return res.status(200).send({
                    status: 500,
                    message: `${resUser.message ? resUser.message : 'No return err msg from findOnepost (login)'}`
                })
            }
        }
        return res.status(200).send({
            status: 500,
            message: `รหัสผู้ใช้งานไม่ถูกต้อง / ไม่พบไอดีผู้ใช้งาน`
        })
    }
}