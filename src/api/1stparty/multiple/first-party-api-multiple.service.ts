import { Inject, Injectable, Next, Req, Res, UploadedFile, UploadedFiles } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, Response, NextFunction } from 'express';
import { of } from 'rxjs';
import { DbService } from 'src/db/db.service';
import { UtilityService } from 'src/utility/utility.service';

@Injectable()
export class FirstPartyApiMultipleService {
    constructor(
        @Inject(REQUEST) private request: Request,
        private utilService: UtilityService,
        private dbconnect: DbService
    ) {

    }

    async MPLS_create_image_attach_file_party_multiple(@UploadedFiles() image_file: Array<Express.Multer.File>, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {

        console.log(image_file)

        return of({})
    }
}
