import { HttpException, HttpStatus, Inject, Injectable, Next, Req, Res, Scope, UploadedFile, UploadedFiles } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { IReqDipchApi } from 'src/interface/i-req-dipch-api.interface';
import { IResDipchApi } from 'src/interface/i-res-dipch-api.interface';
import axios from 'axios';
import { DbService } from 'src/db/db.service';
import { IResUserToken } from 'src/interface/i-res-user-token.interface';
import { UtilityService } from 'src/utility/utility.service';
import { BindParameters } from 'oracledb';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class FirstPartyApiService {

    errmsg: IResDipchApi = {
        number: 400,
        message: 'การยืนยันตนไม่สำเร็จ (Missing Token)',
        data: []
    }

    constructor(
        @Inject(REQUEST) private request: Request,
        private utilService: UtilityService,
        private dbconnect: DbService
    ) { }


    MPLS_DIPCH_get_dipchip_info(): Observable<IResDipchApi> {

        const req = this.request
        const reqBody: IReqDipchApi = { ...req.body }
        const token = <IResUserToken>(req.user)
        const userid = token.ID

        return from(this.getdipchiptoken(userid))
            .pipe(
                switchMap(async value => {
                    reqBody.token = value.data[0].token_key ? value.data[0].token_key : '';
                    const url = `${process.env.DIPCH_HEADER}${process.env.DIPCH_API}/CardReader/Get_Personal_Info`

                    try {
                        const response = await axios.put(url, reqBody);

                        return response.data

                    } catch (error) {
                        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }),
                catchError((err) => {
                    return throwError(() => this.errmsg)
                })
            );

    }

    async getdipchiptoken(userid: string) {

        try {

            console.log(`this is userid for check token : ${userid}`)
            if (!userid) {
                return {
                    status: 400,
                    message: `ไม่พบเลข USERID (TOKEN)`,
                    data: []
                }
            }

            const str_dcToken = `SELECT USERID , TOKEN_KEY
            FROM BTW.USERS
            WHERE USERID = :USERID`

            const bindparam_dctoken = { userid }
            const objBind = this.utilService.objecttobindparams(bindparam_dctoken)

            if (objBind.success) {
                const bindparam: BindParameters = objBind.data
                try {
                    const dcToken = await this.dbconnect.internal_executebinding(str_dcToken, bindparam)

                    if (dcToken.rows.length == 0) {
                        return {
                            status: 400,
                            message: `ไม่พบ USERID (DB)`
                        }
                    }

                    if (dcToken.rows.length > 1) {
                        return {
                            status: 400,
                            message: `DUPLICATE USERID (DB)`
                        }
                    }

                    if (dcToken.rows.length == 1) {
                        const resData = dcToken.rows
                        const lowerResData = this.utilService.loopObjtolowerkey(resData)
                        return {
                            status: 200,
                            message: 'success',
                            data: lowerResData
                        }
                    }
                }
                catch (e) {

                }

            } else {
                // === fail to build bindParameters from obj ====
                return {
                    status: 500,
                    message: objBind.message,
                    data: []
                }
            }


        } catch (e) {
            console.error(e)
            return {
                status: 400,
                message: `Fail to Get DIP CHIP token`,
                data: []
            }
        }
    }


    async MPLS_create_image_attach_file_party(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        const token = <IResUserToken>(req.user)

        /*.... check header contain ...*/
        // if (!token) {
        //     return of({ status: 500, message: `This api require header`, data: [] })
        // }

        // const userid = token.ID
        // const username = token.username
        // const admin_role = token.admin_role

        // /*... check user role ...*/
        // if (admin_role == 'Y') {
        //     return of({ status: 403, message: 'No Permission for admin role', data: [] })
        // }

        console.log(file)

        return of({})
    }

    async MPLS_create_image_attach_file_party_multiple(@UploadedFile() files: Express.Multer.File, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        console.log(files)

        return of({})
    }


}