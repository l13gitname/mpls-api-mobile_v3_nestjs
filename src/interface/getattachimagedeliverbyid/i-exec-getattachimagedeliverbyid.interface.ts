export interface IExecGetattachimagedeliverbyidData {
    image_name: string;
    image_type: string;
    image_code: string;
    image_file: any
}

export interface IExecGetattachimagedeliverbyid {
    status: number;
    message: string;
    data: IExecGetattachimagedeliverbyidData[];
}

