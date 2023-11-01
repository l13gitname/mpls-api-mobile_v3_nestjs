import { IUtilReqObjtoparams } from '../interface/i-util-req-objtoparams.interface';
import { Injectable } from '@nestjs/common';

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
}
