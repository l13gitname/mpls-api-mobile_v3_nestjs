import { IUtilReqObjtoparams } from '../interface/i-util-req-objtoparams.interface';
import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class UtilityService {

    loopObjtolowerkey(darray: any[]) {
        let arrayobjlower = []
        for (let i = 0; i < darray.length; i++) {
            arrayobjlower.push(this.toLowerKeys(darray[i]))
        }
        return arrayobjlower;
    }

    toLowerKeys(obj: Object) {
        return Object.keys(obj).reduce((accumulator, key) => {
            accumulator[key.toLowerCase()] = obj[key];
            return accumulator;
        }, {});
    }

    isNumber(str: string): boolean {
        if (typeof str !== 'string') {
            return false;
        }

        if (str.trim() === '') {
            return false;
        }

        return !Number.isNaN(Number(str));
    }

    objecttobindparams(obj: Object): IUtilReqObjtoparams {
        try {

            let arrayobj = {}
            Object.entries(obj).forEach(([key, value], index) => {
                arrayobj[key] = { val: value }
            });

            return {
                message: 'success',
                success: true,
                data: arrayobj
            }


        } catch (e) {
            const data: IUtilReqObjtoparams = {
                message: `Error: ${e}`,
                success: false,
                data: []
            }

            return data
        }

    }


    /* .... image handle ... */
    imagetobuffer(file: Express.Multer.File) {
        return fs.readFileSync(file.path)
    }

    /* ... use in MPLS_create_send_car_deliver_and_loyalty_consent ... */
    createImageInfo(file: Express.Multer.File, code: string, imageData: any[], quotationid: string) {
        let image = <any>{}
        const filename = file[0].fieldName
        const filetype = file[0].headers['content-type']
        const readfileimage = fs.readFileSync(file[0].path)
        image.filename = filename
        image.filetype = filetype
        image.keyid = v4()
        image.quokeyid = quotationid
        image.status = 0
        image.filedata = readfileimage
        image.code = code
        imageData.push(image)
        return imageData
    }

}
