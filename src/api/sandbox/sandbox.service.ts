import { Injectable, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment';

@Injectable()
export class SandboxService {

    constructor(
    ) {

    }

    async testmoment(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        try {

            const datestring: string = req.body.datestring
            const reg_date_current = moment(datestring, "DD/MM/YYYY").format("DD/MM/YYYY");
            return res.status(200).send({
                status: 200,
                message: `${reg_date_current}`,
                data: []
            })
        } catch (e) {
            return res.status(200).send({
                status: 500,
                message: `Error : ${e.message ? e.message : 'No return msg'}`,
                data: []
            })
        }
    }


}
