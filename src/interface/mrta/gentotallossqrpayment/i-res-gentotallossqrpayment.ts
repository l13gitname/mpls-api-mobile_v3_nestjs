// export interface IResGentotallossqrpaymentFile {
//     type: string;
//     data: number[];
// }

export interface IResGentotallossqrpaymentData {
    ref_pay_num: string;
    image_file: ArrayBuffer[];
    bill_payment: string;
    item_price: number;
    name: string;
    sname: string;
}

export interface IResGentotallossqrpayment {
    status: number;
    message: string;
    data: IResGentotallossqrpaymentData[];
}
